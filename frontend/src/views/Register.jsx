import React from "react";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBModalFooter,
    MDBRow
} from "mdbreact";
import {Link} from "react-router-dom";
import axios from "axios"
import {toast, ToastContainer} from 'react-toastify';

import {api_url, backend_url} from "../global";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            username: "",
            password: "",
            cpassword: "",
            emailfeedback: "",
            usernamefeedback: "",
            passwordfeedback: "",
            cpasswordfeedback: ""
        };
    }

    submitHandler = e => {
        e.preventDefault();
        e.target.className += " was-validated";
        const input = document.querySelectorAll('form.needs-validation input');
        let valid = true;
        for (let i = 0; i < input.length; i++) {
            const target = {
                target: input[i]
            };
            if (input[i].classList.contains('invalid-input') || input[i].parentNode.classList.contains('invalid-input')) {
                valid = false;
            }
            this.validateinput(target, false)
        }
        if (valid) {
            axios.post(`${api_url}register`, {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            }).then(async res => {
                toast.success(res.data.message);
                setTimeout(() => {
                    this.props.history.push('/login')
                },1000)
            }).catch(err => {
                toast.error(err.response.data.message)
            })
        }

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
    removevalidate = e => {
        e.target.classList.remove('invalid-input');
        e.target.parentNode.classList.remove('invalid-div')
    };
    validateinput = (e, persist = true) => {
        if (persist) {
            e.persist();
        }
        if (e.target.value == "") {
            this.invalidinput(e);
            switch (e.target.name) {
                case "email":
                    this.setState({
                        emailfeedback: "Email required"
                    });
                    break;
                case "username":
                    this.setState({
                        usernamefeedback: "Username must be filled"
                    });
                    break;
                case "password":
                    this.setState({
                        passwordfeedback: "Password can't Empty"
                    });
                    break;
                case "cpassword":
                    this.setState({
                        cpasswordfeedback: "Please Confirm Your Password"
                    });
                    break;
            }
        } else {
            switch (e.target.name) {
                case "email":
                    axios.post(`${backend_url}checkemail`, {
                        email: e.target.value
                    }).then(r => {
                        this.validinput(e);
                        this.setState({
                            emailfeedback: ""
                        })
                    }).catch(er => {
                        this.invalidinput(e);
                        this.setState({
                            emailfeedback: "Email Has been taken"
                        })
                    });
                    break;
                case "username":
                    axios.post(`${backend_url}checkusername`, {
                        username: e.target.value
                    }).then(r => {
                        this.validinput(e);
                        this.setState({
                            usernamefeedback: ""
                        })
                    }).catch(er => {
                        this.invalidinput(e);
                        this.setState({
                            usernamefeedback: "Username Has been taken"
                        })
                    });
                    break;
                case "password":
                    if (this.state.password.length < 6) {
                        this.invalidinput(e);
                        this.setState({
                            passwordfeedback: "Password Must be At Least 6 Characters"
                        })
                    } else {
                        this.validinput(e);
                        this.setState({
                            passwordfeedback: ""
                        })
                    }
                    break;
                case "cpassword":
                    if (this.state.cpassword !== this.state.password) {
                        this.invalidinput(e);
                        this.setState({
                            cpasswordfeedback: "Password doesn't match"
                        })
                    } else {
                        this.validinput(e);
                        this.setState({
                            cpasswordfeedback: ""
                        })
                    }
                    break;
                default:
                    this.validinput(e)
            }
        }
    };

    changeHandler = e => {
        this.setState({[e.target.name]: e.target.value});
        if(e.target.name === "username"){
            const regex = new RegExp("^[a-zA-Z0-9]$");
            const key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            if (!regex.test(key)) {
                e.preventDefault();
                return false;
            }
        }
    };

    render() {
        return (
            <>

                <MDBContainer>
                    <MDBRow>
                        <MDBCol md="12">
                            <MDBCard className="d-flex justify-content-center w-50 form-container"
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
                                                onFocus={this.removevalidate}
                                                id={"email"}
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
                                            >
                                                <div className="invalid-feedback">
                                                    {this.state.emailfeedback}
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
                                                onFocus={this.removevalidate}
                                                type="text"
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
                                            >
                                                <div className="invalid-feedback">
                                                    {this.state.usernamefeedback}
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
                                                onFocus={this.removevalidate}
                                                value={this.state.password}
                                                name={"password"}
                                                required
                                            >
                                                <div className="invalid-feedback">
                                                    {this.state.passwordfeedback}
                                                </div>
                                                <div className="valid-feedback">Password Valid!</div>
                                            </MDBInput>
                                            <MDBInput
                                                label="Confirm your password"
                                                icon="lock"
                                                group
                                                type="password"
                                                onChange={this.changeHandler}
                                                onBlur={this.validateinput}
                                                onFocus={this.removevalidate}
                                                value={this.state.cpassword}
                                                name={"cpassword"}
                                                validate
                                                required
                                            >
                                                <div className="comments">
                                                    <div className="invalid-feedback">
                                                        {this.state.cpasswordfeedback}
                                                    </div>
                                                    <div className="valid-feedback">Password Match!</div>
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
            </>
        );
    }

}
