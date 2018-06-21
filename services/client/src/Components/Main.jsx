import React from "react";
import { Route,Switch } from "react-router-dom";
import Home from "./Home/Home";
import Expenses from "../Containers/Expenses";
import Aux from "../hoc/Aux/Aux";


const main = (props) => {

    return (
        <Aux>
            <Switch>
                <Route path = '/expenses' component={Expenses}/>
                <Route exact path = "/" component = {Home} />
            </Switch>
        </Aux>
    )
}

export default main;