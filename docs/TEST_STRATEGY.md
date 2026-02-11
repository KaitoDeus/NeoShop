# Test Strategy - NeoShop Advanced Features

## 1. Overview

This document outlines the testing strategy for the NeoShop platform, focusing on the newly implemented modules: Digital Key Management, Order Processing, and Admin Analytics.

## 2. Test Objectives

- Verify core functional flows for Users and Admins.
- Ensure automated logic (Stock reduction, Key assignment) works correctly.
- Validate security (RBAC) across endpoints.
- Check data persistence and integration (Database, Kafka logs).

## 3. Test Scope

- **User Authentication:** JWT Login/Register.
- **Product Catalog:** Fetching categories and paginated products.
- **Order Flow:**
  - Order creation.
  - Status updates (PENDING -> PAID).
- **Product Keys:**
  - Admin bulk addition.
  - Automatic assignment upon payment.
- **Analytics:** Dashboard metrics accuracy.

## 4. Environment

- **URL:** http://localhost:8080/swagger-ui.html
- **Database:** PostgreSQL (seeded with 10k+ records).
- **Messaging:** Apache Kafka (KRaft).

## 5. Test Tools

- **Browser (Swagger UI):** For manual API execution.
- **Terminal:** For checking container logs (Kafka/Backend).

## 6. Pass/Fail Criteria

- HTTP 200/201 for valid requests.
- Correct data returned in JSON bodies.
- Keys correctly mapped to orders in DB.
- Statistics reflect recent transactions.
