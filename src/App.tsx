import React from "react";
import Socket from "./Socket";
import Container from "./Container";
import Session from "./Session";

const url = "ws://localhost:3000/ws/";

function App() {
    const name = window.localStorage.getItem('name') || ''
    const socket = new WebSocket(name.length > 0 ? `${url}${name}` : url);
    return (
        <Socket socket={socket}>
            <Session>
                <Container />
            </Session>
        </Socket>
    );
}

export default App;
