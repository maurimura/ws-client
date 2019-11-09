import React, { useEffect, useReducer } from "react";
import { useSocket } from "./Socket";

const initialState = {
    list: [],
};

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "WELCOME":
            return { ...state, list: action.payload };

        case "ADD": {
            return { ...state, list: [...state.list, action.payload] };
        }

        case "DEL": {
            const filteredList = state.list.filter(client => client !== action.payload);
            return { ...state, list: filteredList };
        }

        default:
            return state;
            break;
    }
};

const ClientList: React.FC = props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const socket = useSocket();

    const handler = (event: any) => {
        try {
            dispatch(JSON.parse(event.data));
        } catch (error) {
            console.error(error);
            console.log(event.data);
        }
    };
    useEffect(() => {
        socket.onmessage = handler;

    }, [socket]);

    return (
        <div>
            {state.list.length > 0 && (
                <>
                    <p>Client list:</p>
                    <ul>
                        {state.list.map((client: string) => (
                            <li key={client}>{client}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default ClientList;
