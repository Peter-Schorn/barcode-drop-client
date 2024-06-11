import React from 'react';
import { Component } from "react";

import { AppContext } from "../Model/AppContext";

import { Button } from 'react-bootstrap';


export default class UserScansRow extends Component {

    constructor(props) {
        super(props);

        const dateDifference = this.dateDifferenceFromNow(
            this.props.barcode.date
        );

        this.state = {
            dateDifference: dateDifference
        };

    }

    static contextType = AppContext;

    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            5_000
        );
    }

    tick = () => {
        this.updateDateDifference();
    };

    updateDateDifference = () => {
        const dateDifference = this.dateDifferenceFromNow(
            this.props.barcode.date
        );
        this.setState({
            dateDifference: dateDifference
        });
    };

    rowStyleClassName = () => {
        // TODO: figure out why table variants cover borders
        // return this.props.index === 0 ? "table-success" : "";
        return "";
    };

    dateDifferenceFromNow(date) {

        const now = new Date();
        const then = new Date(date);  // date passed in
        const diffMS = now - then;
        let diffSecs = Math.floor(diffMS / 1_000);

        if (diffSecs <= 3) {
            return "Just now";
        }
        if (diffSecs <= 10 /* 3 - 10 seconds */) {
            return "About 5 seconds ago";
        }
        if (diffSecs <= 20 /* 10 - 20 seconds */) {
            return "About 15 seconds ago";
        }
        if (diffSecs <= 45 /* 20 - 45 seconds */) {
            return "About 30 seconds ago";
        }
        if (diffSecs <= 120 /* 45 seconds - 2 minutes */) {
            return "About a minute ago";
        }
        if (diffSecs <= 300 /* 2 - 5 minutes */) {
            return "A few minutes ago";
        }
        if (diffSecs <= 600 /* 5 - 10 minutes */) {
            return "About 5 minutes ago";
        }
        if (diffSecs <= 900 /* 10 - 15 minutes */) {
            return "About 10 minutes ago";
        }
        if (diffSecs <= 1_800 /* 15 - 30 minutes */) {
            return "About 15 minutes ago";
        }
        if (diffSecs <= 3_600 /* 30 minutes - 1 hour */) {
            return "About 30 minutes ago";
        }
        if (diffSecs <= 7_200 /* 1 - 2 hours */) {
            return "About an hour ago";
        }
        if (diffSecs > 7_200 /* 2 - 4 hours */) {
            return "About two hours ago";
        }
        if (diffSecs > 14_400 /* 4 - 6 hours */) {
            return "About four hours ago";
        }
        if (diffSecs > 21_600 /* 6 - 24 hours */) {
            return "More than six hours ago";
        }
        if (diffSecs > 86_400 /* more than 1 day old */) {
            return `More than one day ago`;
        }

    }

    onClickCopyButton = (barcode) => {
        return (e) => {
            const barcodeText = barcode.barcode;
            navigator.clipboard.writeText(barcodeText);
            console.log(`Copied barcode to clipboard: "${barcodeText}"`);
        };
    };

    onClickDeleteButton = (barcode) => {
        return (e) => {

            console.log(`Deleting barcode: "${barcode}"`);
            const barcodeID = barcode.id;

            this.props.removeBarcodeFromState(barcodeID);
            
            this.context.api.deleteScans([barcodeID])
                .then((result) => {
                    console.log(
                        `Delete barcode "${barcode}" result: ${result}`
                    );
                })
                .catch((error) => {
                    console.error(
                        `Error deleting barcode: "${barcode}": ${error}`
                    );
                });
        };
    };

    formattedDateString(date) {
        const dateObj = new Date(date);
        return dateObj.toLocaleTimeString();
    }

    barcodeIDdebugText() {
        const queryParams = this.props.router.searchParams;

        if (queryParams.get("debug") === "true") {
            return (
                <span
                    className="text-secondary" 
                    style={{fontSize: "12px"}}
                >
                    {" "}({this.props.barcode.id})
                </span>
            );
        }
        else {
            return null;
        }
        
    }

    render() {
        return (
            <tr
                data-barcode-id={this.props.barcode.id}
                key={this.props.barcode.id}
                className={this.rowStyleClassName()}
            >
                <td style={{
                    textAlign: "center",
                }}>
                    <Button
                        className="copy-button"
                        style={{ margin: "5px 5px" }}
                        onClick={this.onClickCopyButton(
                            this.props.barcode
                        )}
                    >
                        Copy
                    </Button>
                </td>
                {/* Barcode Cell */}
                <td>
                    <span className="barcode-text">
                    {this.props.barcode.barcode}
                    </span>
                    {/* BARCODE ID */}
                    {this.barcodeIDdebugText()}

                </td>

                <td
                    data-toggle="tooltip"
                    data-placement="top"
                    title={this.formattedDateString(this.props.barcode.date)}
                >
                    {this.state.dateDifference}
                </td>
                <td
                    style={{
                        textAlign: "center",
                    }}
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Delete this barcode"
                >
                    <Button
                        style={{
                            margin: "5px 5px",
                        }}
                        onClick={this.onClickDeleteButton(
                            this.props.barcode
                        )}
                    >
                        <i className="fa fa-trash"></i>
                    </Button>
                </td>
            </tr>
        );
    }

}
