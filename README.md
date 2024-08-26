# Project Setup

## Getting Started

### 1. Install Dependencies

- **Install required packages:**
  - Navigate to both the `frontend` and `backend` directories and install the necessary dependencies by running:
    ```bash
    npm install
    ```

### 2. Environment Setup

- **Create `.env` files:**
  - For both the `frontend` and `backend` folders, create a `.env` file by duplicating the `.env.sample` file.
  - Ensure that the newly created `.env` files contain the same variables as in their corresponding `.env.sample` files, and update the values as necessary.

### 3. Build the Project

- **Build the project:**
  - Due to compatibility challenges between Sequelize and TypeScript, migrations will be executed using the compiled JavaScript files.
  - To generate these files, first build the project by running:
    ```bash
    npm run build
    ```

### 4. Database Setup

- **Create the database:**
  - To create the database, use the following command:
    ```bash
    npm run db:create
    ```

### 5. Run Migrations

- **Migrate the database with Sequelize:**
  - Apply the migrations by running:
    ```bash
    npm run db:migrate
    ```

### 6. Start the Application

- **Start the backend:**

  - Run the following command to start the backend server:
    ```bash
    npm start
    ```

- **Start the frontend:**
  - Run the following command to start the frontend development server:
    ```bash
    npm run dev
    ```

---

This ensures that users install the necessary packages before proceeding with the rest of the setup.
