import React, { useState, useContext } from "react";

interface Session {
    me: string;
    channel: string;
}

const SessionContext = React.createContext({});


interface Handler {
    me: string;
    setMe: React.Dispatch<React.SetStateAction<string>>;
    channel: string;
    setChannel: React.Dispatch<React.SetStateAction<string>>;
}

const Session: React.FC = ({ children }) => {
    const [me, setMe] = useState("");
    const [channel, setChannel] = useState("all");

    const handlers = {
        me,
        setMe,
        channel,
        setChannel,
    };

    return <SessionContext.Provider value={handlers}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
    const context = useContext(SessionContext) as Handler
    return context
}

export default Session