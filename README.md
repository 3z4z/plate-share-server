# PlateShare - Server

**PlateShare** is the backend server for the PlateShare application, enabling users to share extra meals and connect with their community. This server handles all API requests, user authentication, and database operations.

---

## Features

- User authentication (signup/login)
- Create, read, update, and delete food posts
- Manage donations and requests
- Real-time updates for available foods
- RESTful API endpoints

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (NodeJS Driver)
- Firebase Admin SDK for authentication

---

## Installation

1. Clone and package install

```bash
git clone https://github.com/3z4z/plate-share-server
cd plate-share-server
npm install
```

2. Create `.env`

```bash
PORT = 3000
MONGODB_URI = your full mongoDB uri here
FIREBASE_SERVICE_KEY = utf8 firebase key
```

3. Run the project

```bash
npm install
```

## API Endpoints

| Method | Endpoint      | Description                 |
| ------ | ------------- | --------------------------- |
| POST   | /users        | Set a new user              |
| GET    | /foods        | Get all food posts          |
| POST   | /foods        | Create a new food post      |
| GET    | /foods/:id    | Get a specific food post    |
| PATCH  | /foods/:id    | Update a food post          |
| DELETE | /foods/:id    | Delete a food post          |
| GET    | /requests     | Get all requests posts      |
| GET    | /requests/:id | Get a specific request post |
| PATCH  | /requests/:id | Update a request post       |
| DELETE | /foods/:id    | Delete a request post       |
