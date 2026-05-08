# CoffeeShop Backend API

A Node.js + TypeScript + Express backend for a coffee shop and bakery ordering system.  
It includes authentication, role-based access control, menu and category management, and customer order placement.

## Features

- JWT authentication with hashed passwords
- Role-based authorization for `customer` and `admin`
- Categories CRUD
- Menu items CRUD
- Order placement with transactional writes
- Order status management
- PostgreSQL integration
- Basic request logging, security headers, and CORS

## Tech Stack

- **Runtime:** Node.js / Bun-compatible scripts
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL
- **Validation:** VineJS
- **Auth:** JWT + bcrypt
- **Security:** helmet, cors

## Project Structure

```txt
server/
├── config/           # database and environment setup
├── database/
│   └── migrations/   # SQL schema files
├── middlewares/      # auth, role, logger, error handling
├── modules/
│   ├── auth/
│   ├── categories/
│   ├── menu/
│   ├── orders/
│   └── users/
└── types/            # Express type augmentation
```

## Requirements

- Node.js 18+ recommended
- PostgreSQL
- Bun is optional, but the project also works with Node.js tooling

## Installation

### 1) Install dependencies

Using Bun:
```bash
bun install
```

Using npm:
```bash
npm install
```

### 2) Create your environment file

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Example:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=coffeeshop_db

JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=7d
```

## Database Setup

Run the SQL migration files in this order:

1. `server/database/migrations/001_create_users.sql`
2. `server/database/migrations/002_create_categories.sql`
3. `server/database/migrations/003_create_menu_items.sql`
4. `server/database/migrations/004_create_orders.sql`

The schema creates:

- `users`
- `categories`
- `menu_items`
- `orders`
- `order_items`

## Running the Project

### Development

```bash
bun run dev
```

or

```bash
npm run dev
```

### Production build

```bash
bun run build
```

Then run the compiled app:

```bash
bun run start
```

or

```bash
node dist/server.js
```

## Base URL

```txt
/api/v1
```

## API Conventions

### Standard success response

```json
{
  "status": "success",
  "data": {}
}
```

### Standard error response

```json
{
  "status": "error",
  "message": "Something went wrong"
}
```

### Authentication

Protected routes require a Bearer token:

```http
Authorization: Bearer <token>
```

### Roles

- `customer`: can place orders and view own orders
- `admin`: can manage categories, menu items, users, and orders

## Authentication Endpoints

### Register

`POST /api/v1/auth/register`

Public.

**Body**
```json
{
  "name": "Mohamed",
  "email": "mohamed@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Mohamed",
      "email": "mohamed@example.com",
      "role": "customer"
    },
    "token": "jwt_token"
  }
}
```

### Login

`POST /api/v1/auth/login`

Public.

**Body**
```json
{
  "email": "mohamed@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Mohamed",
      "email": "mohamed@example.com",
      "role": "customer"
    },
    "token": "jwt_token"
  }
}
```

### Get current user

`GET /api/v1/auth/me`

Protected.

**Response**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "role": "customer"
    }
  }
}
```

> Note: the current implementation reads the user from the JWT payload and returns `req.user`.

## Categories Endpoints

### Get all categories

`GET /api/v1/categories`

Public.

### Create category

`POST /api/v1/categories`

Admin only.

**Body**
```json
{
  "name": "Coffee",
  "description": "Hot and cold coffee drinks"
}
```

### Update category

`PUT /api/v1/categories/:id`

Admin only.

**Body**
```json
{
  "name": "Bakery",
  "description": "Fresh bakery items and pastries"
}
```

### Delete category

`DELETE /api/v1/categories/:id`

Admin only.

## Menu Endpoints

### Get all menu items

`GET /api/v1/menu`

Public.

### Get one menu item

`GET /api/v1/menu/:id`

Public.

### Create menu item

`POST /api/v1/menu`

Admin only.

**Body**
```json
{
  "name": "Cappuccino",
  "description": "Espresso with steamed milk and foam",
  "price": 3.5,
  "type": "coffee",
  "is_available": true,
  "category_id": 1
}
```

### Update menu item

`PUT /api/v1/menu/;id`

Admin only.

> Important: the current route in the code uses `;id` instead of `:id`.  
> That looks like a typo in the source. If you fix it in the code, the intended route becomes:
> `PUT /api/v1/menu/:id`

### Delete menu item

`DELETE /api/v1/menu/;id`

Admin only.

> Same note as above: the current code uses `;id` in the path.

## Orders Endpoints

### Place an order

`POST /api/v1/orders`

Customer only.

**Body**
```json
{
  "items": [
    {
      "menu_item_id": 1,
      "quantity": 2
    },
    {
      "menu_item_id": 4,
      "quantity": 1
    }
  ]
}
```

The server will:

- create the order
- verify each menu item exists
- verify each item is available
- calculate the total
- store order items in a transaction

### Get my orders

`GET /api/v1/orders/my-orders`

Customer only.

### Get all orders

`GET /api/v1/orders`

Admin only.

### Update order status

`PUT /api/v1/orders/:id/status`

Admin only.

**Body**
```json
{
  "status": "preparing"
}
```

Allowed statuses:

- `pending`
- `confirmed`
- `preparing`
- `ready`
- `delivered`
- `cancelled`

## Users Endpoints

### Get all users

`GET /api/v1/users`

Admin only.

### Get user by id

`GET /api/v1/users/:id`

Admin only.

## Validation Rules

### Register / Login
- `name`: 2–100 chars
- `email`: valid email
- `password`: 8–64 chars

### Category
- `name`: 3–20 chars
- `description`: 20–100 chars

### Menu item
- `name`: 3–100 chars
- `description`: 20–100 chars
- `price`: number, minimum 0
- `type`: `coffee`, `bun`, or `other`
- `is_available`: boolean
- `category_id`: integer

### Order
- at least 1 item
- each `quantity` must be at least 1

## Database Notes

### Users
- `id` is a UUID
- default role is `customer`

### Categories
- `id` is a serial integer
- `name` must be unique

### Menu Items
- `id` is a serial integer
- `name` must be unique
- belongs to one category

### Orders
- `status` defaults to `pending`
- `total` is calculated from order items
- `order_items` is deleted automatically when an order is deleted

## Common Response Codes

- `200 OK` — successful read/update/delete
- `201 Created` — successful creation
- `400 Bad Request` — validation or invalid id
- `401 Unauthorized` — missing/invalid token
- `403 Forbidden` — role not allowed
- `404 Not Found` — resource not found
- `409 Conflict` — duplicate email / duplicate category / duplicate menu item

## Example cURL Requests

### Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Mohamed",
    "email":"mohamed@example.com",
    "password":"password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"mohamed@example.com",
    "password":"password123"
  }'
```

### Place an order

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "items":[
      {"menu_item_id":1,"quantity":2}
    ]
  }'
```

## Notes

- The app uses `helmet` and `cors` by default.
- Request logging is enabled.
- The project also includes static-file and SPA fallback support for a frontend client if a `client/` folder is present.
- Menu update/delete routes currently contain a `;id` path segment in the source code, which should probably be corrected to `:id` for consistency.

## License

MIT
