CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. CREATE TABLES
-- =========================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_id UUID,
    icon_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(19, 2),
    sale_price DECIMAL(19, 2),
    category_id UUID REFERENCES categories(id),
    stock_quantity INTEGER,
    status VARCHAR(50),
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    total_amount DECIMAL(19, 2),
    status VARCHAR(50),
    payment_method VARCHAR(50),
    shipping_address TEXT,
    order_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER,
    unit_price DECIMAL(19, 2)
);

-- =========================================================================
-- 2. CATEGORIES 
-- =========================================================================
INSERT INTO categories (id, name, slug, icon_url) VALUES 
(gen_random_uuid(), 'Gaming & Steam', 'gaming-steam', 'https://api.dicebear.com/7.x/identicon/svg?seed=gaming'),
(gen_random_uuid(), 'Phần mềm Bản quyền', 'software-license', 'https://api.dicebear.com/7.x/identicon/svg?seed=software'),
(gen_random_uuid(), 'Giải trí & Phim ảnh', 'entertainment-movie', 'https://api.dicebear.com/7.x/identicon/svg?seed=movie'),
(gen_random_uuid(), 'Thẻ Quà tặng (Gift Cards)', 'gift-cards', 'https://api.dicebear.com/7.x/identicon/svg?seed=gift'),
(gen_random_uuid(), 'Học tập & Công việc', 'education-work', 'https://api.dicebear.com/7.x/identicon/svg?seed=edu'),
(gen_random_uuid(), 'Nạp tiền điện thoại', 'mobile-recharge', 'https://api.dicebear.com/7.x/identicon/svg?seed=mobile'),
(gen_random_uuid(), 'Khác', 'others', 'https://api.dicebear.com/7.x/identicon/svg?seed=others')
ON CONFLICT (slug) DO NOTHING;

-- =========================================================================
-- 3. PRODUCTS (Manual Sample Seed - Premium Products)
-- =========================================================================
INSERT INTO products (id, title, description, price, sale_price, category_id, stock_quantity, status, created_at) 
SELECT gen_random_uuid(), 'Thẻ Steam Wallet 50$', 'Nạp tiền vào tài khoản Steam nhanh chóng.', 1250000, 1200000, id, 500, 'ACTIVE', NOW() 
FROM categories WHERE slug = 'gaming-steam' AND NOT EXISTS (SELECT 1 FROM products WHERE title = 'Thẻ Steam Wallet 50$');

INSERT INTO products (id, title, description, price, sale_price, category_id, stock_quantity, status, created_at) 
SELECT gen_random_uuid(), 'Windows 11 Pro Key Retail', 'Bản quyền Windows 11 trọn đời cho 1 PC.', 450000, 399000, id, 2000, 'ACTIVE', NOW() 
FROM categories WHERE slug = 'software-license' AND NOT EXISTS (SELECT 1 FROM products WHERE title = 'Windows 11 Pro Key Retail');

-- =========================================================================
-- 4. BULK DATA GENERATION (100,000 Rows per Table)
-- =========================================================================
DO $$
DECLARE
    u_target INTEGER := 10000;
    p_target INTEGER := 10000;
    o_target INTEGER := 10000;
    
    first_names TEXT[] := ARRAY['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
    last_names TEXT[] := ARRAY['An', 'Bình', 'Chi', 'Dũng', 'Em', 'Giang', 'Hoa', 'Hùng', 'Khánh', 'Lan', 'Minh', 'Nam', 'Oanh', 'Phúc', 'Quý', 'Sơn', 'Thảo', 'Tú', 'Việt', 'Xuân'];
    domains TEXT[] := ARRAY['gmail.com', 'yahoo.com', 'outlook.com', 'fpt.edu.vn', 'viettel.com.vn'];
    
    prod_titles TEXT[] := ARRAY['Thẻ quà tặng', 'Key kích hoạt', 'Tài khoản Premium', 'Gói nạp', 'Bản quyền', 'Subscription'];
    prod_brands TEXT[] := ARRAY['Master', 'Ultra', 'Global', 'Neo', 'Pro', 'X-Speed'];
BEGIN
    RAISE NOTICE 'Bắt đầu khởi tạo 100,000 dòng dữ liệu thực tế...';

    -- [USERS]
    FOR i IN (SELECT count(*) + 1 FROM users)..u_target LOOP
        INSERT INTO users (id, username, email, password_hash, full_name, role, created_at)
        VALUES (
            gen_random_uuid(),
            'customer_' || i,
            'customer' || i || '_' || (floor(random()*999999)) || '@' || domains[(floor(random()*5)+1)],
            '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7u41FS6', -- 'password'
            first_names[(floor(random()*14)+1)] || ' ' || last_names[(floor(random()*20)+1)],
            'USER',
            NOW() - (random() * interval '360 days')
        );
    END LOOP;

    -- [PRODUCTS]
    FOR i IN (SELECT count(*) + 1 FROM products)..p_target LOOP
        INSERT INTO products (id, title, description, price, sale_price, category_id, stock_quantity, status, created_at)
        VALUES (
            gen_random_uuid(),
            prod_titles[(floor(random()*6)+1)] || ' ' || prod_brands[(floor(random()*6)+1)] || ' #' || i,
            'Mô tả chi tiết cho sản phẩm kỹ thuật số số hiệu ' || i || '. Đảm bảo chất lượng và uy tín.',
            (floor(random() * 50 + 1) * 10000)::DECIMAL,
            (floor(random() * 40 + 1) * 10000)::DECIMAL,
            (SELECT id FROM categories ORDER BY random() LIMIT 1),
            (random() * 500 + 10)::INTEGER,
            'ACTIVE',
            NOW() - (random() * interval '200 days')
        );
    END LOOP;

    -- [ORDERS] 100,000 Orders
    FOR i IN 1..o_target LOOP
        DECLARE
            v_order_id UUID := gen_random_uuid();
            v_user_id UUID := (SELECT id FROM users WHERE role = 'USER' ORDER BY random() LIMIT 1);
        BEGIN
            INSERT INTO orders (id, user_id, total_amount, status, payment_method, shipping_address, order_date)
            VALUES (
                v_order_id,
                v_user_id,
                0,
                CASE (floor(random()*4))::INT WHEN 0 THEN 'COMPLETED' WHEN 1 THEN 'PAID' WHEN 2 THEN 'SHIPPED' ELSE 'PENDING' END,
                CASE (floor(random()*3))::INT WHEN 0 THEN 'COD' WHEN 1 THEN 'BANK_TRANSFER' ELSE 'MOMO' END,
                'Số ' || (floor(random()*500)) || ' Đường ' || last_names[(floor(random()*20)+1)] || ', Quận ' || (floor(random()*12)+1) || ', TP. HCM',
                NOW() - (random() * interval '90 days')
            );

            INSERT INTO order_items (id, order_id, product_id, quantity, unit_price)
            SELECT gen_random_uuid(), v_order_id, id, 1, price 
            FROM products ORDER BY random() LIMIT 1;

            UPDATE orders SET total_amount = (SELECT SUM(quantity * unit_price) FROM order_items WHERE order_id = v_order_id) WHERE id = v_order_id;
        END;
    END LOOP;

    RAISE NOTICE 'Hoàn tất mô phỏng dữ liệu 100,000 dòng!';
END $$;
