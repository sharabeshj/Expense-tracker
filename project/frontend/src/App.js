import React from "react";
import { NavLink } from 'react-router-dom';
import Main from "./Components/Main.jsx";

export default class App extends React.Component {
    render(){
        return (
            <div>
                <header>
                    <ul>
                        <li><NavLink to = "/">Home</NavLink></li>
                        <li><NavLink to = "/expenses">Expenses</NavLink></li>
                    </ul>
                </header>
                <Main />
            </div>
        );
    }
}