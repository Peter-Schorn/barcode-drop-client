// import logo from './logo.svg';
// import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';

import { Component } from "react";
import { AppContext } from './AppContext.js';

import axios from 'axios';

import UserScansRoot from "./Components/UserScansRoot";


export default class App extends Component {

    static backendUrl = process.env.REACT_APP_BACKEND_URL;

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            dataIsLoaded: false,
        };
    }

    retrieveUser() {
        
        const currentURL = new URL(window.location.href);
        
        // /scans/schornpe
        const path = currentURL.pathname;
        const pathParts = path.split('/');
        if (pathParts.length >= 2) {
            // schornpe
            const user = pathParts[1];
            return user;
        }

        console.log(
            "Could not retrieve user from URL: " + window.location.href
        );
        // return null;
        // TODO: Remove this default user
        return "schornpe";
    }

    componentDidMount() {
        console.log("App.componentDidMount(): will retrieveAllUserBarcodes()");
        // this.retrieveAllUserBarcodes();
    }

    retrieveAllUserBarcodes = () => {
        
        const user = this.retrieveUser();
        let url = App.backendUrl + "/scans";
        if (user) {
            url += "/" + user;
            console.log("Retrieving all user barcodes for user: " + user);
        }
        else {
            console.log("Retrieving all barcodes (user could not be retrieved)");
        }

        axios.get(url).then((result) => {

            console.log(
                `Retrieved all user barcodes for user ${user}: `,
                result.data
            );

            this.setState({
                items: result.data,
                dataIsLoaded: true,
            });

        });
    }

    clearAllUserBarcodes = () => {

        const user = this.retrieveUser();

        if (!user) {
            console.log("User could not be retrieved for url: " + window.location.href);
            return;
        }

        let url = App.backendUrl + "/scans/" + user;

        axios.delete(url).then((result) => {
            console.log(result.data);
            this.setState({
                items: [],
                dataIsLoaded: true,
            });
        });

    }


    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/scans/:user" element={<UserScansRoot
                        barcodes={this.state.items}
                        dataIsLoaded={this.state.dataIsLoaded}
                        clearAllUserBarcodes={this.clearAllUserBarcodes}
                    />} />
                </Routes>
            </BrowserRouter>
        );
    }



}
