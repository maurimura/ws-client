import React from "react";
import logo from "./logo.svg";
import Socket from "./Socket";
import Container from "./Container";

function App() {
    return (
        <Socket>
            <Container />
        </Socket>
    );
}

export default App;
