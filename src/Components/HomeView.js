import React from 'react';
import { Component } from "react";
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import MainNavbar from "./MainNavbar";

// import barcode_drop_background from "./images/barcode_drop_background.svg";

export default function HomeView(props) {

    let navigate = useNavigate();

    return (
        <HomeViewCore
            {...props}
            navigate={navigate}
        />
    );

};

class HomeViewCore extends Component {

    constructor(props) {
        super(props);

        this.navigate = props.navigate;

        document.title = `BarcodeDrop`;

        this.usernameField = React.createRef();

        this.state = {
            user: null
        };

    }

    componentDidMount() {
        this.usernameField?.current?.focus();
    }

    onSubmitForm = (event) => {
        event.preventDefault();
        console.log(`HomeView.onSubmitForm(): user: "${this.state.user}"`);
        return this.navigate(`/scans/${this.state.user}`);
    };

    handleUserInputChange = (event) => {
        console.log(
            `HomeView.handleFormChange() event.target.value: ` +
            `"${event.target.value}"`
        );
        this.setState({
            user: event.target.value
        });
    };

    usernameFormBackgroundGradient = () => {
        return {
            background: "linear-gradient(to right, rgba(0, 210, 255, 0.9), rgba(58, 123, 213, 0.9))" ,
            // background: "rgba(0, 0, 0, 0.1)",
            // opacity: "0.9"
        };
    }

    render() {
        return (
            <div className="vw-100 vh-100">
                <MainNavbar />
                <div 
                    className={
                        "d-flex justify-content-center align-items-center " +
                        "w-100 h-75 "
                        // "bg-secondary"
                    }
                    style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL + "images/barcode_drop_background.svg"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                >
                    {/* <img src={barcode_drop_background} alt="barcode_drop_background" /> */}
                    {/* <img src={process.env.PUBLIC_URL + "images/barcode_drop_background.svg"} alt="barcode drop background" /> */}
                    <Form 
                        className="username-form shadow-lg p-5 bg-body rounded text-center" 
                        onSubmit={this.onSubmitForm}
                        style={this.usernameFormBackgroundGradient()}   
                    >
                        <Form.Group className="" controlId="userForm.userInput">
                            <Form.Label>
                                <h2 className=" mb-3"> Enter Your Username</h2>
                            </Form.Label>
                            <Form.Control
                                ref={this.usernameField}
                                className=""
                                size="lg"
                                type="text"
                                placeholder=""
                                onChange={this.handleUserInputChange}
                            />
                        </Form.Group>
                        <Button 
                            className="mt-4" 
                            variant="dark" 
                            type="submit"
                        >
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }

}
