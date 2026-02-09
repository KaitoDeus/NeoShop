-- Seed Catalog Database (1 Million Products)
\c neoshop_catalog;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    icon_url TEXT
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    sale_price DECIMAL(12,2),
    category_id UUID,
    stock_quantity INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed 1M Categories
INSERT INTO categories (name, slug)
SELECT 
    'Danh Mục ' || i,
    'danh-muc-' || i
FROM generate_series(1, 1000000) AS i;

-- Seed 1M Products (Distinct)
INSERT INTO products (title, description, price, sale_price, stock_quantity)
SELECT 
    'Sản phẩm NeoShop #' || i,
    'Mô tả sản phẩm mã ' || i,
    (random() * 5000000)::decimal(12,2),
    (random() * 4000000)::decimal(12,2),
    (random() * 1000)::int
FROM generate_series(1, 1000000) AS i;
