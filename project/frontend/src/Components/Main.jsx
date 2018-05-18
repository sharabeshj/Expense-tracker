import React from "react";
import { Route,Switch } from "react-router-dom";
import Home from "./Home/Home";
import Expenses from "../Containers/Expenses";
import Login from "../Containers/Login";
import Aux from "../hoc/Aux/Aux";
import LoginFyle from './ExpenseDetails/LoginFyle';


const main = (props) => {

    return (
        <Aux>
            <Switch>
                <Route exact path = '/login' component = {Login}/>
                <Route exact path = '/expenses' render = { (props) =>  <Expenses search = {props.location.search}/>}>
                <Switch>
                    <Route exact path = '/expenses/loginFyle' component = {LoginFyle}/>
                    <Route exact path = '/expenses/redirect/:clientId' component = { (props) => window.location = 'https://staging.fyle.in/#/simple/oauth?client_id='+props.params.value+'&redirect_uri=http://127.0.0.1:3000/expenses/'}/>
                    </Switch>
                </Route>
                <Route exact path = "/" component = {Home} />
            </Switch>
        </Aux>
    )
}

export default main;