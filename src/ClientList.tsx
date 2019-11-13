import React, { useState, useReducer } from "react";
import { useSocket } from "./Socket";
import { useMessageStore } from "./MessageStore";
import { useClients } from "./ClientsStore";
import { useSession } from "./Session";

import "./App.scss";

type Client = {id: string, name: string}


const ClientList: React.FC = props => {

    const clients = useClients()
    const message = useMessageStore();
    const { setChannel } = useSession();

    const viewHandler = (newClient: string) => {
        setChannel(newClient);
    };

    const getMsgCountByClient = (client: {id: string, name: string}) => {
        return message[client.id] ? message[client.id].length : 0;
    };
    return (
        <ul className="w-25 bg-near-black light-gray tc pt4">
            {clients.length > 0 &&
                clients.map((client: {id: string, name: string}) => {
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
