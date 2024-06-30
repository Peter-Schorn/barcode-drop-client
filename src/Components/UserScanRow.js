import React from "react";
import { Component } from "react";

import { AppContext } from "../Model/AppContext";

import { Button, Dropdown } from "react-bootstrap";

import Modal from "react-modal";

import bwipjs from "bwip-js";

export default class UserScansRow extends Component {

    constructor(props) {
        super(props);

        const dateDifference = this.dateDifferenceFromNow(
            this.props.barcode.date
        );

        this.customStyles = {
            content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
            },
        };

        this.canvasRef = React.createRef();

        this.state = {
            dateDifference: dateDifference,
            generateBarcodeModalIsOpen: false
        };

    }

    static contextType = AppContext;

    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            5_000
        );
        // this.drawBarcodeToCanvas();
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
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

    drawBarcodeToCanvas = () => {

        // const canvas = document.getElementById("barcode-image-canvas");
        const canvas = this.canvasRef.current;

        if (!canvas) {
            console.error(
                "Barcode canvas element not found"
            );
            return;
        }

        const barcodeText = this.props.barcode.barcode;

        // Cannot differentiate between UPC-E and EAN-8, so don't 
        // automatically use either

        let symbology;
        let is2DSymbology = false;

        if (/^[0-9]{12}$/.test(barcodeText)) {
            symbology = "upca";
        }
        else if (/^[0-9]{13}$/.test(barcodeText)) {
            symbology = "ean13";
        }
        else if (barcodeText.length <= 20) {
            symbology = "code128";
        }
        else {
            symbology = "datamatrix";
            is2DSymbology = true;
        }

        let options = {
            bcid: symbology,
            text: barcodeText,
            scale: 3,
            includetext: true,
            textxalign: "center",
            textsize: 13,
            textyoffset: 10,
            paddingwidth: 10,
            paddingheight: 10,
        };

        if (is2DSymbology) {
            const size = 30;
            options.width = size;
            options.height = size;
        }
        else {
            options.width = 60;
            options.height = 20;
        }

        bwipjs.toCanvas(canvas, options, (error, canvas) => {

            if (error) {
                console.error(
                    `Error drawing barcode "${barcodeText}" to canvas: ${error}`
                );
            }
            else {
                console.log(
                    `Barcode drawn to canvas: "${barcodeText}"`
                );
            }

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

            navigator.clipboard.writeText(barcodeText)
                .then(() => {
                    console.log(
                        `UserScansRow: Copied barcode to clipboard: ` +
                        `"${barcodeText}"`
                    );
                })
                .catch((error) => {
                    console.error(
                        `UserScansRow: Error copying barcode to clipboard: ` +
                        `"${barcodeText}": ${error}`
                    );
                });
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
                    style={{ fontSize: "12px" }}
                >
                    {` (${this.props.barcode.id})`}
                </span>
            );
        }
        else {
            return null;
        }

    }

    copyButtonStyle() {
        const isAutoCopied = this.props.isAutoCopied;
        return {
            margin: "5px 5px",
            // backgroundColor: "green"
            backgroundColor: isAutoCopied ? "green" : null,
            border: isAutoCopied ? "1px solid green" : null,
            transition: "all 0.5s ease-out"
        };
    }

    afterOpenGenerateBarcodeModal = () => {
        console.log(
            "Generate Barcode Modal is now open"
        );
        this.drawBarcodeToCanvas();
    };

    closeGenerateBarcodeModal = () => {
        this.setState({
            generateBarcodeModalIsOpen: false
        });
        console.log(
            "Generate Barcode Modal is now closed"
        );
    };

    didClickGenerateBarcode = (e) => {
        console.log(
            "Generate Barcode button was clicked:", e
        );
        this.setState({
            generateBarcodeModalIsOpen: true
        });
    };

    // MARK: - Components -

    renderBarcodeImageModal() {
        return (
            <Modal
                isOpen={this.state.generateBarcodeModalIsOpen}
                onAfterOpen={this.afterOpenGenerateBarcodeModal}
                onRequestClose={this.closeGenerateBarcodeModal}
                style={this.customStyles}
                contentLabel="Barcode"
            >
                <div
                    className="barcode-image-modal text-center"
                >
                    {/* <h3>{barcodeText}</h3> */}
                    <canvas
                        class="barcode-image-canvas"
                        ref={this.canvasRef}
                    >
                    </canvas>
                </div>
            </Modal>
        );
    }

    render() {
        return (
            <tr
                data-barcode-id={this.props.barcode.id}
                key={this.props.barcode.id}
                className={this.rowStyleClassName()}
            >
                {/* Copy Button */}
                <td style={{
                    textAlign: "center",
                }}>
                    <Button
                        className="copy-button"
                        style={this.copyButtonStyle()}
                        onClick={this.onClickCopyButton(
                            this.props.barcode
                        )}
                    >
                        Copy
                        {/* <i class="fa-solid fa-copy"></i> */}
                    </Button>
                </td>
                {/* Context Menu */}
                <td
                    style={{
                        textAlign: "center",
                    }}
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Show context menu"
                >
                    <Dropdown>
                        <Dropdown.Toggle variant="success">
                            <i className="fa fa-ellipsis-v px-2"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.didClickGenerateBarcode} >
                                Generate Barcode
                            </Dropdown.Item>
                            {/* <Dropdown.Item >Something else</Dropdown.Item> */}
                        </Dropdown.Menu>
                    </Dropdown>
                    {/* Barcode Image Modal */}
                    {this.renderBarcodeImageModal()}
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
