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
    phone_number VARCHAR(20),
    address TEXT,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    active BOOLEAN DEFAULT TRUE
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
    VALUES ('admin', 'admin@neoshop.com', '$2a$10$nHbV5RKLZVkH.K5ovkUqS.HGNsHo853Zle5eDHeHjvrSA5MZ7hqZy', 'System Administrator')
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

-- 2.3. Categories (11 Main Categories)
INSERT INTO categories (name, slug, icon_url) VALUES 
('Giải trí', 'giai-tri', 'https://cdn-icons-png.flaticon.com/512/3163/3163478.png'),
('Làm việc', 'lam-viec', 'https://cdn-icons-png.flaticon.com/512/2643/2643509.png'),
('Học tập', 'hoc-tap', 'https://cdn-icons-png.flaticon.com/512/2436/2436874.png'),
('eSIM du lịch', 'esim-du-lich', 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png'),
('Edit Ảnh - Video', 'edit-anh-video', 'https://cdn-icons-png.flaticon.com/512/893/893097.png'),
('Windows, Office', 'windows-office', 'https://cdn-icons-png.flaticon.com/512/3305/3305498.png'),
('Google Drive', 'google-drive', 'https://cdn-icons-png.flaticon.com/512/1005/1005141.png'),
('Thế giới AI', 'the-gioi-ai', 'https://cdn-icons-png.flaticon.com/512/1693/1693746.png'),
('VPN, bảo mật', 'vpn-bao-mat', 'https://cdn-icons-png.flaticon.com/512/2092/2092663.png'),
('Gift Card', 'gift-card', 'https://cdn-icons-png.flaticon.com/512/3408/3408506.png'),
('Game trên Steam', 'game-tren-steam', 'https://cdn-icons-png.flaticon.com/512/3408/3408507.png');

-- 2.4. Products (Generation Loop for ~200 Products)
DO $$ 
DECLARE
    cat_giai_tri UUID;
    cat_lam_viec UUID;
    cat_hoc_tap UUID;
    cat_ai UUID;
    cat_game UUID;
    cat_edit UUID;
    cat_windows UUID;
    p_id UUID;
    product_counter INTEGER := 0;
BEGIN
    SELECT id INTO cat_giai_tri FROM categories WHERE slug = 'giai-tri';
    SELECT id INTO cat_lam_viec FROM categories WHERE slug = 'lam-viec';
    SELECT id INTO cat_hoc_tap FROM categories WHERE slug = 'hoc-tap';
    SELECT id INTO cat_ai FROM categories WHERE slug = 'the-gioi-ai';
    SELECT id INTO cat_game FROM categories WHERE slug = 'game-tren-steam';
    SELECT id INTO cat_edit FROM categories WHERE slug = 'edit-anh-video';
    SELECT id INTO cat_windows FROM categories WHERE slug = 'windows-office';

    -- Game trên Steam
    INSERT INTO products (title, description, price, sale_price, category_id, stock_quantity, status) VALUES 
    ('Cyberpunk 2077: Phantom Liberty', 'Cyberpunk 2077: Phantom Liberty expansion.', 749750, 374750, cat_game, 200, 'ACTIVE'),
    ('Elden Ring: Shadow of the Erdtree', 'Elden Ring DLC.', 1499750, 1124750, cat_game, 500, 'ACTIVE'),
    ('Baldur''s Gate 3: Deluxe Edition', 'Baldur''s Gate 3 Deluxe Edition.', 1499750, 1499750, cat_game, 100, 'ACTIVE'),
    ('God of War Ragnarök', 'God of War Ragnarok for PC.', 1749750, 1249750, cat_game, 150, 'ACTIVE');
    product_counter := product_counter + 4;

    -- AI & Làm việc -> AI / Làm việc
    INSERT INTO products (title, description, price, sale_price, category_id, stock_quantity, status) VALUES 
    ('Midjourney Standard 1 Tháng', 'Midjourney Standard', 750000, 750000, cat_ai, 1000, 'ACTIVE'),
    ('GitHub Copilot 1 Năm', 'GitHub Copilot', 2999750, 2500000, cat_lam_viec, 50, 'ACTIVE'),
    ('Adobe Creative Cloud 1 Năm', 'Adobe CC', 14999750, 8725000, cat_edit, 300, 'ACTIVE'),
    ('Canva Pro 1 Năm', 'Canva Pro', 2999750, 1375000, cat_lam_viec, 200, 'ACTIVE');
    product_counter := product_counter + 4;

    -- Giải trí & Học tập
    INSERT INTO products (title, description, price, sale_price, category_id, stock_quantity, status) VALUES 
    ('Netflix Premium 6 Tháng', 'Netflix', 2249750, 1125000, cat_giai_tri, 20, 'ACTIVE'),
    ('Spotify Premium 1 Năm', 'Spotify', 1499750, 875000, cat_giai_tri, 10, 'ACTIVE'),
    ('Coursera Plus 1 Năm', 'Coursera', 9999750, 4975000, cat_hoc_tap, 5000, 'ACTIVE'),
    ('Duolingo Plus 1 Năm', 'Duolingo', 2099750, 1125000, cat_hoc_tap, 50, 'ACTIVE');
    product_counter := product_counter + 4;

    -- Sản phẩm mới
    INSERT INTO products (title, description, price, sale_price, category_id, stock_quantity, status) VALUES 
    ('PlayStation Plus 12 Tháng', 'PS Plus', 1499750, 1499750, cat_giai_tri, 100, 'ACTIVE');
    product_counter := product_counter + 1;

    -- Fill generic products to reach ~200
    FOR i IN product_counter..200 LOOP
        INSERT INTO products (title, description, price, sale_price, category_id, stock_quantity, status)
        VALUES (
            'Random Product Package #' || i,
            'Gói sản phẩm ngẫu nhiên dành cho testing hệ thống.',
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

-- 2.7. Reset Stock Quantity based on ACTUAL Available Keys
UPDATE products p
SET stock_quantity = (
    SELECT COUNT(*) 
    FROM product_keys pk 
    WHERE pk.product_id = p.id 
    AND pk.status = 'AVAILABLE'
);
