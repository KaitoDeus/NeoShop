# NeoShop - Modern E-Commerce Platform

NeoShop is a modern, full-stack e-commerce application built with a high-performance Monolith architecture using Spring Boot and React.

## 🚀 Key Features

- **Modern Monolith Architecture**: 5-layer clean architecture for maintainability and scalability.
- **Real-world Simulation**: Pre-loaded with 10,000+ realistic product and user records.
- **Containerized Implementation**: Entire system runs seamlessly via Docker Compose.

## 🛠 Technology Stack

### Backend

- **Java 21** & **Spring Boot 3.2**
- **Spring Data JPA** (PostgreSQL)
- **Spring Security** (JWT Authentication)

### Frontend

- **React 19** & **Vite**
- **Nginx** (Production serving)
- **Responsive UI** with modern aesthetics.

## 📦 Project Structure

```text
NeoShop/
├── backend/            # Spring Boot application
├── frontend/           # React frontend application
├── database/           # SQL seed scripts
├── docs/               # System documentation (SRS, API, Architecture)
└── docker-compose.yml  # System orchestration
```

## 🚦 Getting Started

### Prerequisites

- Docker & Docker Compose installed.

### Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/KaitoDeus/NeoShop.git
   cd NeoShop
   ```
2. Start the entire system:
   ```bash
   docker-compose up -d --build
   ```

### Access Ports

- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## 🛡 Security

Default Admin credentials for testing:

- **Username**: `admin@neoshop.com`
- **Password**: `admin123`

## 📄 License

This project is licensed under the MIT License.
