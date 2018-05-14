import React,{ Component } from "react";
import { Route,Switch,Redirect } from "react-router-dom";
import Home from "../Containers/Home";
import Expenses from "../Containers/Expenses";
import Login from "../Containers/Login"

const auth = require("./auth");

export default class Main extends Component {
    render(){
        return (
            <div>
                <Switch>
                    <Route path = '/login' component = {Login}/>
                    <Route path = '/expenses' render = {() => (
                        auth.loggedIn() ? (
                            <Expenses />
                        ) : (
                            <Redirect to= "/login" />
                        )
                    )}/>
                    <Route exact path = "/" component = {Home} />
                </Switch>
            </div>
        );
    }
}