import React from 'react';
import { Component } from "react";
import { useParams } from 'react-router-dom';

import { AppContext } from "../Model/AppContext";

import { Button, Table } from 'react-bootstrap';

import UserScansRow from "./UserScanRow";

import Badge from 'react-bootstrap/Badge';

// MARK: - NOT ACTUALLY BEING USED -

export default function UserScansTable(props) {

    // https://reactrouter.com/en/main/start/faq#what-happened-to-withrouter-i-need-it

    // let params = useParams();
    // let location = useLocation();
    // let navigate = useNavigate();

    return (
        <UserScansTableCore
            {...props}
            onClickOpenLink={props.onClickOpenLink}
        />
    );

};

class UserScansTableCore extends Component {

    static contextType = AppContext;

    constructor(props) {
        
        super(props);
        
        /*
         <UserScansTable
            barcodes={this.state.barcodes}
            user={this.user}
            highlightedBarcode={this.state.highlightedBarcode}
            router={this.props.router}
            removeBarcodesFromState={
                 this.removeBarcodesFromState
             }
         />

         */

        this.state = {
            viewportSize: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        if (this.props.user) {
            console.log(
                `UserScansTableCore.constructor(): user: ${this.props.user}`
            );
        }
        else {
            console.error(
                `UserScansTableCore.constructor(): invalid user: ${this.props.user}`
            );
        }
    }

    componentDidMount() {
        
        console.log("UserScansTableCore.componentDidMount():");

        window.addEventListener("resize", this.windowDidResize);
    }

    componentWillUnmount() {
        
        console.log("UserScansTableCore.componentWillUnmount()");

        window.removeEventListener("resize", this.windowDidResize);

    }

    // componentDidUpdate(prevProps, prevState) {
    //     console.log(
    //         `UserScansTableCore.componentDidUpdate(): ` +
    //         `prevProps: ${prevProps}; currentProps: ${this.props}; ` +
    //         `prevState: ${prevState}`
    //     );
    // }

    windowDidResize = (e) => {
        
        this.setState((state) => {
            const size = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            console.log(
                `UserScansTableCore.windowDidResize(): size:`,
                size
            );
            return {
                viewportSize: size
            };
        });

    }


    render() {
        console.log("UserScansTableCore.render()");
        return (
            <Table
                className="barcode-table border-dark"
                striped bordered hover
                style={{ maxWidth: "100%" }}
            >
                <thead>
                    <tr>
                        <th>
                            {/* --- Primary Buttons --- */}
                        {/* </th> */}
                        {/* <th style={{ width: "100px" }}> */}
                            {/* --- Context Menu --- */}
                        </th>
                        <th>Barcode</th>
                        { this.state.viewportSize.width > 600 ? (
                            <th>Time</th>
                        ) : null }
                        { this.state.viewportSize.width > 800 ? (
                            <th style={{ width: "80px" }}>Delete</th>
                        ) : null }
                    </tr>
                </thead>
                <tbody>
                    {this.props.barcodes.map((barcode, index) =>
                        <UserScansRow
                            key={barcode.id}
                            index={index}
                            barcode={barcode}
                            user={this.props.user}
                            viewportSize={this.state.viewportSize}
                            isHighlighted={this.props.highlightedBarcode?.id === barcode.id}
                            router={this.props.router}
                            removeBarcodesFromState={
                                this.props.removeBarcodesFromState
                            }
                            setHighlightedBarcode={
                                this.props.setHighlightedBarcode
                            }
                            onClickOpenLink={this.props.onClickOpenLink}
                        />
                    )}
                </tbody>
            </Table>
        );
    }

}
