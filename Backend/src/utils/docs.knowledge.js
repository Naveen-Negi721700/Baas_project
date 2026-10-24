// What the assistant knows about using Backora in your own app.
// It is the same content as the "How to use" page (/docs). Keep the two in sync.

// The address of your public API (the routes your users' apps call).
// If the URL that works in Postman is different, change only this one line.
const BASE_URL = "http://localhost:8000/api/v1/public";

export const DOCS_TEXT = `
## Where the documentation is
The full documentation, with copy-ready examples, is the "How to use" page of the app at /docs. The Collections page also has a "How to use" button.

## Before you start
To use a collection in your own app you need three values. Copy them from the Collections page after the API key is generated:
1. API key: starts with sk_ and goes in the x-api-key header.
2. Key ID: identifies the key and goes in the x-api-key-id header.
3. Collection ID: goes at the end of every URL, in place of YOUR_COLLECTION_ID.
The API key is shown only once, so copy it and keep it secret.

Base URL: ${BASE_URL}

Every request needs these headers:
Content-Type: application/json
x-api-key: YOUR_API_KEY
x-api-key-id: YOUR_API_KEY_ID
In fetch, also use credentials: "include", so the login cookie is saved and sent with the next requests.

## users collection (signup, signin and signout for your own app)

### Register User (sign up)
Creates a new user in your collection.
POST ${BASE_URL}/register/YOUR_COLLECTION_ID
Body (JSON): { "username": "john123", "email": "user@example.com", "password": "Password@123" }
Response (201): { "statusCode": 201, "data": { "_id": "USER_ID", "username": "john123", "email": "user@example.com" }, "message": "User registered successfully", "success": true }
The password is never sent back.
Example code:
fetch("${BASE_URL}/register/YOUR_COLLECTION_ID", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "YOUR_API_KEY",
    "x-api-key-id": "YOUR_API_KEY_ID",
  },
  body: JSON.stringify({ username: "john123", email: "user@example.com", password: "Password@123" }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));

### Login User (sign in)
Logs a user in with their email and password.
POST ${BASE_URL}/loginUser/YOUR_COLLECTION_ID
Body (JSON): { "email": "user@example.com", "password": "Password@123" }
Response (200): { "statusCode": 200, "data": { "_id": "USER_ID", "username": "john123", "email": "user@example.com" }, "message": "Logged in successfully", "success": true }
Use the same headers and the same fetch pattern as Register User, with this URL and body.

### Logout User (sign out)
Logs the current user out.
POST ${BASE_URL}/logoutUser/YOUR_COLLECTION_ID
No body. Same headers and the same fetch pattern as Register User, without the body.
Response (200): { "statusCode": 200, "data": {}, "message": "Logged out successfully", "success": true }

### Get Current User
Gets the details of the user who is logged in right now.
GET ${BASE_URL}/getCurrentUser/YOUR_COLLECTION_ID
No body. Same headers, with credentials: "include" so the login cookie is sent.
Response (200): { "statusCode": 200, "data": { "_id": "USER_ID", "username": "john123", "email": "user@example.com" }, "message": "User fetched successfully", "success": true }

### Refresh Access Token
Gets a new access token when the old one has expired.
POST ${BASE_URL}/refreshAccessToken/YOUR_COLLECTION_ID
No body. Same headers, with credentials: "include".
Response (200): { "statusCode": 200, "data": { "accessToken": "NEW_ACCESS_TOKEN" }, "message": "Access token refreshed successfully", "success": true }
`;