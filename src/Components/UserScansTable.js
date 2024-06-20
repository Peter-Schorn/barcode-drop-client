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
        />
    );

};

class UserScansTableCore extends Component {

    static contextType = AppContext;

    constructor(props) {
        
        super(props);
        
        /*
         <UserScansTableCore
             barcodes={this.state.barcodes}
             user={this.user}
             autoCopiedBarcode={this.state.autoCopiedBarcode}
             router={this.props.router}
             removeBarcodeFromState={
                 this.removeBarcodeFromState
             }
         />
         */

        if (this.user) {
            console.log(
                `UserScansTableCore.constructor(): user: ${this.user}`
            );
        }
        else {
            console.error(
                `UserScansTableCore.constructor(): invalid user: ${this.user}`
            );
        }
    }

    componentDidMount() {
        console.log("UserScansTableCore.componentDidMount():");
        // console.log(`context.api: ${this.context.api}`);
    }

    // componentDidUpdate(prevProps, prevState) {
    //     console.log(
    //         `UserScansTableCore.componentDidUpdate(): ` +
    //         `prevProps: ${prevProps}; currentProps: ${this.props}; ` +
    //         `prevState: ${prevState}`
    //     );
    // }

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
                        <th style={{ width: "90px" }}>{/* copy button */}</th>
                        <th style={{ width: "100px" }}>{/* context menu */}</th>
                        <th>Barcode</th>
                        <th>Time</th>
                        <th style={{ width: "80px" }}>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.barcodes.map((barcode, index) =>
                        <UserScansRow
                            key={barcode.id}
                            index={index}
                            barcode={barcode}
                            user={this.props.user}
                            isAutoCopied={this.props.autoCopiedBarcode?.id === barcode.id}
                            router={this.props.router}
                            removeBarcodeFromState={
                                this.props.removeBarcodeFromState
                            }
                        />
                    )}
                </tbody>
            </Table>
        );
    }

}
