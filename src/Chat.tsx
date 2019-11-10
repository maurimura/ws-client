import React, { useState } from "react";
import "./App.scss";
import { useSocket } from "./Socket";
import { useMessageStore } from "./MessageStore";
import { useSession } from "./Session";

interface MessagesStore {
    [view: string]: Omit<Message, "channel">[];
}

const Chat: React.FC = props => {
    return (
        <div className="chat">
            <Header />
            <MessageList />
            <SendMessage />
        </div>
    );
};

interface Message {
    channel: string;
    message: string;
    id: string;
}

const MessageList: React.FC = props => {
    const { me, channel } = useSession();
    const messages = useMessageStore()[channel] || [];
    return (
        <ul className="message-list">
            {messages.map(({ message, id }) => (
                <li key={`${message}-${id}`} className={`${id === me ? "mine" : ""}`}>{`${message} from ${id}`}</li>
            ))}
        </ul>
    );
};

const Header: React.FC = props => {
    const { channel } = useSession();
    return (
        <header className="chat-header">
            <h1>{channel}</h1>
        </header>
    );
};

const SendMessage: React.FC = props => {
    const [message, setMessage] = useState("");
    const { channel } = useSession();

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
        if (channel === "all") {
            socket.send(`/all ${message}`);
        } else {
            socket.send(`/to ${channel} ${message}`);
        }

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
