import React from "react";
import Main from "./Components/Main.jsx";
import Aux from "./hoc/Aux/Aux";
import Layout from "./Components/Layout/Layout";

export default class App extends React.Component {
    render(){
        return (
            <Aux>
                <Layout>
                    <Main />
                </Layout>
            </Aux>
        );
    }
}