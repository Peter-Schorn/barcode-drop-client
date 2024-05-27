// import logo from './logo.svg';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';

import { Component } from "react";

import UserScansRoot from "./Components/UserScansRoot";
import SetupView from "./Components/SetupView";

import { AppContext } from './Model/AppContext';

import Backend from './API/backend';

export default class App extends Component {

    static contextType = AppContext;

    static backendUrl = process.env.REACT_APP_BACKEND_URL;

    constructor(props) {
        super(props);
        const api = new Backend();
        this.state = {
            api: api
        };
    }


    componentDidMount() {
        console.log("App.componentDidMount():");
    }

    render() {
        return (
            <AppContext.Provider value={this.state}>
                <BrowserRouter>
                    <Routes>

                        {/* Setup Instructions */}
                        <Route
                            path="/setup"
                            element={<SetupView/>}
                        />

                        {/* User Scans Table */}
                        <Route 
                            path="/scans/:user" 
                            element={<UserScansRoot/>}
                        />

                    </Routes>
                </BrowserRouter>
            </AppContext.Provider>
        );
    }



}
