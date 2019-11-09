import React from "react";
import "./App.css";
import ClientList from './ClientList'

const Container: React.FC = props => {
    return (
        <div className="App">
            <header>Header</header>
            <section className="container"><ClientList /></section>
            <footer>Footer</footer>
        </div>
    );
};

export default Container;