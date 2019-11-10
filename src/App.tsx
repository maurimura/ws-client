import React, {useState, useMemo} from "react";
import logo from "./logo.svg";
import Socket from "./Socket";
import Container from "./Container";

const url = "ws://localhost:3000/ws/";

function App() {
    const socket = new WebSocket(url);
    return (
        <Socket socket={socket}>
            <Container/>
        </Socket>
    );
}

export default App;
