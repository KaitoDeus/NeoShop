# NeoShop - Modern E-Commerce Platform

NeoShop is a modern, full-stack e-commerce application built with a high-performance Monolith architecture using Spring Boot and React.

## 🚀 Key Features

- **Modern Monolith Architecture**: 5-layer clean architecture for maintainability and scalability.
- **Micro-Infrastructure Ready**: Integrated with Redis (Cache), Kafka (Messaging), and PostgreSQL.
- **Real-world Simulation**: Pre-loaded with 10,000+ realistic product and user records.
- **Monitoring & Observability**: Full stack monitoring with Prometheus and Grafana.
- **Containerized Implementation**: Entire system runs seamlessly via Docker Compose.

## 🛠 Technology Stack

### Backend

- **Java 21** & **Spring Boot 3.2**
- **Spring Data JPA** (PostgreSQL)
- **Spring Security** (JWT Authentication)
- **Spring Kafka** & **Redis**

### Frontend

- **React 19** & **Vite**
- **Nginx** (Production serving)
- **Responsive UI** with modern aesthetics.

### Infrastructure

- **Docker & Docker Compose**
- **Prometheus** (Metrics collection)
- **Grafana** (Visualization dashboards)

## 📦 Project Structure

```text
NeoShop/
├── backend/            # Spring Boot application
├── frontend/           # React frontend application
├── infrastructure/     # SQL scripts, Monitoring configs
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
- **Prometheus**: [http://localhost:9090](http://localhost:9090)
- **Grafana**: [http://localhost:3001](http://localhost:3001)

## 🛡 Security

Default Admin credentials for testing:

- **Username**: `admin@neoshop.com`
- **Password**: `admin123`

## 📄 License

This project is licensed under the MIT License.
