import React, {useReducer, useContext} from 'react'
import {useSocket} from './Socket'


const ClientStoreContext = React.createContext<Client[]>([])

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

const ClientStore: React.FC = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const handler = (message: any) => {
        dispatch(message);
    };
    useSocket(handler);

    return <ClientStoreContext.Provider value={state.list}>{children}</ClientStoreContext.Provider>
}


export const useClients = () => useContext(ClientStoreContext)

export default ClientStore