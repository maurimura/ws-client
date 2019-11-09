import React, { useContext, useEffect } from "react";

const SocketContext = React.createContext(new WebSocket("ws://localhost:3000/ws/"));

interface Socket {
    url?: string;
}

const Socket: React.FC<Socket> = ({ children, url = "ws://localhost:3000/ws/" }) => {
    const socket = new WebSocket(url);

    useEffect(() => {
        socket.onopen = () => console.log("Socket connected");
    }, [socket]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
};

export default Socket;
