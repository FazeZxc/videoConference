# Meet Clone Application

## Overview
A video conferencing application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. This project replicates key features of popular meeting platforms like Google Meet, including user authentication, meeting creation/joining, and secure session handling.

---

## Features
- **User Authentication**: Secure login and registration using JWT tokens.
- **Meeting Management**: Create new meetings or join existing ones using unique IDs.
- **Protected Routes**: Pages like the landing page and meeting room are only accessible to authenticated users.
- **State Management**: Efficiently handled using Recoil for global state.
- **Responsive Design**: Optimized for various screen sizes.
- **Cookies**: Secure and persistent session storage using cookies.

---

## Technologies Used

### Frontend
- **React.js**: Component-based library for building the user interface.
- **Recoil**: State management for handling user and session data.
- **Axios**: HTTP client for API communication.
- **React Router**: Handles routing between application pages.

### Backend
- **Node.js**: Runtime for the backend server.
- **Express.js**: Framework for building the RESTful API.
- **MongoDB**: NoSQL database for storing user and meeting data.
- **JWT (JSON Web Tokens)**: Secure authentication and authorization.
- **Cookie-parser**: Middleware for parsing and handling cookies.

---

## Setup Instructions

### Prerequisites
1. Node.js (v16 or higher)
2. MongoDB (locally installed or a cloud instance like MongoDB Atlas)
3. npm or yarn

### Clone the Repository
```bash
git clone https://github.com/your-username/meet-clone.git
cd meet-clone
```

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=<your_mongo_db_uri>
   JWT_SECRET=<your_jwt_secret>
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add the following variable:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
4. Start the frontend server:
   ```bash
   npm run dev
   ```

### Access the Application
Open your browser and navigate to `http://localhost:5173`.

---

## Folder Structure
```
meet-clone/
├── client/              # Frontend code
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # React pages
│   │   ├── store/       # Recoil state atoms
│   │   └── utils/       # Utility functions (e.g., hooks)
│   ├── public/          # Static assets
│   └── .env             # Frontend environment variables
├── server/              # Backend code
│   ├── controllers/     # Request handlers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middlewares/     # Express middlewares
│   └── .env             # Backend environment variables
└── README.md            # Documentation
```

---

## API Endpoints

### Auth Endpoints
- **POST /user/register**: Register a new user.
- **POST /user/login**: Authenticate a user and return a JWT token.
- **GET /user/me**: Fetch the current logged-in user details (requires authentication).
- **POST /user/logout**: Log the user out and clear the token.

### Meeting Endpoints
- **POST /meeting/create**: Create a new meeting.
- **GET /meeting/:id**: Get meeting details by ID.

---

## Protected Route Implementation
Protected routes are implemented using React Router and Recoil. The `ProtectedRoute` component checks for the user state and only renders child components if the user is authenticated.

Example:
```jsx
<Route
  path="/landing"
  element={
    <ProtectedRoute>
      <Landing />
    </ProtectedRoute>
  }
/>
```

---

## Logout Logic

### Frontend
The `Logout` component clears the user state and removes the token from cookies by calling the backend.

```jsx
const handleLogout = async () => {
  await axios.post(`${backendURL}/user/logout`, {}, { withCredentials: true });
  setUser(null);
};
```

### Backend
The `/user/logout` endpoint clears the JWT token from cookies:
```js
res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });
res.status(200).json({ message: "Logged out successfully" });
```

---

## Future Enhancements
- Add real-time video streaming using WebRTC.
- Implement chat functionality.
- Optimize for better performance with larger user groups.

---

## Contributing
Feel free to fork this repository and submit pull requests for new features, bug fixes, or improvements.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

