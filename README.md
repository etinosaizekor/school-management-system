# Project Setup

## Getting Started

### 1. Environment Setup

- **Create `.env` files:**
  - Create .env file with variable similar to the .env.sample file in frontend and backend folders`.

### 2. Build the Project

- **Build the project:**
  - Due to compatibility challenges between Sequelize and TypeScript, migrations will be executed using the compiled JavaScript files.
  - To generate these files, first build the project by running:
    ```bash
    npm run build
    ```

### 3. Database Setup

- **Create the database:**
  - To create the database, use the following command:
    ```bash
    npm run db::create
    ```

### 4. Run Migrations

- **Migrate the database with Sequelize:**
  - Apply the migrations by running:
    ```bash
    npm run db::migrate
    ```

---
