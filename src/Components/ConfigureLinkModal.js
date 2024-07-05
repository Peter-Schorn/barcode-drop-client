import React from 'react';
import { Component } from "react";

import { Button, Table } from 'react-bootstrap';

import Modal from "react-modal";

import Badge from 'react-bootstrap/Badge';

import { AppContext } from "../Model/AppContext";

import UserScansRow from "./UserScanRow";


export default class ConfigureLinkModal extends Component {

    // constructor(props) {
    //     super(props);

    // }

    exampleFormattedURL = () => {
        // return `https://example.com/scan?barcode=%s`;
        return `https://www.google.com/search?q=%s`;
    };

    render() {
        return (
            // const _ = (
            <Modal

                className={"configure-link-modal rounded-3 m-5 mx-auto p-5 w-50 shadow-lg text-black"}

                isOpen={this.props.showFormattedLinkModal}
                onAfterOpen={this.props.onOpenConfigureLinkModal}
                onRequestClose={this.props.closeConfigureLinkModal}

            // style={this.customStyles}
            // contentLabel="configure-link-modal"
            >

                <div
                    className="configure-link-modal-container f text-center"
                >
                    <h3 className="pb-3">
                        Configure Link
                    </h3>

                    <form
                        className="configure-link-form form-floating text-center"
                        onSubmit={this.onSubmitConfigureLinkForm}
                    >

                        <div
                            className="configure-link-form-text text-center mx-auto m-2 mb-4"
                        >
                            <p>
                                Enter a link to open. Replace the barcode with %s.
                            </p>
                            <p className="">
                                For example: <br />
                            </p>
                            <code className="">
                                {this.exampleFormattedURL()}
                            </code>
                        </div>

                        <div className="form-floating mb-3 mx-5 mx-auto">
                            <input
                                ref={this.configureLinkInputRef}
                                id="configure-link-input"
                                className="form-control"
                                type="text"
                                placeholder={this.exampleFormattedURL()}
                                value={this.props.formattedLink}
                                onChange={this.props.onChangeConfigureLinkInput}
                            />
                            {/* <label for="configure-link-input">
                                Link:
                            </label> */}
                            <label htmlFor="configure-link-input">
                                Link:
                            </label>
                        </div>
                        <div className="form-group pt-3">
                            <button
                                type="submit"
                                className="btn btn-primary shadow-lg"
                                onClick={this.props.onSubmitConfigureLinkForm}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        );
    }

}
