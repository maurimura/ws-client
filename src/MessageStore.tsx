import React, { useState, useContext } from "react";
import { useSocket } from "./Socket";

const MessagesStoreContext = React.createContext({});

interface MessagesStore {
    [view: string]: Omit<Message, "channel">[];
}

export interface Message {
    channel: string;
    message: string;
    id: string;
}

export interface MessageAction {
    type: string;
    payload: Message;
}

type Context = [MessagesStore, React.Dispatch<React.SetStateAction<MessagesStore>>];

const MessagesStore: React.FC = ({ children }) => {
    const context = useState<MessagesStore>({ all: [] });
    const [, setMessages] = context as Context;

    const handler = ({ type, payload: { channel = "all", ...message } }: MessageAction) => {
        switch (type) {
            case "NEW":
                return setMessages(oldMessages => ({
                    ...oldMessages,
                    [channel]: [...(oldMessages[channel] || []), message],
                }));

            default:
                break;
        }
    };
    useSocket(handler);

    return <MessagesStoreContext.Provider value={context}>{children}</MessagesStoreContext.Provider>;
};

export const useMessageStore = () => {
    const context = useContext(MessagesStoreContext);

    if (!context) throw Error("Context undefined");

    const [messages,] = context as Context;

    return messages;
};

export default MessagesStore;
