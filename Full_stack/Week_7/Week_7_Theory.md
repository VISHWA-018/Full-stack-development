# Week 7 - Theoretical Tasks

## Task 7.1: Single Responsibility & High Cohesion
**Design Microservices for a Library Management System based on the Single Responsibility Principle.**

1. **User Management Service**: Responsible for handling user registrations, authentication, profile management, and roles (e.g., Member, Librarian).
2. **Catalog Service**: Responsible for maintaining the library's inventory, searching for books, adding new books, and updating book metadata (title, author, genre).
3. **Borrowing Service**: Responsible for managing the lending process, tracking issued books, due dates, returns, and enforcing borrowing rules.
4. **Notification Service**: Responsible for sending emails, SMS, or push notifications to users regarding due date reminders, overdue fines, and reservation availability.

---

## Task 7.2: Loose Coupling & API Communication
**Design a simple interaction between Order Service and Payment Service using API communication.**

**Interaction Steps:**
1. A user places an order on the application frontend, which hits the **Order Service**.
2. The **Order Service** persists the order details in its local database with a status of `PENDING` and calculates the total order amount.
3. The **Order Service** makes a synchronous HTTP POST request (e.g., via REST API over HTTPS) to the **Payment Service** endpoint `/api/payments/process`, passing the `orderId`, `userId`, and `amount` as the JSON payload.
4. The **Payment Service** processes the payment utilizing an external payment gateway.
5. The **Payment Service** responds back to the **Order Service** with the transaction outcome (e.g., `SUCCESS` or `FAILED`).
6. Based on the response, the **Order Service** updates the order status to either `CONFIRMED` or `CANCELLED`.

*(Note: In a more advanced microservice architecture, this synchronous API call could be replaced by asynchronous event-driven communication using message brokers like Apache Kafka or RabbitMQ to improve loose coupling further.)*

---

## Task 7.3: Independent Deployment & Decentralized Data
**Design microservices for a Hospital Management System by following decentralized data management.**

By following decentralized data management (Database-per-Service pattern), each microservice persists its own domain data exclusively.

1. **Patient Service**:
   - **Responsibility**: Manages patient records, medical history, allergies, and contact details.
   - **Database**: `patients_db` (Could be a NoSQL document database like MongoDB to store variable medical documents or a relational DB like PostgreSQL).
2. **Doctor / Staff Service**:
   - **Responsibility**: Manages hospital staff, doctor schedules, specializations, and availability.
   - **Database**: `staff_db` (A relational database like MySQL mapping doctors and schedules).
3. **Appointment Service**:
   - **Responsibility**: Handles the booking of appointments, matching available doctors with patients.
   - **Database**: `appointments_db` (A relational database strictly tracking appointment time slots and statuses).
