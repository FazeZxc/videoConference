# Client

## Overview
This is the frontend portion of the video conference application, built using React.js and designed to provide a seamless video conferencing experience. The frontend handles user authentication, meeting creation/joining, and routing, while connecting to the backend for API communication.

---

## Features
- **User Authentication**: Secure login and registration using JWT tokens.
- **Meeting Management**: Create new meetings or join existing ones using unique IDs.
- **Protected Routes**: Pages like the landing page and meeting room are accessible only to authenticated users.
- **State Management**: Recoil is used for efficient global state handling.
- **Responsive Design**: Ensures usability on various screen sizes.

---

## Technologies Used
- **React.js**: Component-based UI library.
- **Recoil**: For state management.
- **Axios**: For making API requests.
- **React Router**: For navigation and routing.

---

## Setup Instructions

### Prerequisites
1. Node.js (v16 or higher)
2. npm or yarn


### Install Dependencies
```bash
npm install
```

### Environment Variables
Create a `.env` file in the root directory and add the following:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### Run the Application
```bash
npm run dev
```

### Access the Application
Open your browser and navigate to `http://localhost:5173`.

---

## Folder Structure
```
meet-clone-frontend/
├── src/
│   ├── components/  # Reusable React components
│   ├── pages/       # React pages (Login, Register, Landing, etc.)
│   ├── store/       # Recoil state atoms
│   └── utils/       # Utility functions (e.g., custom hooks)
├── public/          # Static assets
├── .env             # Environment variables
└── README.md        # Documentation
```

---

## Key Components

### ProtectedRoute
A higher-order component to restrict access to certain routes.
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

### Logout Component
Handles user logout by clearing the session and token.
```jsx
const handleLogout = async () => {
  await axios.post(`${backendURL}/user/logout`, {}, { withCredentials: true });
  setUser(null);
};
```

---

## Future Enhancements
- Add real-time video and audio streaming using WebRTC.
- Integrate in-meeting chat functionality.
- Improve UI/UX with animations and themes.

---

## Contributing
Feel free to fork this repository and submit pull requests for enhancements or bug fixes.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

