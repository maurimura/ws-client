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
        <div className="flex flex-column w-75 near-black bg-light-gray">
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
    console.log(messages);

    const groupedMessages: Pick<
        Message,
        "id" | "message"
    >[][] = messages.reduce(
        (acc: Pick<Message, "id" | "message">[][], curr) => {
            // Empty list
            if (acc[0].length === 0) {
                const ret = [[curr]];
                return ret;
            }

            // If any group, check the last one id and compare with the curr id
            const lastGroupedIndex = acc.length - 1;
            if (
                acc[lastGroupedIndex][
                    acc[lastGroupedIndex].length
                        ? acc[lastGroupedIndex].length - 1
                        : 0
                ].id === curr.id
            ) {
                // If match, append the message to the group
                const all = acc;
                all[lastGroupedIndex] = [...acc[lastGroupedIndex], curr];

                return all;
            } else {
                // If not match, create a new group
                const ret = [...acc, [curr]];
                return ret;
            }
        },
        [[]]
    );
    return (
        <ul className="flex flex-column h-100 pv3 ph2 justify-end">
            {groupedMessages.map(
                (messagesByUser, i) =>
                    messagesByUser.length > 0 && (
                        <MessageGroup
                            messagesByUser={messagesByUser}
                            idGroup={i}
                        />
                    )
            )}
        </ul>
    );
};

interface MessageGroup {
    messagesByUser: Pick<Message, "id" | "message">[];
    idGroup: number;
}

const MessageGroup: React.FC<MessageGroup> = ({ messagesByUser, idGroup }) => {
    const id = messagesByUser[0].id;
    return (
        <li key={`${id}-${idGroup}`}>
            <ul>
                {messagesByUser.map(({ message, id }, i) => (
                    <li key={i} className="pv1">
                        {i === 0 && <p className="b">{id}</p>}
                        <span className="pl3">{message}</span>
                    </li>
                ))}
            </ul>
        </li>
    );
};

const Header: React.FC = props => {
    const { channel } = useSession();
    return (
        <header className="shadow-3">
            <h1 className="pl2">{channel}</h1>
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

    const handleClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
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
        <form className="flex pa2 " onSubmit={onSubmit}>
            <input
                className="w-100 near-black ba b--near-black br0 ph1 pv2 bg-transparent placeholder"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Insert text"
            />
        </form>
    );
};

export default Chat;
