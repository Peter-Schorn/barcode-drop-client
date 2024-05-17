import React from 'react';
import {Component} from "react";

export default class Root extends Component {

    static sampleBarcodes = [
        {"barcode": "052000104332", "date": "2024-05-12T16:14:37Z", "id": "adfgjkfhaskjfhasjk"}, 
        {"barcode": "052000104332", "date": "2024-05-12T16:14:35Z", "id": "dfadsfhfsghsd"}, 
        {"barcode": "12-58", "date": "2024-05-11T17:58:51Z", "id": "eirxvasdfadfsga"}, 
        {"barcode": "12-35", "date": "2024-05-11T17:36:05Z", "id": "owudnebrrasrtasd"}, 
        {"barcode": "yet another one", "date": "2024-05-11T03:33:27Z", "id": "liowmrnjcueopte"}, 
        {"barcode": "curl2", "date": "2024-05-11T03:21:22Z", "id": "cfieijmohoioegg"}, 
        {"barcode": "curl", "date": "2024-05-11T03:15:15Z", "id": "jewurudkeypgmqgal"}
    ]

    constructor(props) {
        super(props);
        this.state = {
            // barcodes: Root.sampleBarcodes
            barcodes: props.barcodes
            // context: props.context
       };
   }

    onClickBarcode = (barcode) => {
        return (e) => {
            console.log("Clicked barcode: " + barcode);
            navigator.clipboard.writeText(barcode)
        }
    }

    clearAllUserBarcodes = (e) => {
        console.log("Clearing all user barcodes");

        // Clear the barcodes
        this.setState({
            barcodes: []
        });

        // this.state.context.clearAllUserBarcodes();
        this.props.clearAllUserBarcodes();

        console.log("Cleared all user barcodes");
    }

    render() {
        return (
            <div>
                <h1>Scanned Barcodes</h1>

                {/* Delete All */}

                <button 
                    // className="" 
                    style={{margin: "5px 10px"}} 
                    onClick={this.clearAllUserBarcodes}
                >
                    Clear All Barcodes
                </button>

                <table className="barcode-table">
                    <thead>
                        <tr>
                            <th>Barcode</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.barcodes.map((barcode) => 
                            <tr key={barcode.date}>
                                <td>
                                <button 
                                    style={{margin: "5px 10px"}} 
                                    onClick={this.onClickBarcode(barcode.barcode)}
                                >
                                    Copy
                                </button>
                                    {barcode.barcode}
                                </td>
                                <td>
                                    {barcode.date}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
   }

}
