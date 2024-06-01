import React from 'react';
import { Component } from "react";
import { Container } from "react-bootstrap";


export default class SetupView extends Component {

    render() {
        return (
            <Container className="text-center pb-4" fluid="lg">
                <h1 className="p-5">Setup</h1>


                <p>
                    Make a POST request to the following URL
                    in your barcode scanner app
                    (replace {"<user>"} with your username):
                </p>

                {/* <code style={{ all: "revert"}}> */}
                <code>
                    {"https://api.barcodedrop.com/scan/<user>"}
                </code>

                {/* <a href="https://api.barcodedrop.com/scan/<user>">
                    {"https://api.barcodedrop.com/scan/<user>"}
                </a> */}

                <p className="pt-3">
                    <strong>Request Body:</strong>
                </p>

                <p className="">
                    Query string/form-url-encoded in the body: 
                    <span style={{padding: "0px 10px", fontFamily: "'Courier New', monospace"}}>
                        {"barcode=<barcode> or text=<barcode>"}
                    </span>
                </p>

                <p className="pb-2">
                    In the body as JSON:
                    <span style={{padding: "0px 10px", fontFamily: "'Courier New', monospace"}}>
                    {`{ "barcode": "<barcode>" } or { "text": "<barcode>" }`}
                    </span>
                </p>

                <p className="pt-5">
                    <strong>
                        Access your scanned barcodes at the following URL 
                        (replace {"<user>"} with your username):
                    </strong>
                </p>

                <code>
                    {"https://barcodedrop.com/scans/<user>"}
                </code>

            </Container>
                
        );
    }

}
