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
```

Make sure to replace `your_password_here` with your actual PostgreSQL password if you set one.
