import React from 'react';
import { Component } from "react";
import { useParams, useSearchParams } from 'react-router-dom';

import { AppContext } from "../Model/AppContext";

import { Button, Table, Container } from 'react-bootstrap';

import UserScansRow from "./UserScanRow";
import MainNavbar from "./MainNavbar";
// import UserScansTable from "./UserScansTable";
import { setIntervalImmediately } from "../Utilities";
import { SocketMessageTypes } from "../Model/SocketMessageTypes";

import { WebSocket } from "partysocket";

export default function UserScansRoot(props) {

    // https://reactrouter.com/en/main/start/faq#what-happened-to-withrouter-i-need-it

    let params = useParams();
    let [searchParams, setSearchParams] = useSearchParams();
    // let location = useLocation();
    // let navigate = useNavigate();

    return (
        <UserScansRootCore
            {...props}
            router={{
                params: params,
                searchParams: searchParams,
                setSearchParams: setSearchParams
            }}
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
            barcodes: [],
            deleteIDs: [],
            pingPongInterval: null,
            lastPongDate: null
            // autoCopy: false
            // barcodes: UserScansRootCore.sampleBarcodes
            // barcodes: props.barcodes
            // context: props.context
        };

        this.pollingID = null;


        this.user = props.router.params.user;

        if (this.user) {
            console.log(
                `UserScansRootCore.constructor(): user: ${this.user}`
            );
        }
        else {
            console.error(
                `UserScansRootCore.constructor(): invalid user: ${this.user}`
            );
        }

        // MARK: - WebSockets -

        const socketURL = new URL(process.env.REACT_APP_BACKEND_URL);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
            socketURL.protocol = "ws";
        }
        else {
            socketURL.protocol = "wss";
        }

        this.socketURL = socketURL;

        this.socketURL.pathname = `/watch/${this.user}`;

        this.socket = React.createRef();

        console.log(
            `UserScansRootCore.constructor(): socketURL: ${this.socketURL}`
        );

    }

    componentWillUnmount() {
        console.log("UserScansRootCore.componentWillUnmount():");

        // this.socket.close();
        clearInterval(this.pollingID);
    }

    componentDidMount() {

        console.log("UserScansRootCore.componentDidMount():");

        // console.log(
        //     `REACT_APP_DISABLE_POLLING: ` +
        //     `${process.env.REACT_APP_DISABLE_POLLING}`
        // );
        //
        // if (process.env.REACT_APP_DISABLE_POLLING !== "true") {
        //     console.log("Polling is enabled");
        //     this.beginPolling();
        // }
        // else {
        //     console.log("Polling is disabled");
        this.getUserScans({ user: this.user });
        // }
        //

        // MARK: Configure WebSocket
        this.configureSocket();

    }

    configureSocket = () => {

        /*
         https://www.npmjs.com/package/partysocket#available-options

         For each reconnection attempt, the delay is calculated as follows:

            delay = minReconnectionDelay *  
                Math.pow(reconnectionDelayGrowFactor, this._retryCount - 1);

            if (delay > maxReconnectionDelay) {
                delay = maxReconnectionDelay;
            }
         
         The first reconnection attempt will have a delay of 
         minReconnectionDelay, the second will have a delay of 
         minReconnectionDelay * reconnectionDelayGrowFactor, and the max
         delay will be maxReconnectionDelay.

         https://www.desmos.com/calculator/cv5yene4jw
            
         */
        const wsOptions = {
            minReconnectionDelay: 500,  // half a second
            maxReconnectionDelay: 10_000,  // 10 seconds
            debug: true
        };

        this.socket.current = new WebSocket(
            this.socketURL.href,
            [],
            wsOptions
        );

        this.socket.current.onopen = (event) => {

            console.log(
                `[${Date()}] socket.onopen(): event:`, event
            );

            this.getUserScans({ user: this.user });

            // this.setState((state) => {

            //     const pingPongInterval = this.configurePingPongInterval(state);

            //     return {
            //         pingPongInterval: pingPongInterval,
            //         // connecting to the websocket is equivalent to receiving
            //         // a pong from the client
            //         lastPongDate: new Date()
            //     };

            // });

        };

        this.socket.current.onmessage = (event) => {
            this.receiveSocketMessage(event);
        };

        this.socket.current.onclose = (event) => {

            console.log(
                `[${Date()}] socket.onclose(): event:`, event
            );

            this.setState((state) => {
                clearInterval(state.pingPongInterval);
                return {
                    pingPongInterval: null,
                    lastPongDate: null
                };
            });

        };

        document.addEventListener("visibilitychange", () => {
            console.log(
                `visibilitychange: document.hidden: ${document.hidden}`
            );
            if (document.hidden) {
                // console.log("visibilitychange: Clearing polling interval");
                // clearInterval(this.pollingID);
            }
            else {
                // console.log("visibilitychange: calling beginPolling()");
                // this.beginPolling();
                console.log(
                    "visibilitychange: will reconnect to websocket if needed"
                );
                if (this.socket.current.readyState === WebSocket.CLOSED) {
                    console.log(
                        `visibilitychange: re-connecting to WebSocket ` +
                        `(readyState: ${this.socket.current.readyState})`
                    );
                    this.socket.current.reconnect();
                }
                else {
                    console.log(
                        `visibilitychange: WebSocket is already ` +
                        `connected/connecting ` +
                        `(readyState: ${this.socket.current.readyState})`
                    );
                }
            }
        });

        // this.socket.current.onopen = (event) => {
        // console.log(
        //     `[${Date()}] socket.onopen(): event:`, event
        // );
        // this.getUserScans({user: this.user});
        // }

        // this.socket.current.onclose = (event) => {
        //     console.log(
        //         `[${Date()}] socket.onclose(): event:`, event
        //     );
        //     console.log(
        //         `[${Date()}] Attempting to re-connect to WebSocket...`
        //     );
        //     setTimeout(() => {
        //         this.configureSocket();
        //         this.getUserScans({user: this.user});
        //     }, 500);
        // };

        // this.socket.current.onerror = (event) => {
        //     console.error(
        //         `[${Date()}] socket.onerror(): event:`, event
        //     );
        // }

    };

    configurePingPongInterval = (state) => {

        if (state?.pingPongInterval) {
            clearInterval(state.pingPongInterval);
        }

        const pingPongInterval = setInterval(() => {

            console.log(
                `[${new Date()}] ` +
                `Sending ping to WebSocket server`
            );

            this.socket.current.send("ping");

            const lastPongDate = state.lastPongDate;
            let diffMS;

            if (lastPongDate) {
                const now = new Date();
                diffMS = now - lastPongDate;
            }
            else {
                // lastPongDate is `null`, so the server has not responded to
                // *ANY* pings
                diffMS = null;
            }

            if (diffMS === null || diffMS > 10_000) {
                // The server has *NOT* responded to a ping within the last 10
                // seconds. The effective tolerance is 10-15 seconds because
                // this function is only called every 5 seconds.
                console.error(
                    `[${new Date()}] ` +
                    `server has *NOT* responded to a ping in over 10 seconds ` +
                    `(diffMS: ${diffMS}; lastPongDate: ${lastPongDate}); ` +
                    `trying to RECONNECT...`
                );
                this.socket.current.reconnect();
            }
            else {
                console.log(
                    `[${new Date()}] ` +
                    `server *HAS* responded to a ping within the last 10 ` +
                    `seconds (diffMS: ${diffMS}; lastPongDate: ${lastPongDate})`
                );
            }

        }, 5_000);

        return pingPongInterval;

    };

    handlePong = (event) => {
        console.log(
            `[${Date()}] UserScansRootCore.handlePong(): event:`, event
        );
        this.setState({
            lastPongDate: new Date()
        });
    };

    receiveSocketMessage = (event) => {

        console.log(
            `[${Date()}] UserScansRootCore.receiveSocketMessage(): ` +
            `event:`, event
        );

        if (event.data === "pong") {
            this.handlePong(event);
            return;
        }

        const message = JSON.parse(event.data);

        // MARK: Insert new scan
        if (
            message?.type === SocketMessageTypes.upsertScan &&
            message?.newScan
        ) {
            const newScan = message.newScan;
            console.log(
                `socket will insert newScan for user ${this.user}:`,
                newScan
            );
            this.setState(state => {
                // MARK: insert the new scan in sorted order by date
                // and remove any existing scan with the same ID
                const newBarcodes = state.barcodes
                    .filter((barcode) => barcode.id !== newScan.id)
                    .concat(newScan)
                    .toSorted((lhs, rhs) => {
                        return new Date(rhs.date) - new Date(lhs.date);
                    });

                return {
                    barcodes: newBarcodes
                };

            });
        }
        // MARK: Delete scan
        else if (
            message?.type === SocketMessageTypes.deleteScan &&
            message?.id
        ) {
            const id = message.id;
            console.log(
                `socket will delete barcode with ID: ${id}`
            );
            this.removeBarcodeFromState(id);

        }

    };

    beginPolling = () => {
        console.log("UserScansRootCore.beginPolling():");
        // MARK: IMPORTANT: CLEAR any previously created polling intervals 
        // MARK: before creating a new one
        // otherwise, multiple polling intervals will be created and execute
        // concurrently
        if (this.pollingID) {
            console.log("Clearing previous polling interval");
            clearInterval(this.pollingID);
        }
        this.pollingID = setIntervalImmediately(() => {
            this.getUserScans({ user: this.user });
        }, 2_000);
    };

    // autoCopyIfEnabled = () => {
    //     if (this.state.autoCopy) {
    //         console.log("Auto-copying most recent barcode");
    //         const mostRecentBarcode = this.state.barcodes[0];
    //         const barcodeText = mostRecentBarcode.barcode;
    //         navigator.clipboard.writeText(barcodeText);
    //         console.log(
    //             `AUTO-Copied barcode to clipboard: "${barcodeText}"`
    //         );
    //     }
    //     else {
    //         console.log("Auto-copy is disabled; not copying latest barcode");
    //     }
    // }

    /** Get the user's scans */
    getUserScans = ({ user }) => {

        let date = Date().toString();

        console.log(
            `UserScansRootCore.getUserScans(): Getting scans for ` +
            `user: ${user} at date: ${date}`
        );

        this.context.api.getUserScans(this.user).then((result) => {

            const jsonString = JSON.stringify(result);

            console.log(
                `UserScansRootCore.getUserScans(): result: ${jsonString}`
            );

            this.setState({
                barcodes: result
            });

            // console.log(
            //     "UserScansRootCore.getUserScans(): " +
            //     "calling autoCopyIfEnabled()"
            // );

            // this.autoCopyIfEnabled();

        })
        .catch((error) => {
            console.error(
                `UserScansRootCore.componentDidMount(): error: ${error}`
            );
        });

    };

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

    removeBarcodeFromState = (barcodeID) => {
        console.log(`Removing barcode with ID from state: ${barcodeID}`);

        // this.setState((state) => {
        //     return {
        //         deleteIDs: [...state.deleteIDs, barcodeID]
        //     }
        // });

        this.setState((state) => {
            const newBarcodes = state.barcodes.filter(
                (barcode) => barcode.id !== barcodeID
            );

            return {
                barcodes: newBarcodes
            };
        });

    };


    render() {
        return (
            <div className="vw-100 vh-100">
                <MainNavbar />
                <Container fluid="md" style={{
                    maxWidth: "1000px"
                    // maxWidth: "300px"
                    // maxWidth: "vw-100"
                }}>

                    <h2 style={{ margin: "30px 10px 10px 0px" }}>
                        <strong className="scans-for-user-text">
                            Scanned Barcodes for <em style={{ color: "gray" }}>{this.user}</em>
                        </strong>
                    </h2>


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

                    <Table 
                        className="barcode-table border-dark" 
                        striped bordered hover
                        style={{maxWidth: "100%"}}
                    >
                        <thead>
                            <tr>
                                <th style={{ width: "60px" }}>{/* copy button */}</th>
                                <th>Barcode</th>
                                <th>Time</th>
                                <th style={{ width: "80px" }}>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.barcodes.map((barcode, index) =>
                                <UserScansRow
                                    key={barcode.id}
                                    index={index}
                                    barcode={barcode}
                                    user={this.user}
                                    router={this.props.router}
                                    removeBarcodeFromState={
                                        this.removeBarcodeFromState
                                    }
                                />
                            )}
                        </tbody>
                    </Table>

                    {/* <UserScansTable
                        barcodes={this.state.barcodes}
                        router
                        removeBarcodeFromState={
                            this.removeBarcodeFromState
                        }
                    /> */}

                </Container>
            </div>
        );
    }

}
