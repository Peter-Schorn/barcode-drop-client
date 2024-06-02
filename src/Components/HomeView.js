import React from 'react';
import { Component } from "react";
import { Form, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import MainNavbar from "./MainNavbar";

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
        this.state = {
            user: null
        }

    }

    onSubmitForm = (event) => {
        event.preventDefault();
        console.log(`HomeView.onSubmitForm(): user: "${this.state.user}"`);
        return this.navigate(`/scans/${this.state.user}`);
    }

    handleUserInputChange = (event) => {
        console.log(
            `HomeView.handleFormChange() event.target.value: ` +
            `"${event.target.value}"`
        );
        this.setState({
            user: event.target.value
        });
    }

    render() {
        return (
            <div className="vw-100 vh-100">
                <MainNavbar />
                <div className="d-flex justify-content-center align-items-center w-100 h-75">
                    <Form className="shadow-lg p-5 bg-body rounded text-center" onSubmit={this.onSubmitForm}>
                        <Form.Group className="" controlId="userForm.userInput">
                            <Form.Label>
                                <h2 className="text-primary mb-3"> Enter Your Username</h2>
                            </Form.Label>
                            <Form.Control className="" size="lg" type="text" placeholder="" onChange={this.handleUserInputChange}/>
                        </Form.Group>
                        <Button className="mt-4" variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }

}
