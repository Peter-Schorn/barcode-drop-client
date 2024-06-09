

export default class WebSocketManager {

    constructor(
        socketURL
    ) {
        this.socketURL = socketURL;
        this._socket = new WebSocket(this.socketURL);
    }

    _configureSocket() {

        console.log("WebSocketManager._configureSocket():");

        this._socket = new WebSocket(this.socketURL);

        this._socket.onclose = (event) => {
            console.log(
                `[${Date()}] socket.onclose(): event:`, event
            );
            console.log(
                `[${Date()}] Attempting to re-connect to WebSocket...`
            );
            setTimeout(() => {
                this._configureSocket();
            }, 500);
        };

        try {
            this._socket.onopen = (event) => {
                console.log(
                    `[${Date()}] socket.onopen(): event:`, event
                );
            };
        } finally {
            console.log(
                `[${Date()}] socket.onopen() failed.`
            );
        }

    }

    onOpen(callback) {
        this._socket.onopen = callback;
    }

    onClose(callback) {
        this._socket.onclose = callback;
    }

    onError(callback) {
        this._socket.onerror = callback;
    }

    onMessage(callback) {
        this._socket.onmessage = callback;
    }

    send(message) {
        this._socket.send(message);
    }


}
