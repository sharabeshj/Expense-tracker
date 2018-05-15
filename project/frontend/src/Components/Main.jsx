import React from "react";
import { Route,Switch } from "react-router-dom";
import Home from "./Home/Home";
import Expenses from "../Containers/Expenses";
import Login from "../Containers/Login";
import Aux from "../hoc/Aux/Aux";


const main = (props) => {
    return (
        <Aux>
            <Switch>
                <Route path = '/login' component = {Login}/>
                <Route path = '/expenses' component = {Expenses}/>
                <Route exact path = "/" component = {Home} />
            </Switch>
        </Aux>
    )
}

export default main;