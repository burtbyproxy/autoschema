# autoschema

A REST API service built with Express and Sequelize, with a utility to automatically generate database models, controllers, migrations, routers and import data from CSV files.

## Getting Started

### Prerequisites

-   Node.js 20+
-   PostgreSQL 16+
-   yarn (although npm will work also, these docs use yarn as the example)

### Key Dependencies (in the package.json file)

-   express.js - Web framework
-   sequelize - ORM for database operations
-   csv-parse - CSV file parsing library

### Installation

1. Clone the repository

```
git clone https://github.com/burtbyproxy/autoschema.git
cd autoschema
```

2. Configure .env variables

```
cp .env.example .env
# edit .env with your database credentials
```

3. Install dependendices

```
cd backend
yarn
```

4. Start the development server

```
yarn dev
```

## API Documentation

### Authentication

1. Add API Keys to the `API_KEYS` variable inside your `.env` file (separated by comma)

```
API_KEYS=your-api-key-here,another-api-key-here
```

2. All API requests require an API key to be included in the headers.

```
X-API-Key: your-api-key-here
```

### API Endpoints

This project has the following global API endpoints automatically setup.

-   `GET /heartbeat` status check for the API
-   `GET /api/v1` describes all the collections and their schemas

This project will automatically generate the following API endpoints for each generated model.

-   `GET /api/collection` lists all records
-   `GET /api/collection/describe` describes this record type's schema
-   `GET /api/collection/:id` gets individual record
-   `POST /api/collection` creates a new record
-   `PUT /api/collection/:id` updates an existing record
-   `DELETE /api/collection/:id` deletes a record

## Data Import Module

The showcase feature of this project is its data import module which you can access by running the command `autoschema`.

### "Upload" CSV File

First you should add one or more CSV files to the `/uploads` directory. Ideally their name should reflect their model/table name i.e. `customers.csv` would be perfect for generating a `Customers` model and `customers` database table. The data should be in CSV format and include header names as the first row.

There are example CSV files inside the autoschema module's test directory `/backend/src/core/autoschema/tests/data`

### Analyze CSV File

Analyizing a CSV file will print out to your console a list of fields discovered as well as their presumed data types.

```
yarn autoschema analyze ../uploads/customers.csv
```

### Generating Collections from CSV File

You can automatically generate an API collection (model, migration, controller, router) from the CSV file by running the following command.

```
yarn autoschema generate ../uploads/customers.csv customers
```

### Process Migrations

After you have generated a new collection it is important to run the migration to create or modify your database tables.

```
yarn autoschema migrate
```

### Import Data from CSV File

Once the database has been updated, you can now import all the rows from your CSV directly into the database.

```
yarn autoschema seed ../uploads/customers.csv customers
```

### Cleanup Collection

If at any point along the way you encounter errors or want to just start over, you can clean up everything that was generated and imported from a CSV file by running this command.

```
yarn autoschema cleanup customers
```

### Everything in One Command

For convenience sake, there is also a command that will analyze, generate, migrate, and import the data from a single CSV file in one command. Note: you do not need to include a table name with this command, as it will be implied by the filename.

```
yarn autoschema process ../uploads/customers.csv
```

## Tests

There are several tests written for the autoschema module specifically that will urn through each command using some sample CSV files. If anything goes wrong it will let you know.

```
yarn test
```

## Docker

Optionally, if you don't want the hassle of configuring a database you can just run a simple Docker command and it will create a PostgreSQL server and database configured based on your .env file.

```
docker-compose up db
```
