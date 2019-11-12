import React, { useState, useReducer } from "react";
import { useSocket } from "./Socket";
import { useMessageStore } from "./MessageStore";
import { useSession } from "./Session";

import "./App.scss";

type Client = {id: string, name: string}

const initialState: {list: Client[]} = {
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
            const filteredList = state.list.filter((client: Client) => client.id !== action.payload);
            return { ...state, list: filteredList };
        }

        case "CHANGE_NAME": {
            const newNameIndex = state.list.findIndex((client: Client) => client.id !== action.payload);
            const list = [...state.list]
            list[newNameIndex] = {...state.list[newNameIndex], name: action.payload.name}
            return { ...state, list };
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

    const getMsgCountByClient = (client: {id: string, name: string}) => {
        return message[client.id] ? message[client.id].length : 0;
    };

    return (
        <ul className="w-25 bg-near-black light-gray tc pt4">
            {state.list.length > 0 &&
                state.list.map((client: {id: string, name: string}) => {
                    const count = getMsgCountByClient(client);
                    return <ClientItem key={`${client}-${count}`} client={client} viewHandler={viewHandler} count={count} />;
                })}
        </ul>
    );
};


interface ClientItem {
    client: Client;
    viewHandler: (client: string) => void;
    count: number;
}

const ClientItem: React.FC<ClientItem> = ({ client, viewHandler, count }) => {
    const [visited, setVisited] = useState(false);
    const { channel } = useSession();

    const handleClick = () => {
        setVisited(true);
        viewHandler(client.id);
    };

    const className = count > 0 && client.id !== channel && !visited ? "b" : "";

    return (
        <li onClick={handleClick} key={client.id} className={`${className} client-item`}>
            {client.name}
        </li>
    );
};

export default ClientList;
