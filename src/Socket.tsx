import React, { useContext, useEffect } from "react";

const SocketContext = React.createContext({});

interface Socket {
    socket: WebSocket;
}

const Socket: React.FC<Socket> = ({ socket, children }) => {
    useEffect(() => {
        socket.onopen = () => console.log("Socket connected");
        socket.addEventListener("message", e => console.log(`[MESSAGE] ${e.data}`));
    }, [socket]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

interface MessageAction {
    type: string;
    payload: any;
}

type Handler = (arg: MessageAction) => void;

export const useSocket = (handler?: Handler) => {
    const _socket = useContext(SocketContext);

    useEffect(() => {
        const socket = _socket as WebSocket;

        const socketHandler = (e: MessageEvent) => {
            try {
                if (handler) {
                    handler(JSON.parse(e.data));
                } else {
                    return;
                }
            } catch (error) {
                console.error(error);
            }
        };

        socket.addEventListener("message", socketHandler);

        return () => {
            socket.removeEventListener("message", socketHandler);
        };
    }, [_socket, handler]);

    return _socket as WebSocket;
};

export default Socket;
