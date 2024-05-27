import React from 'react';
import { Component } from "react";

export default class MainNavbar extends Component {

    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <div className="container text-center">
                        <a className="navbar-brand" href="#">
                            <strong style={{
                                fontSize: 50,
                                fontFamily: "monospace",
                            }}>
                                Barcode Drop
                                <i style={{margin: "20px"}} class="fa-solid fa-barcode"></i>
                            </strong>
                        </a>
                    </div>
                    <button 
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" 
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false" 
                        aria-label="Toggle navigation"
                    >
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div 
                        className="collapse navbar-collapse" 
                        id="navbarSupportedContent"
                    >
                    {/* <ul 
                        className="navbar-nav me-auto mb-2 mb-lg-0"
                    > */}
                        {/* <li className="nav-item">
                        <a 
                            className="nav-link active" 
                            aria-current="page" 
                            href="#"
                        >
                            Home
                        </a>
                        </li> */}
                        {/* <li className="nav-item">
                        <a className="nav-link" href="#">Link</a>
                        </li> */}
                    {/* </ul> */}
                    </div>
                </div>
            </nav>
        )
    }


}