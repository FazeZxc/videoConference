// /* eslint-disable react/prop-types */
// /* eslint-disable react-refresh/only-export-components */
// import { createContext, useContext, useMemo, useEffect } from "react";
// import { io } from "socket.io-client";

// const SocketContext = createContext(null);

// export const useSocket = () => {
//   return useContext(SocketContext);
// };

// export const SocketProvider = (props) => {
//   const socket = useMemo(() => io("http://localhost:5000"), []);

//   useEffect(() => {
//     socket.on("connect", () => {
//       console.log("Socket connected:", socket.id);
//     });

//     socket.on("connect_error", (err) => {
//       console.error("Socket connection error:", err);
//     });
//   }, [socket]);

//   return (
//     <SocketContext.Provider value={socket}>
//       {props.children}
//     </SocketContext.Provider>
//   );
// };
