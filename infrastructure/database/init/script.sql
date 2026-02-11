CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. SCHEMA (Structure)
-- =========================================================================
DROP TABLE IF EXISTS product_keys CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Roles & Users
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Catalog
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id),
    icon_url VARCHAR(255)
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(19, 2) NOT NULL,
    sale_price DECIMAL(19, 2),
    category_id UUID REFERENCES categories(id),
    stock_quantity INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    total_amount DECIMAL(19, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    shipping_address TEXT,
    order_date TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(19, 2) NOT NULL
);

-- Digital Products (Keys)
CREATE TABLE product_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    key_code VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'AVAILABLE', -- AVAILABLE, SOLD, USED
    order_id UUID REFERENCES orders(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================================================
-- 2. DATA SEEDING (Real World Data)
-- =========================================================================

-- 2.1. Roles
INSERT INTO roles (name) VALUES ('ADMIN'), ('USER');

-- 2.2. Users (Strictly 30 Users)
DO $$
DECLARE
    r_admin UUID;
    r_user UUID;
    v_uid UUID;
BEGIN
    SELECT id INTO r_admin FROM roles WHERE name = 'ADMIN';
    SELECT id INTO r_user FROM roles WHERE name = 'USER';

    -- #1 Admin
    INSERT INTO users (username, email, password_hash, full_name) 
    VALUES ('admin', 'admin@neoshop.com', '$2a$10$o45813dwtUHBrZpsfDyH9eYTc89tZaf4uOeIDy.a4rRnqVjVYL0rK', 'System Administrator')
    RETURNING id INTO v_uid;
    INSERT INTO user_roles (user_id, role_id) VALUES (v_uid, r_admin), (v_uid, r_user);

    -- #2-30 Customers (Real Names & Emails)
    INSERT INTO users (username, email, password_hash, full_name, created_at) VALUES 
    ('hieunguyen', 'hieu.nguyen@gmail.com', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Nguyen Trung Hieu', NOW() - interval '2 days'),
    ('thanhpham', 'thanh.pham@outlook.com', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Pham Tien Thanh', NOW() - interval '5 days'),
    ('lanvo', 'lan.vo@yahoo.com', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Vo Thi Ngoc Lan', NOW() - interval '10 days'),
    ('ducnguyen', 'duc.nguyen@fpt.edu.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Nguyen Minh Duc', NOW() - interval '100 days'),
    ('huongtran', 'huong.tran@viettel.com.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Tran Thu Huong', NOW() - interval '30 days'),
    ('tuanle', 'tuan.le@techcombank.com.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Le Anh Tuan', NOW() - interval '20 days'),
    ('minhhoang', 'minh.hoang@vng.com.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Hoang Nhat Minh', NOW() - interval '15 days'),
    ('linhpham', 'linh.pham@shopee.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Pham Thuy Linh', NOW() - interval '300 days'),
    ('quangvu', 'quang.vu@momo.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Vu Dang Quang', NOW() - interval '120 days'),
    ('trangnguyen', 'trang.nguyen@grab.com', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Nguyen Huyen Trang', NOW() - interval '50 days'),
    ('namdo', 'nam.do@tiktok.com', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Do Hoang Nam', NOW() - interval '60 days'),
    ('hoangmai', 'hoang.mai@zalopay.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Mai Thi Hoang', NOW() - interval '2 days'),
    ('kienvu', 'kien.vu@vcestates.com', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Vu Trung Kien', NOW() - interval '8 days'),
    ('chile', 'chi.le@vinamilk.com.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Le Kim Chi', NOW() - interval '45 days'),
    ('dungbui', 'dung.bui@viettinbank.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Bui Tien Dung', NOW() - interval '22 days'),
    ('annguyen', 'an.nguyen@ree.corp.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Nguyen Binh An', NOW() - interval '19 days'),
    ('binhtran', 'binh.tran@masan.com', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Tran Thai Binh', NOW() - interval '76 days'),
    ('cuongdo', 'cuong.do@novaland.com.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Do Manh Cuong', NOW() - interval '11 days'),
    ('duongle', 'duong.le@sun.com', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Le Thuy Duong', NOW() - interval '99 days'),
    ('emhoang', 'em.hoang@vingroup.net', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Hoang Thi Em', NOW() - interval '200 days'),
    ('giangvu', 'giang.vu@flc.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Vu Truong Giang', NOW() - interval '5 days'),
    ('haipham', 'hai.pham@vietjetair.com', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Pham Thanh Hai', NOW() - interval '3 days'),
    ('iennguyen', 'ien.nguyen@bamboonways.com', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Nguyen Hai Yen', NOW() - interval '1 day'),
    ('khangtran', 'khang.tran@thaico.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Tran Minh Khang', NOW() - interval '88 days'),
    ('lamvu', 'lam.vu@tgdd.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Vu Tung Lam', NOW() - interval '66 days'),
    ('mynnguyen', 'my.nguyen@pnj.com.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Nguyen Tra My', NOW() - interval '44 days'),
    ('ngocle', 'ngoc.le@doji.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Le Bao Ngoc', NOW() - interval '33 days'),
    ('phuongtran', 'phuong.tran@sjc.com.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Tran Lan Phuong', NOW() - interval '22 days'),
    ('quynhbui', 'quynh.bui@hpg.com.vn', '$2a$12$K6nf.Am.uQEWI4mHEi3/YuM8lUQYyE9UTVB.FbeY3ESg/bURVHFWq', 'Bui Nhu Quynh', NOW() - interval '11 days')
    ;

    -- Assign USER role to all non-admin
    INSERT INTO user_roles (user_id, role_id)
    SELECT id, r_user FROM users WHERE username != 'admin';
END $$;

-- 2.3. Categories (12 Main Categories)
INSERT INTO categories (name, slug, icon_url) VALUES 
('Thẻ Game (Game Cards)', 'game-cards', 'https://cdn-icons-png.flaticon.com/512/3408/3408506.png'),
('Phần mềm (Software License)', 'software', 'https://cdn-icons-png.flaticon.com/512/2643/2643509.png'),
('Giải trí (Streaming & Media)', 'entertainment', 'https://cdn-icons-png.flaticon.com/512/3163/3163478.png'),
('VPN & Tin học', 'vpn-services', 'https://cdn-icons-png.flaticon.com/512/2092/2092663.png'),
('Học tập (Education)', 'education', 'https://cdn-icons-png.flaticon.com/512/2436/2436874.png'),
('Ví điện tử & Nạp tiền', 'wallet-topup', 'https://cdn-icons-png.flaticon.com/512/893/893097.png'),
('Tài khoản Premium (Account)', 'premium-account', 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png'),
('Dịch vụ AI (ChatGPT, Midjourney)', 'ai-services', 'https://cdn-icons-png.flaticon.com/512/1693/1693746.png'),
('Lưu trữ Đám mây (Cloud Storage)', 'cloud-storage', 'https://cdn-icons-png.flaticon.com/512/3305/3305498.png'),
('Marketing & SEO Tools', 'marketing-seo', 'https://cdn-icons-png.flaticon.com/512/1998/1998087.png'),
('Code & Script', 'code-script', 'https://cdn-icons-png.flaticon.com/512/1005/1005141.png'),
('Other Services', 'others', 'https://cdn-icons-png.flaticon.com/512/2312/2312488.png');

-- 2.4. Products (Generation Loop for ~300 Products)
DO $$ 
DECLARE
    cat_game UUID;
    cat_soft UUID;
    cat_ent UUID;
    cat_ai UUID;
    cat_vpn UUID;
    p_id UUID;
    product_counter INTEGER := 0;
BEGIN
    SELECT id INTO cat_game FROM categories WHERE slug = 'game-cards';
    SELECT id INTO cat_soft FROM categories WHERE slug = 'software';
    SELECT id INTO cat_ent FROM categories WHERE slug = 'entertainment';
    SELECT id INTO cat_ai FROM categories WHERE slug = 'ai-services';
    SELECT id INTO cat_vpn FROM categories WHERE slug = 'vpn-services';

    -- [Sample 1] Steam Wallet (Multiple denominations)
    FOR i IN 1..10 LOOP
        INSERT INTO products (title, description, price, sale_price, category_id, stock_quantity, status)
        VALUES (
            'Steam Wallet Code ' || (i * 10) || ' USD (Global)', 
            'Mã nạp tiền Steam Wallet mệnh giá ' || (i * 10) || '$ sử dụng cho tài khoản Steam toàn cầu. Region Free.', 
            (i * 10 * 25000), 
            (i * 10 * 24500), 
            cat_game, 
            100 + (random() * 500)::int,
            'ACTIVE'
        );
        product_counter := product_counter + 1;
    END LOOP;

    -- [Sample 2] Windows & Office
    INSERT INTO products (title, description, price, sale_price, category_id, stock_quantity, status) VALUES 
    ('Windows 11 Pro Retail Key', 'Key kích hoạt Windows 11 Pro bản quyền vĩnh viễn, update thoải mái.', 500000, 350000, cat_soft, 200, 'ACTIVE'),
    ('Windows 10 Pro OEM Key', 'Key Windows 10 Pro giá rẻ cho máy tính cá nhân.', 300000, 150000, cat_soft, 500, 'ACTIVE'),
    ('Microsoft Office 2021 Pro Plus', 'Bộ Office 2021 bản quyền trọn đời, bind vào tài khoản Microsoft.', 1200000, 890000, cat_soft, 100, 'ACTIVE'),
    ('Microsoft 365 Personal (1 Year)', 'Gói Microsoft 365 cá nhân 1 năm, 1TB OneDrive.', 1400000, 1100000, cat_soft, 150, 'ACTIVE');
    product_counter := product_counter + 4;

    -- [Sample 3] Entertainment (Netflix, Spotify, Youtube)
    INSERT INTO products (title, description, price, sale_price, category_id, stock_quantity, status) VALUES 
    ('Netflix Premium 1 Tháng (4K HDR)', 'Tài khoản Netflix Premium xem phim 4K HDR, profile riêng.', 260000, 65000, cat_ent, 1000, 'ACTIVE'),
    ('Netflix Premium 1 Năm (4K HDR)', 'Gói gia hạn Netflix 1 năm siêu tiết kiệm.', 2000000, 600000, cat_ent, 50, 'ACTIVE'),
    ('Spotify Premium 1 Năm (Nâng cấp chính chủ)', 'Nâng cấp tài khoản Spotify của bạn lên Premium 1 năm.', 590000, 250000, cat_ent, 300, 'ACTIVE'),
    ('Youtube Premium 6 Tháng (Upgrade)', 'Nâng cấp Youtube Premium xem không quảng cáo, Youtube Music.', 300000, 180000, cat_ent, 200, 'ACTIVE');
    product_counter := product_counter + 4;

    -- [Sample 4] AI Services
    INSERT INTO products (title, description, price, sale_price, category_id, stock_quantity, status) VALUES 
    ('ChatGPT Plus (1 Tháng)', 'Tài khoản ChatGPT Plus sử dụng model GPT-4o mới nhất.', 20000, 450000, cat_ai, 20, 'ACTIVE'),
    ('Midjourney Standard Plan (1 Tháng)', 'Tài khoản Midjourney tạo ảnh AI nghệ thuật.', 800000, 750000, cat_ai, 10, 'ACTIVE'),
    ('Canva Pro (Vĩnh viễn/Edu)', 'Nâng cấp Canva Pro vào Class Edu, bảo hành trọn đời.', 100000, 49000, cat_ai, 5000, 'ACTIVE');
    product_counter := product_counter + 3;

    -- [Sample 5] VPN
    INSERT INTO products (title, description, price, sale_price, category_id, stock_quantity, status) VALUES 
    ('NordVPN 1 Năm (Account)', 'Tài khoản NordVPN Premium hạn dùng 1 năm.', 1500000, 300000, cat_vpn, 50, 'ACTIVE'),
    ('ExpressVPN 1 Tháng Key', 'Code kích hoạt ExpressVPN 1 tháng chính chủ.', 300000, 280000, cat_vpn, 100, 'ACTIVE');
    product_counter := product_counter + 2;

    -- Fill generic products to reach ~200
    FOR i IN product_counter..200 LOOP
        INSERT INTO products (title, description, price, sale_price, category_id, stock_quantity, status)
        VALUES (
            'Random Product Package #' || i,
            'Gói sản phẩm ngẫu nhiên dành cho testing hệ thống. Đây là mô tả dài để test layout.',
            (floor(random() * 100 + 1) * 10000),
            (floor(random() * 80 + 1) * 10000),
            (SELECT id FROM categories ORDER BY random() LIMIT 1),
            (random() * 100)::int,
            'ACTIVE'
        );
    END LOOP;
END $$;

-- 2.5. Product Keys (Bulk Generation: ~10,000 Keys)
DO $$
DECLARE
    prod RECORD;
    i INT;
    key_count INT := 0;
BEGIN
    -- For each product, generate 50-100 keys
    FOR prod IN SELECT id, title FROM products LOOP
        FOR i IN 1..(floor(random() * 50 + 20)) LOOP -- 20 to 70 keys per product
            INSERT INTO product_keys (product_id, key_code, status)
            VALUES (
                prod.id,
                UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5)) || '-' || 
                UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5)) || '-' || 
                UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5)) || '-' || 
                UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5)),
                'AVAILABLE'
            );
            key_count := key_count + 1;
        END LOOP;
    END LOOP;
END $$;

-- 2.6. Historical Orders (> 5,000 Orders from 30 Users)
DO $$
DECLARE
    u_id UUID;
    p_id UUID;
    o_id UUID;
    p_price DECIMAL;
    v_key_id UUID;
    order_status VARCHAR(50);
BEGIN
    FOR i IN 1..5000 LOOP
        -- Pick random user
        SELECT id INTO u_id FROM users WHERE username != 'admin' ORDER BY random() LIMIT 1;
        
        -- Pick random product
        SELECT id, sale_price INTO p_id, p_price FROM products ORDER BY random() LIMIT 1;
        
        -- Determine Status (80% PAID/COMPLETED, 20% PENDING/CANCELLED)
        IF random() < 0.8 THEN
            order_status := CASE WHEN random() < 0.5 THEN 'PAID' ELSE 'COMPLETED' END;
        ELSE
            order_status := CASE WHEN random() < 0.5 THEN 'PENDING' ELSE 'CANCELLED' END;
        END IF;

        -- Create Order
        INSERT INTO orders (user_id, total_amount, status, payment_method, shipping_address, order_date)
        VALUES (
            u_id, 
            p_price, 
            order_status, 
            CASE (floor(random()*3))::int WHEN 0 THEN 'MOMO' WHEN 1 THEN 'BANK_TRANSFER' ELSE 'VISA' END,
            'Digital Delivery (Email)',
            NOW() - (random() * interval '365 days')
        ) RETURNING id INTO o_id;

        -- Create Order Item
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES (o_id, p_id, 1, p_price);

        -- If PAID/COMPLETED, assign a key
        IF order_status IN ('PAID', 'COMPLETED') THEN
            -- Find available key for this product
            SELECT id INTO v_key_id FROM product_keys WHERE product_id = p_id AND status = 'AVAILABLE' LIMIT 1;
            
            IF v_key_id IS NOT NULL THEN
                UPDATE product_keys SET status = 'SOLD', order_id = o_id WHERE id = v_key_id;
            ELSE
                -- If no key available, generate one on the fly (to keep data consistent)
                INSERT INTO product_keys (product_id, key_code, status, order_id)
                VALUES (
                    p_id, 
                    'AUTO-GEN-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 10)), 
                    'SOLD', 
                    o_id
                );
            END IF;
        END IF;
    END LOOP;
END $$;
