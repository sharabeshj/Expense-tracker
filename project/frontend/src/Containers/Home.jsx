import React,{ Component } from "react";
import { Link } from "react-router-dom";

export default class Home extends Component{
    render(){
        return (
            <div>
                <h3>Welcome to Expense app</h3>
                <Link to = "/login"><button>Continue</button></Link>
            </div>
        );
    }
}
