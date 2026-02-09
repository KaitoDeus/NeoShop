-- Seed Order Database (1 Million Orders)
\c neoshop_order;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Logical reference to Auth Service
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    shipping_address TEXT,
    order_date TIMESTAMP DEFAULT NOW()
);

-- Seed 1M Orders (Distinct)
INSERT INTO orders (user_id, total_amount, status, payment_method, shipping_address)
SELECT 
    uuid_generate_v4(), -- Simulated user reference
    (random() * 10000000)::decimal(12,2),
    (ARRAY['PENDING', 'PAID', 'SHIPPED', 'COMPLETED'])[floor(random() * 4 + 1)],
    (ARRAY['COD', 'BANK_TRANSFER', 'MOMO'])[floor(random() * 3 + 1)],
    'Địa chỉ giao hàng số ' || i
FROM generate_series(1, 1000000) AS i;
