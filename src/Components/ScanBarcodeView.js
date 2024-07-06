import React from "react";
import { Component } from "react";

import { AppContext } from "../Model/AppContext";

import { Button, Dropdown, Stack, Form, Col, Row } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import Modal from "react-modal";

export default class ScanBarcodeView extends Component {

    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            barcode: ""
        };

        this.barcodeField = React.createRef();

    }

    componentDidMount() {

        console.log("ScanBarcodeView.componentDidMount()");

        this.barcodeField?.current?.focus();

    }

    componentWillUnmount() {
        
        console.log("ScanBarcodeView.componentWillUnmount()");

    }

    handleInputChange = (event) => {

        const newBarcode = event?.target?.value;

        console.log(
            `ScanBarcodeView.handleInputChange(): ` +
            `"${newBarcode}"`
        );

        this.setState({ 
            barcode: newBarcode
        });
    };

    onSubmitForm = (event) => {

        
        const barcode = this.state?.barcode;
        if (!barcode) {
            console.log(
                "ScanBarcodeView.onSubmitForm(): barcode is EMPTY"
            );
            return;
        }

        console.log(
            `ScanBarcodeView.onSubmitForm(): user: "${this.state.user}"; ` +
            `barcode: "${barcode}"`
        );
        
        this.scanBarcode(this.state.barcode);

        event.preventDefault();

    };

    scanBarcode = (barcode) => {
        
        const user = this.props?.user;

        if (!user) {
            console.error(
                "ScanBarcodeView.scanBarcode(): user is EMPTY"
            );
            return;
        }

        console.log(
            `ScanBarcodeView.scanBarcode(): will barcode ` +
            `for user "${user}": "${barcode}"`
        );

        this.context.api.scanBarcode({user, barcode})
            .then((response) => {
                console.log(
                    `ScanBarcodeView.scanBarcode(): response: ` +
                    `"${response}"`
                );
            })
            .catch((error) => {
                console.error(
                    `ScanBarcodeView.scanBarcode(): error: ` +
                    `"${error}"`
                );
            });

    }

    render() {
        return (
            <div 
                className="mt-3 p-2 border border-2 rounded "
                style={{
                    // width: "100%",
                    maxWidth: "600px",
                    margin: "auto",
                    backgroundColor: "lightgray"
                }}
            >
                <Form
                    onSubmit={this.onSubmitForm}
                >
                    
                    {/* <div 
                        className="row justify-content-start"
                    > */}
                    <div 
                        className="d-flex p-2"
                    >
                            {/* COLUMN */}
                            <div 
                                className="flex-fill pe-3"
                            >

                                {/* <FloatingLabel
                                    controlId="floatingInput"
                                    label="Enter Barcode"
                                    className=""  // "mb-3"
                                    size="sm"
                                > */}
                                    <Form.Control
                                        ref={this.barcodeField}
                                        type="text"
                                        // size="sm"
                                        value={this.state.barcode}
                                        onChange={this.handleInputChange}
                                        placeholder="Enter Barcode"
                                    />
                                {/* </FloatingLabel> */}
                            </div>
                            
                            {/* COLUMN */}
                            <div 
                                className=""
                            >
                                <Button 
                                    // className="m-3" 
                                    variant="dark" 
                                    type="submit"
                                    style={{
                                        maxWidth: "80px"
                                    }}
                                >
                                    Submit
                                </Button>
                            </div>
                    </div>
                </Form>
            </div>
        );
    }
}

// className={
//     "d-flex justify-content-center align-items-center " +
//     "w-100 h-75 "
//     // "bg-secondary"
// }

// <Form
//     onSubmit={this.onSubmitForm}
// >
    
//     <div className="row justify-content-start">
//             <div className="col-sm-8">

//                 {/* <FloatingLabel
//                     controlId="floatingInput"
//                     label="Enter Barcode"
//                     className=""  // "mb-3"
//                     size="sm"
//                 > */}
//                     <Form.Control
//                         ref={this.barcodeField}
//                         type="text"
//                         // size="sm"
//                         value={this.state.barcode}
//                         onChange={this.handleInputChange}
//                         placeholder="Enter Barcode"
//                         style={{
//                             maxWidth: "300px"
//                         }}
//                     />
//                 {/* </FloatingLabel> */}
//             </div>
//             {/* <Col xs={3}> */}
//             <div className="col-sm-2">
//                 <Button 
//                     // className="m-3" 
//                     variant="dark" 
//                     type="submit"
//                     style={{
//                         maxWidth: "80px"
//                     }}
//                 >
//                     Submit
//                 </Button>
//             </div>
//     </div>
// </Form>
