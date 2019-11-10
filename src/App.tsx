import React from "react";
import Socket from "./Socket";
import Container from "./Container";
import Session from "./Session";

const url = "ws://localhost:3000/ws/";

function App() {
    const socket = new WebSocket(url);
    return (
        <Socket socket={socket}>
            <Session>
                <Container />
            </Session>
        </Socket>
    );
}

export default App;
