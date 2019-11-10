import React, { useState, useReducer } from "react";
import { useSocket } from "./Socket";
import { useMessageStore } from "./MessageStore";
import { useSession } from "./Session";

import "./App.scss";

const initialState = {
    list: [],
};

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "WELCOME":
            return { ...state, list: action.payload.clients };

        case "ADD": {
            return { ...state, list: [...state.list, action.payload] };
        }

        case "DEL": {
            const filteredList = state.list.filter(client => client !== action.payload);
            return { ...state, list: filteredList };
        }

        default:
            return state;
    }
};

const ClientList: React.FC = props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const handler = (message: any) => {
        dispatch(message);
    };
    useSocket(handler);

    const message = useMessageStore();
    const { setChannel } = useSession();

    const viewHandler = (newClient: string) => {
        setChannel((curretnClient: string) => (newClient === curretnClient ? "all" : newClient));
    };

    const getMsgCountByClient = (client: string) => {
        return message[client] ? message[client].length : 0;
    };

    return (
        <ul className="client-list">
            {state.list.length > 0 &&
                state.list.map((client: string) => {
                    const count = getMsgCountByClient(client);
                    return <ClientItem key={`${client}-${count}`} client={client} viewHandler={viewHandler} count={count} />;
                })}
        </ul>
    );
};

interface ClientItem {
    client: string;
    viewHandler: (client: string) => void;
    count: number;
}

const ClientItem: React.FC<ClientItem> = ({ client, viewHandler, count }) => {
    const [visited, setVisited] = useState(false);
    const { channel } = useSession();

    const handleClick = () => {
        setVisited(true);
        viewHandler(client);
    };

    const className = count > 0 && client !== channel && !visited ? "bold" : "";

    return (
        <li onClick={handleClick} key={client} className={`${className} client-item`}>
            {client}
        </li>
    );
};

export default ClientList;
