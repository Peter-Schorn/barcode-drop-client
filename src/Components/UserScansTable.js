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
            // router={{ params }}
            router={props.router}
        />
    );

};

class UserScansTableCore extends Component {

    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.user = props.router.params.user;
        this.barcodes = props.barcodes;
        this.removeBarcodeFromState = props.removeBarcodeFromState;
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
        console.log(`context.api: ${this.context.api}`);
    }


    render() {
        return (
            <Table className="barcode-table border-dark" striped bordered hover>
                <thead>
                    <tr>
                        <th style={{width: "60px"}}>{/* copy button */}</th>
                        <th>Barcode</th>
                        <th>Time</th>
                        <th style={{width: "80px"}}>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {this.barcodes.map((barcode) =>
                        <UserScansRow
                            key={barcode.id} 
                            barcode={barcode} 
                            user={this.user}
                            removeBarcodeFromState={
                                this.removeBarcodeFromState
                            }
                        />
                    )}
                </tbody>
            </Table>
        );
    }

}
