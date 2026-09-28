# URL Shortener API

A simple URL Shortener API built with **Node.js, Express.js, and MySQL** as part of the CodeAlpha Backend Development Internship.

The API accepts a long URL, generates a unique short code, stores the URL in a MySQL database, and redirects users to the original URL when the short link is accessed.

## Features

- Create shortened URLs
- Generate random 6-character short codes
- Store URLs in MySQL
- Redirect short URLs to their original URLs
- Validate submitted URLs
- Handle invalid or missing URLs
- Handle non-existent short codes
- Detect duplicate short codes and retry automatically
- Limit duplicate-code retries to prevent infinite loops

## Technologies Used

- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- Thunder Client for API testing

## Project Structure

```text
CodeAlpha_URL_Shortener/
│
├── node_modules/
├── .env
├── .gitignore
├── db.js
├── server.js
├── package.json
└── package-lock.json
```

> `.env` contains private database credentials and should not be committed to GitHub.

## Database Setup

Create a MySQL database:

```sql
CREATE DATABASE codealpha_url_shortener;
```

Use the database:

```sql
USE codealpha_url_shortener;
```

Create the `urls` table:

```sql
CREATE TABLE urls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    original_url VARCHAR(255) NOT NULL,
    short_code VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

Create a `.env` file in the project root:

```env
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=codealpha_url_shortener
PORT=3000
```

Replace `your_password` with your local MySQL password.

## Installation

Clone the repository and enter the project directory:

```bash
cd CodeAlpha_URL_Shortener
```

Install the dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

The API will run on:

```text
http://localhost:3000
```

## API Endpoints

### 1. Create a Short URL

**POST**

```text
/api/shorten
```

Request body:

```json
{
    "url": "https://www.example.com"
}
```

Successful response:

```json
{
    "message": "URL https://www.example.com shortened successfully.",
    "shortUrl": "http://localhost:3000/aB72xQ"
}
```

The generated short code is stored in the database together with the original URL.

### 2. Redirect to Original URL

**GET**

```text
/:shortCode
```

Example:

```text
http://localhost:3000/aB72xQ
```

If the short code exists, the API redirects the user to the original URL.

If the short code does not exist, the API returns:

```json
{
    "message": "No URL found."
}
```

## Validation and Error Handling

The API handles:

- Missing URLs
- Invalid URLs
- Unsupported URL protocols
- Non-existent short codes
- Database errors
- Duplicate short codes

Only `http` and `https` URLs are accepted.

## Testing

The API was tested using Thunder Client.

Test cases include:

- Valid URL submission
- Invalid URL submission
- Missing URL
- Successful redirection
- Non-existent short code
- Duplicate short-code handling
- Database insertion

## Author

Built as part of the **CodeAlpha Backend Development Internship**.