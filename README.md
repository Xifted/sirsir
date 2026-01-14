# SIRSIR

SIRSIR is a lightweight web-based dashboard built with **Express.js** and **MySQL** to manage Steam accounts with cooldown, ban status, pagination, and sorting.

---

## Requirements

* Node.js (>= 18)
* MySQL Server
* Git

---

## Installation (Local Development)

### 1. Clone Repository

```bash
git clone https://github.com/Xifted/sirsir.git
cd sirsir
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment Variables

This project uses a template environment file.

Copy the example environment file:

```bash
cp .env.example .env
```

Then adjust values inside `.env` if needed.

> Do not commit `.env` to GitHub.

---

### 4. Setup Database

Login to MySQL and run:

```sql
CREATE DATABASE sirsir;
USE sirsir;

CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  status ENUM('READY','COOLDOWN','BANNED') DEFAULT 'READY',
  cooldown_start DATETIME NULL,
  cooldown_until DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 5. Run the Application

```bash
node app.js
```

Open in browser:

```
http://localhost:3000
```

---

## Features

* Server-side pagination
* Server-side sorting (User & Cooldown)
* Cooldown presets + custom hours
* Permanent ban support
* Password hidden with copy feature
* Responsive industrial UI
* Single-page optimized dashboard

---

## Notes

* Sorting uses three states: ASC → DESC → reset
* Pagination preserves active sort state
* Cooldown status updates automatically based on time

---
