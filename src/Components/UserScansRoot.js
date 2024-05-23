import React from 'react';
import { Component } from "react";
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function UserScansRoot(props) {
    
    // https://reactrouter.com/en/main/start/faq#what-happened-to-withrouter-i-need-it
    
    let params = useParams();
    // let location = useLocation();
    // let navigate = useNavigate();
    
    return (
        <UserScansRootCore 
            {...props} 
            router={{params}}
        />
    );

};

class UserScansRootCore extends Component {

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
            "barcode": "https:\/\/amazon.com\/thisboxusqr",
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

    constructor(props) {
        super(props);
        this.state = {
            barcodes: UserScansRootCore.sampleBarcodes
            // barcodes: props.barcodes
            // context: props.context
        };
        this.user = props.router.params.user;
    }

    onClickBarcode = (barcode) => {
        return (e) => {
            console.log("Clicked barcode: " + barcode);
            navigator.clipboard.writeText(barcode);
        };
    };

    clearAllUserBarcodes = (e) => {
        console.log("Clearing all user barcodes");

        // Clear the barcodes
        this.setState({
            barcodes: []
        });

        // this.state.context.clearAllUserBarcodes();
        this.props.clearAllUserBarcodes();

        console.log("Cleared all user barcodes");
    };

    dateDifferenceFromNow(date) {

        const now = new Date();
        const then = new Date(date);  // date passed in
        const diffMS = now - then;
        let diffSecs = Math.floor(diffMS / 1_000);

        if (diffSecs <= 3) {
            return "Just now";
        }
        if (diffSecs > 86_400 /* more than 1 day old */) {
            return `More than one day ago`;
        }
        if (diffSecs <= 15 /* 3 - 15 seconds */) {
            return "Less than 15 seconds ago";
        }
        if (diffSecs <= 30 /* 15 - 30 seconds */) {
            return "Less than 30 seconds ago";
        }
        if (diffSecs <= 120 /* 30 seconds - 2 minutes */) {
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
        if (diffSecs > 7_200 /* > 2 hours */) {
            return "More than an hour ago";
        }

    }

    formattedDateString(date) {
        const dateObj = new Date(date);
        return dateObj.toLocaleTimeString();
    }

    render() {
        return (
            <div>

                <h1>Scanned Barcodes for {this.user}</h1>


                {/* Delete All */}

                <button
                    // className="" 
                    style={{ margin: "5px 10px" }}
                    onClick={this.clearAllUserBarcodes}
                >
                    Clear All Barcodes
                </button>

                {/* spacer */}

                {/* Table of Barcodes */}

                <table className="barcode-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Barcode</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.barcodes.map((barcode) =>
                            <tr key={barcode.id}>
                                <td style={{
                                    textAlign: "center",
                                    width: "100px"
                                }}>
                                    <button
                                        style={{ margin: "5px 10px" }}
                                        onClick={this.onClickBarcode(barcode.barcode)}
                                    >
                                        Copy
                                    </button>
                                </td>
                                <td>
                                    {barcode.barcode}
                                </td>
                                <td 
                                    data-toggle="tooltip" 
                                    data-placement="top"
                                    title={this.formattedDateString(barcode.date)}
                                >
                                    {this.dateDifferenceFromNow(barcode.date)}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

}
