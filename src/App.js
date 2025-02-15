import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";

import { Component } from "react";

import MainNavbar from "./Components/MainNavbar";
import HomeView from "./Components/HomeView";
import UserScansRoot from "./Components/UserScansRoot";
import SetupView from "./Components/SetupView";

import { AppContext } from "./Model/AppContext";

import Backend from "./API/Backend";

import Modal from "react-modal";

Modal.setAppElement("#root");

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

                        {/* --- Home --- */}
                        <Route 
                            path="/" 
                            element={<HomeView/>}
                        />

                        {/* --- Setup Instructions --- */}
                        <Route
                            path="/setup"
                            element={<SetupView/>}
                        />

                        {/* --- User Scans Table --- */}
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
