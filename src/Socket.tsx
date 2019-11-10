import React, { useContext, useEffect, useRef, useMemo } from "react";

const SocketContext = React.createContext({});

interface Socket {
    socket: WebSocket;
}

const Socket: React.FC<Socket> = ({ socket, children }) => {
    useEffect(() => {
        socket.onopen = () => console.log("Socket connected");

        socket.addEventListener("message", (e) => console.log("[MESSAGE]: ", e.data));
        
    }, [socket]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket as WebSocket;
};

export default Socket;
