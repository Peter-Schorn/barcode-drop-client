import React from 'react';
import { Component } from "react";
import { useParams, useSearchParams } from 'react-router-dom';

import { AppContext } from "../Model/AppContext";

import { Button, Table, Container } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';

import UserScansRow from "./UserScanRow";
import MainNavbar from "./MainNavbar";
// import UserScansTable from "./UserScansTable";
import { isApplePlatform, setIntervalImmediately } from "../MiscellaneousUtilities";
import { SocketMessageTypes } from "../Model/SocketMessageTypes";

import { WebSocket } from "partysocket";

import toast, { Toaster, ToastBar } from 'react-hot-toast';

import UserScansTable from "./UserScansTable";

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

        // MARK: - URL Fragment Parameters -
        // the parameters in the URL fragment; e.g.: `auto-copy=true` in
        // https://www.barcodedrop.com/scans/schornpe#auto-copy=true
        const urlFragmentParams = new URLSearchParams(
            window.location.hash.slice(1)
        );

        const enableAutoCopy = urlFragmentParams.get("auto-copy") === "true";
        console.log(
            `UserScansRootCore.constructor(): enableAutoCopy: ${enableAutoCopy}`
        );

        this.state = {
            barcodes: [],
            // barcodes: UserScansRootCore.sampleBarcodes,
            enableAutoCopy: enableAutoCopy,
            autoCopiedBarcode: null,
            // showToast: false
        };

        this.deleteIDs = new Set();
        this.pingPongInterval = null;
        this.lastPongDate = null;
        this.removeAutoCopiedBarcodeTimer = null;
        this.pollingID = null;
        this.copyBarcodeAfterDelayTimeout = null;
        this.user = props.router.params.user;
        this.lastAutoCopiedBarcode = null;

        // MARK: Document Title
        document.title = `Scans for ${this.user} | BarcodeDrop`;

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
        if (process.env?.NODE_ENV === "development") {
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

        clearInterval(this.pollingID);
        clearInterval(this.pingPongInterval);
        clearTimeout(this.removeAutoCopiedBarcodeTimer);
        clearTimeout(this.copyBarcodeAfterDelayTimeout);
        
        document.removeEventListener("hashchange", this.handleHashChange);
        document.removeEventListener("focusin", this.handleFocusIn);
        document.removeEventListener("focusout", this.handleFocusOut);
        document.removeEventListener("visibilitychange", this.handleVisibilityChange);
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    componentDidMount() {

        console.log("UserScansRootCore.componentDidMount():");

        this.getUserScans({ user: this.user });

        // MARK: Configure event listeners

        document.addEventListener("hashchange", this.handleHashChange);
        document.addEventListener("focusin", this.handleFocusIn);
        document.addEventListener("focusout", this.handleFocusOut);
        document.addEventListener("visibilitychange", this.handleVisibilityChange);
        document.addEventListener("keydown", this.handleKeyDown);
        
        // MARK: Configure WebSocket
        this.configureSocket();

        // MARK: Prompt for clipboard permissions
        console.log("componentDidMount(): Prompting for clipboard permissions");
        this.promptForClipboardPermission()
            .then(() => {
                console.log(
                    "componentDidMount(): Clipboard permissions granted"
                );
            })
            .catch((error) => {
                console.error(
                    `componentDidMount(): Clipboard permissions denied: ${error}`
                );
            });

        // can be called from the developer console
        document.scan = (barcode) => {
            console.log(`document.scan(): barcode: "${barcode}"`);
            this.context.api.scanBarcode({
                user: this.user,
                barcode: barcode
            })
            .then((result) => {
                console.log(
                    `document.scan(): scanBarcode result ` +
                    `(user: ${this.user}): ${result}`
                );
            })
            .catch((error) => {
                console.error(
                    `document.scan(): could not scan barcode "${barcode}" ` +
                    `for user ${this.user}: ${error}`
                );
            });
        };

        // can be called from the developer console
        document.getUserScans = () => {
            this.getUserScans({ user: this.user });
        }

    }

    componentDidUpdate(prevProps, prevState) {
        console.log("UserScansRootCore.componentDidUpdate():");

        const previousBarcode = prevState.barcodes[0];
        const currentBarcode = this.state.barcodes[0];
        
        if (this.latestBarcodeChanged(previousBarcode, currentBarcode)) {
            this.autoCopyIfEnabled();
        }

    };

    handleHashChange = (e) => {
        console.log(
            `UserScansRootCore.handleHashChange(): ` +
            `hash: ${window.location.hash}`
        );
        const urlFragmentParams = new URLSearchParams(
            window.location.hash.slice(1)
        );
        const enableAutoCopy = urlFragmentParams.get("auto-copy") === "true";
        console.log(
            `UserScansRootCore.handleHashChange(): ` +
            `enableAutoCopy: ${enableAutoCopy}`
        );
        this.setState({
            enableAutoCopy: enableAutoCopy
        });

    };

    promptForClipboardPermission = () => {
        console.log("promptForClipboardPermission");
        return navigator.permissions.query({ name: "clipboard-write" }).then(result => {
            if (result.state === "granted" || result.state === "prompt") {
                console.log(
                    `Clipboard permissions granted: ${result.state}`
                );
            }
            else {
                console.error(
                    `Clipboard permissions denied: ${result.state}`
                );
            }
            throw new Error("Clipboard permissions denied");
        });
    };

    handleKeyDown = (e) => {

        // console.log(
        //     `UserScansRootCore.handleKeyDown(): key: ${e.key}; code: ${e.code}; ` +
        //     `ctrlKey: ${e.ctrlKey}; metaKey: ${e.metaKey}; ` +
        //     `altKey: ${e.altKey}; shiftKey: ${e.shiftKey}`
        // );

        // if the user is holding down a key, then events will repeatedly be
        // generated; we only want to handle the first event
        if (e.repeat) {
            return;
        }

        if (e.isPlatformModifierKey()) {

            if (e.key === "k" && !e.shiftKey && !e.altKey) {
                console.log(
                    `UserScansRootCore.handleKeyDown(): ` +
                    `Platform modifier key + "k" pressed: copying barcode`
                );
                const latestBarcode = this.state.barcodes[0]?.barcode;
                if (latestBarcode != null) {
                    this.copyBarcodeToClipboard(latestBarcode, {
                        showNotification: true
                    });
                    e.preventDefault();
                }
                else {
                    console.log(
                        `UserScansRootCore.handleKeyDown(): ` +
                        `latest barcode is null or undefined`
                    );
                }
            }
            else if (e.key === "d" && !e.shiftKey && !e.altKey) {
                console.log(
                    `UserScansRootCore.handleKeyDown(): ` +
                    `Platform modifier key + "d" pressed: DELETING all barcodes`
                );
                this.deleteAllUserBarcodes(e);
                e.preventDefault();
            }
        }

    };

    handleFocusOut = (e) => {
        console.log(
            `focusout: document does NOT have focus; ` +
            `visibility: ${document.visibilityState}`
        );
    };

    handleFocusIn = (e) => {
        console.log(
            `focusin: document has focus; ` +
            `visibility: ${document.visibilityState}`
        );
    };

    handleVisibilityChange = (e) => {
        
        console.log(
            `visibilitychange: document.hidden: ${document.hidden}; ` +
            `focused: ${document.hasFocus()}`
        );
        
        console.log(
            `visibilitychange: document.hidden: ${document.hidden}; ` +
            `focused: ${document.hasFocus()}`
        );

        if (!document.hidden) {
            console.log(
                "visibilitychange: will reconnect to websocket if needed"
            );
            if (this.socket?.current?.readyState === WebSocket.CLOSED) {
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
                    `(readyState: ${this.socket?.current?.readyState})`
                );
            }
        }        

    }

    configureSocket = () => {

        if (process.env.REACT_APP_DISABLE_WEBSOCKET === "true") {
            return;
        }

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
                `[${new Date().toISOString()}] socket.onopen(): event:`, event
            );

            this.getUserScans({ user: this.user });
            this.configurePingPongInterval();
            this.lastPongDate = new Date();

        };

        this.socket.current.onmessage = (event) => {
            this.receiveSocketMessage(event);
        };

        this.socket.current.onclose = (event) => {

            console.log(
                `[${new Date().toISOString()}] socket.onclose(): event:`,
                event
            );

            clearInterval(this.pingPongInterval);
            this.lastPongDate = null;

        };

        this.socket.current.onerror = (event) => {

            console.error(
                `[${new Date().toISOString()}] socket.onerror(): event:`, event
            );

            clearInterval(this.pingPongInterval);
            this.lastPongDate = null;

        };

    };

    configurePingPongInterval = () => {

        if (this.pingPongInterval) {
            clearInterval(this.pingPongInterval);
        }

        this.pingPongInterval = setInterval(() => {

            console.log(
                `[${new Date().toISOString()}] ` +
                `Sending ping to WebSocket server`
            );

            // MARK: - Send a ping to the server -
            this.socket.current.send("ping");

            console.log(
                `[${new Date().toISOString()}] configurePingPongInterval: ` +
                `calling checkWebSocketConnection()`
            );
            this.checkWebSocketConnection();

        }, 5_000);

    };

    checkWebSocketConnection = () => {

        console.log(
            `[${new Date().toISOString()}] ` +
            `UserScansRootCore.checkWebSocketConnection():`
        );

        const now = new Date();
        const nowString = now.toISOString();

        const lastPongDate = this.lastPongDate;
        const lastPongDateString = lastPongDate?.toISOString();

        let diffMS;

        if (lastPongDate) {
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
                `[${nowString}] ` +
                `server has *NOT* responded to a ping in over 10 seconds ` +
                `(diffMS: ${diffMS}; lastPongDate: ${lastPongDateString}); ` +
                `TRYING TO RECONNECT...`
            );
            // MARK: - Attempt to reconnect the WebSocket -
            this.socket.current.reconnect();
        }
        else {
            console.log(
                `[${nowString}] ` +
                `server *HAS* responded to a ping within the last 10 ` +
                `seconds (diffMS: ${diffMS}; lastPongDate: ${lastPongDateString})`
            );
        }

    };

    handlePong = (event) => {
        console.log(
            `[${new Date().toISOString()}] UserScansRootCore.handlePong(): ` +
            `Received pong (updating lastPongDate): event:`,
            event
        );
        this.lastPongDate = new Date();
    };

    receiveSocketMessage = (event) => {

        console.log(
            `[${new Date().toISOString()}] UserScansRootCore.receiveSocketMessage(): ` +
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

                let newBarcodes = state.barcodes
                    .filter((barcode) => barcode.id !== newScan.id)
                    .concat(newScan);

                newBarcodes.sort((lhs, rhs) => {
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
        // MARK: Replace all scans
        else if (
            message?.type === SocketMessageTypes.replaceAllScans &&
            message?.scans
        ) {
            const scans = message.scans;

            console.log(
                `socket will replace all scans for user ${this.user}:`,
                scans
            );

            this.setState({
                barcodes: scans
            });
            this.deleteIDs.clear();

        }
        else {
            console.warning(
                `UserScansRootCore.receiveSocketMessage(): ` +
                `socket could not handle message:`, message
            );
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

    /**
     * Determines if the current barcode is different from the previous barcode
     * AND if the current barcode is *NEWER* than the previous barcode.
     * 
     * @param {*} previousBarcode the previous barcode
     * @param {*} currentBarcode the current barcode
     * @returns {boolean} `true` if the current barcode is different from the
     * previous barcode AND if the current barcode is *NEWER* than the previous
     * barcode; otherwise, `false`
     */
    latestBarcodeChanged = (previousBarcode, currentBarcode) => {

        if (!currentBarcode || currentBarcode?.id === previousBarcode?.id) {
            console.log(
                `UserScansRootCore.latestBarcodeChanged(): ` +
                `most recent barcode has *NOT* changed at all/is null: ` +
                `${JSON.stringify(currentBarcode)}`
            );
            return false;
        }

        /*
         We only want to auto-copy the most recent barcode if the most recent
         barcode is **NEWER** than the previously auto-copied barcode.

         For example, if the user deletes a barcode, then the most recent
         barcode will older than the previously auto-copied barcode. In this
         case, we do *NOT* want to auto-copy the most recent barcode.
         */

        // currentBarcode?.date should always be non-null
        // previousBarcode?.date may be null because previousBarcode may be null

        if (
            !previousBarcode ||
            new Date(currentBarcode.date) >= new Date(previousBarcode.date)
        ) {
            console.log(
                "UserScansRootCore.latestBarcodeChanged(): " +
                "most *RECENT* barcode has changed from " +
                `${JSON.stringify(previousBarcode)} to ` +
                `${JSON.stringify(currentBarcode)}`
            );
            return true;
        }
        else {
            console.log(
                "UserScansRootCore.latestBarcodeChanged(): " +
                "most *RECENT* barcode has *NOT* changed from " +
                `${JSON.stringify(previousBarcode)} to ` +
                `${JSON.stringify(currentBarcode)}`
            );
            return false;
        }
    };

    // MARK: - Auto-Copy -
    // copies the most recent barcode to the clipboard
    autoCopyIfEnabled = () => {

        if (!this.state.enableAutoCopy) {
            console.log(
                "Auto-copy is disabled; not copying latest barcode"
            );
            return;
        }

        const mostRecentBarcode = this.state.barcodes[0];
        const barcodeText = mostRecentBarcode?.barcode;
        if (barcodeText == null) {
            console.error(
                "AUTO-Copy failed: most recent barcode is null or undefined"
            );
            return;
        }

        if (this.lastAutoCopiedBarcode?.id === mostRecentBarcode?.id) {
            console.log(
                "AUTO-Copy failed: most recent barcode is the same as the " +
                "previously auto-copied barcode"
            );
            return;
        }
        this.lastAutoCopiedBarcode = mostRecentBarcode;

        console.log(
            `Auto-copying most recent barcode: "${mostRecentBarcode}"`
        );

        navigator.clipboard.writeText(barcodeText)
            .then(() => {

                console.log(
                    `AUTO-Copied barcode to clipboard: "${barcodeText}"`
                );

                this.setState({
                    autoCopiedBarcode: mostRecentBarcode
                });

                this.showBarcodeCopiedToast(barcodeText);
                
                clearTimeout(this.removeAutoCopiedBarcodeTimer);
                this.removeAutoCopiedBarcodeTimer = setTimeout(() => {
                    this.setState({
                        autoCopiedBarcode: null
                    });
                }, 5_000);

            })
            .catch((error) => {
                console.error(
                    `AUTO-Copy failed: could not copy barcode: ` +
                    `"${barcodeText}": ${error}`
                );
            });

    };

    showBarcodeCopiedToast = (barcode) => {
        console.log(`showBarcodeCopiedToast(): barcode: ${barcode}`);

        let barcodeTextMessage = barcode.truncated(30);

        toast.success(
            `Copied "${barcodeTextMessage}" to the Clipboard`,
            {
                duration: 5_000
            }
        );

    }

    copyBarcodeToClipboard = (barcode, { showNotification }) => {
        
        if (barcode == null) {
            console.log(
                `copyBarcodeToClipboard: barcode is null or undefined`
            );
            return;
        }

        console.log(
            `copyBarcodeToClipboard: Copying barcode to clipboard: "${barcode}"`
        );
        
        navigator.clipboard.writeText(barcode)
            .then(() => {

                console.log(
                    `copyBarcodeToClipboard: Copied barcode to clipboard: ` +
                    `"${barcode}"`
                );
                
                // set the last auto copied barcode to null whenever another
                // barcode is copied to the clipboard manually
                this.setState({
                    autoCopiedBarcode: null
                });

                if (showNotification) {
                    this.showBarcodeCopiedToast(barcode);
                }

            })
            .catch((error) => {
                console.error(
                    `copyBarcodeToClipboard: Could not copy barcode to ` +
                    `clipboard: "${barcode}": ${error}`
                );
            });

    };


    /** Get the user's scans */
    getUserScans = ({ user }) => {

        let date = new Date().toISOString();

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

        })
        .catch((error) => {
            console.error(
                `UserScansRootCore.componentDidMount(): error: ${error}`
            );
        });

    };

    deleteAllUserBarcodes = (e) => {
        
        console.log(
            `UserScansRootCore.deleteAllUserBarcodes(): ` +
            `Deleting all user barcodes`
        );

        // delete the barcodes
        this.setState({
            barcodes: []
        });

        this.context.api.deleteUserScans({
            user: this.user
        })
        .then((result) => {
            console.log(
                `UserScansRootCore.deleteAllUserBarcodes(): ` +
                `result: ${result}`
            );
        })
        .catch((error) => {
            console.error(
                `UserScansRootCore.deleteAllUserBarcodes(): ` +
                `could not delete all user barcodes: ${error}`
            );
        });

    };

    removeBarcodeFromState = (barcodeID) => {
        console.log(`Removing barcode with ID from state: ${barcodeID}`);

        this.setState((state) => {

            this.deleteIDs.add(barcodeID);
            console.log(
                `removeBarcodeFromState(): ${this.deleteIDs.size} deleteIDs:`,
                this.deleteIDs
            );

            const newBarcodes = state.barcodes.filter((barcode) => {
                return !this.deleteIDs.has(barcode.id);
            });

            return {
                barcodes: newBarcodes
            };

        });

    };

    handleAutoCopyChange = (e) => {
        const enableAutoCopy = e.target.checked;
        console.log(
            `UserScansRootCore.handleAutoCopyChange(): ` +
            `e.target.checked (enable auto-copy): ${enableAutoCopy}`
        );

        const urlFragmentParams = new URLSearchParams(
            window.location.hash.slice(1)
        );
        urlFragmentParams.set("auto-copy", enableAutoCopy);
        window.location.hash = urlFragmentParams.toString();

        console.log(
            `UserScansRootCore.handleAutoCopyChange(): ` +
            `set URL fragment to: ${window.location.hash}`
        );

        this.setState({
            enableAutoCopy: enableAutoCopy
        });

    };

    deleteAllUserBarcodesKeyboardShortcutString = () => {
        return isApplePlatform() ? "Cmd + D" : "Ctrl + D";
    };

    renderToast() {
        return (
            <div style={{ /* height: "50px" */}}>
                <Toaster 
                    gutter={10}
                    toastOptions={{
                        style: {
                            background: "lightblue",
                        }
                    }}
                />
            </div>
        );
    }

    render() {
        return (
            <div className="vw-100 vh-100">

                <div dangerouslySetInnerHTML={{ __html: `<!-- fetch("https://api.barcodedrop.com/scan/${this.user}?barcode=barcode", { method: "POST" }) -->` }}/>
                
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

                    {this.renderToast()}

                    {/* Delete All */}
                    <Button
                        variant="danger"
                        style={{ margin: "15px 0px" }}
                        onClick={this.deleteAllUserBarcodes}
                        data-toggle="tooltip"
                        data-placement="top"
                        title={this.deleteAllUserBarcodesKeyboardShortcutString()}
                    >
                        Delete All Barcodes
                    </Button>

                    {/* Auto-Copy */}

                    <label
                        style={{ padding: "5px 20px" }}
                        className=""
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Automatically copy the most recent barcode to the clipboard"
                    >
                        <input
                            type="checkbox"
                            name="enable-auto-copy"
                            id="enable-auto-copy"
                            checked={this.state.enableAutoCopy}
                            onChange={this.handleAutoCopyChange}
                        />
                        <span style={{ marginLeft: "5px" }}>
                            Auto-Copy
                        </span>
                    </label>

                    {/* spacer */}

                    {/* Table of Barcodes */}

                    <UserScansTable
                        barcodes={this.state.barcodes}
                        user={this.user}
                        autoCopiedBarcode={this.state.autoCopiedBarcode}
                        router={this.props.router}
                        removeBarcodeFromState={
                            this.removeBarcodeFromState
                        }
                    />

                </Container>
            </div>
        );
    };

}


// <Table
//     className="barcode-table border-dark"
//     striped bordered hover
//     style={{ maxWidth: "100%" }}
// >
//     <thead>
//         <tr>
//             <th style={{ width: "90px" }}>{/* copy button */}</th>
//             <th style={{ width: "100px" }}>{/* context menu */}</th>
//             <th>Barcode</th>
//             <th>Time</th>
//             <th style={{ width: "80px" }}>Delete</th>
//         </tr>
//     </thead>
//     <tbody>
//         {this.state.barcodes.map((barcode, index) =>
//             <UserScansRow
//                 key={barcode.id}
//                 index={index}
//                 barcode={barcode}
//                 user={this.user}
//                 isAutoCopied={this.state.autoCopiedBarcode?.id === barcode.id}
//                 router={this.props.router}
//                 removeBarcodeFromState={
//                     this.removeBarcodeFromState
//                 }
//             />
//         )}
//     </tbody>
// </Table>
