import React, { useState, useContext } from "react";
import { useSocket } from "./Socket";

interface Session {
    me: { id: string; name: string };
    channel: string;
}

type Me = {id: string, name: string}

type SessionContext = {me: Me, channel: string, setChannel: (channel: string) => void}

const SessionContext = React.createContext<SessionContext>({me : {name: '', id: ''}, channel: '', setChannel: (channel) => {}});

type HandlerArg = { type: any; payload: any };

type Handler = (arg: HandlerArg) => void;

const Session: React.FC = ({ children }) => {
    const [me, setMe] = useState({ id: "", name: "" });
    const [channel, _setChannel] = useState("all");

    const handler: Handler = ({ type, payload }) => {
        switch (type) {
            case "WELCOME":
                return setMe({ id: payload.id, name: payload.name });

            default:
                break;
        }
    };
    useSocket(handler);

    const setChannel = (newChannel: string) => _setChannel(currentChannel => currentChannel === newChannel ? "all" : newChannel)

    const context = {
        me, channel, setChannel
    }

    return (
        <SessionContext.Provider value={context}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    return context;
};

export default Session;
