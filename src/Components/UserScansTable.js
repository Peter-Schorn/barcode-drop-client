import React from 'react';
import { Component } from "react";
import { useParams } from 'react-router-dom';

import { AppContext } from "../Model/AppContext";

import { Button, Table } from 'react-bootstrap';

import UserScansRow from "./UserScanRow";

import Badge from 'react-bootstrap/Badge';

export default function UserScansTable(props) {

    // https://reactrouter.com/en/main/start/faq#what-happened-to-withrouter-i-need-it

    let params = useParams();
    // let location = useLocation();
    // let navigate = useNavigate();

    return (
        <UserScansTableCore
            {...props}
            router={{ params }}
        />
    );

};

class UserScansTableCore extends Component {

    static sampleBarcodes = [
        {
            "barcode": "SQk05WLwrc_001_v",
            "date": "2024-05-23T22:00:11Z",
            "id": "664f94cf7f5e45f823e032d3",
            "user": "schornpe"
        },
        {
            "barcode": "J2L",
            "date": "2024-05-23T22:09:11Z",
            "id": "664f94cd8012fd3b4cff1318",
            "user": "schornpe"
        },
        {
            "barcode": "https://amazon.com/thisboxusqr",
            "date": "2024-05-23T21:45:41Z",
            "id": "664f9475a31dbee57cf438d1",
            "user": "schornpe"
        },
        {
            "barcode": "J2L",
            "date": "2024-05-23T21:09:41Z",
            "id": "664f94cbdb1ad752e1b5db57",
            "user": "schornpe"
        },
        {
            "barcode": "SQk05WLwrc_001_v",
            "date": "2024-05-23T19:09:40Z",
            "id": "664f9474331bae0a7c6699ad",
            "user": "schornpe"
        },
        {
            "barcode": "LPNRRFN8843140",
            "date": "2024-05-23T16:15:46Z",
            "id": "664f6bb27d769648dd846219",
            "user": "schornpe"
        },
        {
            "barcode": "LPNRRFN8843140",
            "date": "2024-05-23T16:15:40Z",
            "id": "664f6bacafe43456cae7c039",
            "user": "schornpe"
        },
        {
            "barcode": "LPNRRFN8843140",
            "date": "2024-05-23T16:15:20Z",
            "id": "664f6b981b2f8ef108097e5c",
            "user": "schornpe"
        },
        {
            "barcode": "X003DQ1B4N",
            "date": "2024-05-23T14:23:17Z",
            "id": "664f515596236013184465eb",
            "user": "schornpe"
        },
        {
            "barcode": "X003DQ1B4N",
            "date": "2024-05-23T14:23:13Z",
            "id": "664f5151af96bc3c9e7e5a3d",
            "user": "schornpe"
        },
        {
            "barcode": "X002WB6F1T",
            "date": "2024-05-23T14:22:49Z",
            "id": "664f51396992afc3db9611f6",
            "user": "schornpe"
        },
        {
            "barcode": "X003DQ1B4N",
            "date": "2024-05-23T14:22:47Z",
            "id": "664f51374242e94e92d74fb4",
            "user": "schornpe"
        },
        {
            "barcode": "LPNRRFN8843140",
            "date": "2024-05-23T14:22:39Z",
            "id": "664f512fd33b3afcf23bde69",
            "user": "schornpe"
        },
        {
            "barcode": "305212750003",
            "date": "2024-05-23T14:22:10Z",
            "id": "664f5112ec69813c6ab12daf",
            "user": "schornpe"
        }
    ];

    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            barcodes: []
            // barcodes: UserScansTableCore.sampleBarcodes
            // barcodes: props.barcodes
            // context: props.context
        };
        this.user = props.router.params.user;
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
        this.context.api.getUserScans(this.user)
            .then((result) => {
                console.log(
                    `UserScansTableCore.componentDidMount(): result: ${result}`
                );
                this.setState({
                    barcodes: result
                });
            })
            .catch((error) => {
                console.error(
                    `UserScansTableCore.componentDidMount(): error: ${error}`
                );
            });
    }

    clearAllUserBarcodes = (e) => {
        console.log("Clearing all user barcodes");

        // Clear the barcodes
        this.setState({
            barcodes: []
        });

        this.context.api.deleteUserScans({
            user: this.user
        });

        console.log("Cleared all user barcodes");
    };

    makeRemoveBarcodeFromState = (barcodeID) => {
        return (e) => {
            console.log(`Removing barcode with ID: ${barcodeID}`);
            const newBarcodes = this.state.barcodes.filter(
                (barcode) => barcode.id !== barcodeID
            );
            this.setState({
                barcodes: newBarcodes
            });
        };
    }


    render() {
        return (
            <div>

                <h1><strong>Scanned Barcodes for {this.user}</strong></h1>


                {/* Delete All */}

                <Button
                    variant="danger"
                    style={{ margin: "15px 0px" }}
                    onClick={this.clearAllUserBarcodes}
                >
                    Delete All Barcodes
                </Button>

                {/* spacer */}

                {/* Table of Barcodes */}

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
                        {this.state.barcodes.map((barcode) =>
                            <UserScansRow 
                                barcode={barcode} 
                                user={this.user}
                                removeBarcodeFromState={
                                    this.makeRemoveBarcodeFromState(barcode.id)
                                }
                            />
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }

}
