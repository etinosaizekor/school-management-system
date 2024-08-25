# Project Setup

## Getting Started

### 1. Environment Setup

- **Create `.env` files:**
  - Copy the `.env.sample` file and rename the copy to `.env`.
  - Update the `.env` file with the appropriate environment variables required by your project.

### 2. Build the Project

- **Build the project:**
  - Due to an issue with Sequelize and TypeScript, migrations need to be executed from the compiled JavaScript files. 
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
  - After building the project, apply the migrations by running:
    ```bash
    npm run db::migrate
    ```

---
