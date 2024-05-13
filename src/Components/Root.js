import React from 'react';
import {Component} from "react";

export default class Root extends Component {

    static sampleBarcodes = [
        {"barcode": "052000104332", "date": "2024-05-12T16:14:37Z"}, 
        {"barcode": "052000104332", "date": "2024-05-12T16:14:35Z"}, 
        {"barcode": "12-58", "date": "2024-05-11T17:58:51Z"}, 
        {"barcode": "12-35", "date": "2024-05-11T17:36:05Z"}, 
        {"barcode": "yet another one", "date": "2024-05-11T03:33:27Z"}, 
        {"barcode": "curl2", "date": "2024-05-11T03:21:22Z"}, 
        {"barcode": "curl", "date": "2024-05-11T03:15:15Z"}
    ]

    constructor(props) {
        super(props);
        this.state = {
            barcodes: Root.sampleBarcodes
       };
   }

   barcodeButton = (barcode) => {   
       return (
           <button onClick={() => this.props.history.push(`/barcode/${barcode}`)}>
                {barcode}
           </button>
       );
    }

    onClickBarcode = (barcode) => {
        return (e) => {
            console.log("Clicked barcode: " + barcode);
            navigator.clipboard.writeText(barcode)
        }
    }

    render() {
        return (
            <div>
                <h1>Scanned Barcodes</h1>

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
