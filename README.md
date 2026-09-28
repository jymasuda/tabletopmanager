# TabletopManager

A web application to create, view, and edit tabletop RPG character sheets. It supports two systems, **D&D** and **The Fifth Trumpet**.

## Features

- Character sheets for D&D and The Fifth Trumpet
- Edit mode toggle: sheet sections become editable when edit mode is turned on
- Dirty tracking: each section that is changed is marked as "dirty", and only those sections are saved to the database, avoiding unnecessary writes

## Tech Stack

- Java 21
- Spring Boot
- Thymeleaf
- PostgreSQL

## Getting Started

### Prerequisites
- JDK 21
- PostgreSQL
- Maven

### Running locally
```bash
git clone https://github.com/jymasuda/tabletopmanager.git
cd tabletopmanager
# Create a PostgreSQL database and configure the connection in application.properties
[./mvnw spring-boot:run]
```
The app will be available at `http://localhost:8080`.

## Screenshots
Coming soon.
