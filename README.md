# PDF Manager

PDF Manager is a web application that allows you to easily **manage your PDF documents.** You can **upload, view, and delete** your PDF files from a secure dashboard. The application uses **React** for the frontend, **Node.js/Express** for the backend, and **PostgreSQL** as the database.

---

## Prerequisites

Before launching the application, make sure you have installed the following tools:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

---

## Installation and launch

### 1. Create the database

```bash
# Start PostgreSQL if it is not already running
sudo systemctl start postgresql

# Create the database named pdfDb as the postgres user
sudo -u postgres createdb pdfDb

# Initialize the database schema
cd backend
sudo -u postgres psql -d pdfDb -f database.sql
cd ..
```
```bash
# If you don't have a PostgreSQL password yet, do this:
sudo -u postgres psql
```
```sql
-- Then copy and paste this line (replace with your own password)
ALTER USER postgres WITH PASSWORD 'your_password_here';
```

### 2. Create the `.env` file
```bash
# Create the .env file
touch backend/.env
```

Put in you .env :
```txt
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=pdfDb
PORT=3000
JWT_SECRET=your_jwt_secret
```

Make sure to replace `your_password_here` with your actual PostgreSQL password if you set one and `your_jwt_secret` with your secret key used to sign and verify JWT tokens for authentication.


### 3. Start the webapp
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Start backend
cd ../backend && node server.js

# In another terminal, start frontend
cd frontend && npm start
```
