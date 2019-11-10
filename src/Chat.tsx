import React, { useState, useEffect } from "react";
import "./App.css";
import { useSocket } from "./Socket";

interface Chat {
    viewer: number
}

const Chat: React.FC<Chat> = ({viewer}) => {
    return (
        <div className="chat">
            <MessageList viewer={viewer} />
            <SendMessage />
        </div>
    );
};

interface Message {
    message: string;
    id: number;
}

interface MessageAction {
    type: string;
    payload: Message;
}

const MessageList: React.FC<Chat> = ({viewer}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const socket = useSocket();

    const handler = ({ type, payload }: MessageAction) => {
        switch (type) {
            case "NEW":
                const newMessageArray = [...messages, payload];
                return setMessages(newMessageArray);

            default:
                break;
        }
    };

    useEffect(() => {
        socket.addEventListener("message", e => {
            try {
                handler(JSON.parse(e.data));
            } catch (error) {
                console.error(error);
            }
        });
    }, [socket, messages]);

    return (
        <ul className="message-list">
            {messages.map(({ message, id }) => (
                <li className={`${id === viewer ? "mine" : ''}`}>{`${message} from ${id}`}</li>
            ))}
        </ul>
    );
};

const SendMessage: React.FC = props => {
    const [message, setMessage] = useState("");

    const socket = useSocket();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage(message);
        return;
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        sendMessage(message);
        return;
    };

    const sendMessage = (message: string) => {
        console.log(`${message} SENT`);
        socket.send(`/all ${message}`);

        setMessage("");
    };

    return (
        <form className="send-message" onSubmit={onSubmit}>
            <input className="send-message-input" value={message} onChange={e => setMessage(e.target.value)} placeholder="Insert text" />
            <button onClick={handleClick}>Send</button>
        </form>
    );
};

export default Chat;
