import React, {useEffect, useState} from "react";
import "./App.css";
import ClientList from './ClientList'
import Chat from './Chat'

import {useSocket} from './Socket'


interface Message {
    message: string;
    id: number;
}

interface MessageAction {
    type: string;
    payload: Message;
}

const Container: React.FC = (props) => {
    const [id, setId] = useState(0)
    const socket = useSocket()

    const handler = ({type, payload}: MessageAction) => {
        switch (type) {
            case "WELCOME":
                return setId(payload.id)
        
            default:
                break;
        }
        
    }
    
    
    useEffect( () => {
        socket.onmessage = (e) => {
            try {
                handler(JSON.parse(e.data))
            } catch (error) {
                console.error(error)
            }   
        }
    }, [socket])
    
    
    return (
        <div className="App">
            <header>Header</header>
            <section className="container"><ClientList /><Chat viewer={id}/></section>
            <footer>Footer</footer>
        </div>
    );
};

export default Container;