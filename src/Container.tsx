import React from "react";
import "./App.scss";
import ClientList from "./ClientList";
import Chat from "./Chat";

import { useSocket } from "./Socket";
import MessagesStore, { MessageAction } from "./MessageStore";
import { useSession } from "./Session";
import ClientStore from "./ClientsStore";


const Container: React.FC = props => {

    return (
        <section className="flex h-100 w-100">
            <MessagesStore>
                <ClientStore>
                    <ClientList />
                    <Chat />
                </ClientStore>
            </MessagesStore>
        </section>
    );
};

export default Container;
