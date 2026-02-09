-- Seed Auth Database (1 Million Users)
\c neoshop_auth;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed 1M Users (Distinct)
INSERT INTO users (username, email, password_hash, full_name, role)
SELECT 
    'user_' || i || '_' || substr(md5(random()::text), 1, 6),
    'user_' || i || '@neoshop.vn',
    md5(random()::text),
    'Khách Hàng Thứ ' || i,
    CASE WHEN i % 100 = 0 THEN 'ADMIN' ELSE 'USER' END
FROM generate_series(1, 1000000) AS i;
