import React from "react";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBModalFooter,
    MDBIcon,
    MDBCardHeader,
    MDBBtn,
    MDBInput
} from "mdbreact";
import {Link} from "react-router-dom";
import axios from "axios"

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            username: "",
            password: "",
            cpassword: "",
        };
    }

    submitHandler = event => {
        event.preventDefault();
        event.target.className += " was-validated";
    };
    invalidinput = (e, value = null) => {
        if (e.target.parentNode.classList.contains('valid-div')) {
            e.target.parentNode.classList.remove('valid-div')
        }
        if (e.target.classList.contains('valid-input')) {
            e.target.classList.remove('valid-input')
        }
        e.target.classList.add('invalid-input');
        e.target.parentNode.classList.add('invalid-div');
        if (value !== null) {
            e.target.value = value
        }
    };
    validinput = (e, value = null) => {
        if (e.target.parentNode.classList.contains('invalid-div')) {
            e.target.parentNode.classList.remove('invalid-div')
        }
        if (e.target.classList.contains('invalid-input')) {
            e.target.classList.remove('invalid-input')
        }
        e.target.classList.add('valid-input');
        e.target.parentNode.classList.add('valid-div');
        if (value !== null) {
            e.target.value = value
        }
    };
    validatedouble = e => {
        switch (e.target.name) {
            case "email":
                axios.post('https://locahost:3000/api/checkemail', {
                    email: e.target.value
                }).then(r => {

                }).catch(e => {

                });
                break;
            case "username":
                axios.post('https://locahost:3000/api/checkusername', {
                    username: e.target.value
                }).then(r => {

                }).catch(e => {

                });
                break;
        }
    };
    validateinput = e => {
        if (e.target.value == "") {
            this.invalidinput(e)
        } else {
            if (e.target.name == "email") {
                axios.post('http://localhost:3000/mobile/checkemail', {
                    email: e.target.value
                }).then(r => {
                    console.log(e)
                }).catch(er => {
                    this.invalidinput(e)
                });
            } else if (e.target.name == "username") {
                axios.post('http://localhost:3000/mobile/checkusername', {
                    username: e.target.value
                }).then(r => {
                    this.validinput(e)
                }).catch(er => {
                    this.invalidinput(e)
                });

            } else {
                this.validinput(e)
            }
        }
    };

    changeHandler = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    render() {
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol md="12">
                        <MDBCard className="d-flex justify-content-center w-50"
                                 style={{marginTop: 100, marginLeft: 'auto', marginRight: 'auto'}}>
                            <MDBCardBody>
                                <MDBCardHeader className="form-header deep-blue-gradient rounded">
                                    <h3 className="my-3">
                                        <MDBIcon icon="lock"/> Register:
                                    </h3>
                                </MDBCardHeader>
                                <form className={"needs-validation"} noValidate onSubmit={this.submitHandler}>
                                    <div className="grey-text">
                                        <MDBInput
                                            label="Type your email"
                                            icon="envelope"
                                            group
                                            type="email"
                                            value={this.state.email}
                                            name={"email"}
                                            onChange={this.changeHandler}
                                            onBlur={this.validateinput}
                                            id={"email"}
                                            validate
                                            error="wrong"
                                            success="right"
                                            required
                                        >
                                            <div className="invalid-feedback">
                                                Please provide a valid Email.
                                            </div>
                                            <div className="valid-feedback">Email Available!</div>
                                        </MDBInput>
                                        <MDBInput
                                            label="Type your Username"
                                            icon="user"
                                            group
                                            onChange={this.changeHandler}
                                            value={this.state.username}
                                            name={"username"}
                                            onBlur={this.validateinput}
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            required
                                        >
                                            <div className="invalid-feedback">
                                                Please provide your Username.
                                            </div>
                                            <div className="valid-feedback">Username Available!</div>
                                        </MDBInput>
                                        <MDBInput
                                            label="Type your password"
                                            icon="lock"
                                            group
                                            type="password"
                                            validate
                                            onChange={this.changeHandler}
                                            onBlur={this.validateinput}
                                            value={this.state.password}
                                            name={"password"}
                                            required
                                        >
                                            <div className="invalid-feedback">
                                                Please provide a Password for your account.
                                            </div>
                                            <div className="valid-feedback">Looks good!</div>
                                        </MDBInput>
                                        <MDBInput
                                            label="Confirm your password"
                                            icon="lock"
                                            group
                                            type="password"
                                            onChange={this.changeHandler}
                                            onBlur={this.validateinput}
                                            value={this.state.cpassword}
                                            name={"cpassword"}
                                            validate
                                            required
                                        >
                                            <div className="comments">
                                                <div className="invalid-feedback">
                                                    Please Re-type your Password Correctly.
                                                </div>
                                                <div className="valid-feedback">Looks good!</div>
                                            </div>
                                        </MDBInput>
                                    </div>

                                    <div className="text-center mt-4">
                                        <MDBBtn
                                            color="light-blue"
                                            className="mb-3"
                                            type="button"
                                            onClick={this.submitHandler}
                                        >
                                            Register
                                        </MDBBtn>
                                    </div>
                                </form>
                                <MDBModalFooter>
                                    <div className="font-weight-light">
                                        <p>Have an account? <Link to="login">Sign In</Link></p>
                                        {/*<p><Link to="">Forgot Password?</Link></p>*/}
                                    </div>
                                </MDBModalFooter>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }

}
