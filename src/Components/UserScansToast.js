import React from "react";
import { Component } from "react";
import toast, { Toaster, /* ToastBar */ } from 'react-hot-toast';

export default class UserScansToast extends Component {

    // constructor(props) {
    //     super(props);
    //     // this.state = {
    //     //     show: false
    //     // };
    // }

    render() {
        return (
            <div style={{ /* height: "50px" */ }} onClick={this.dismissToast}>
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

}
