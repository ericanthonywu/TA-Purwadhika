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
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    changeHandler = e => {
        this.setState({[e.target.name]: e.target.value});
    };
    submitHandler = e => {
        e.preventDefault();
        axios.post("http://localhost:3000/web/login", {
            email: this.state.email,
            password: this.state.password
        }).then(res => {
            toast.success('Berhasil Login');
            localStorage.setItem('token', res.data._token);
            localStorage.setItem('username', res.data.username);
            alert(localStorage.getItem('username'))
            // setTimeout(() => {
            //     this.props.history.push('/')
            // }, 1000)
        }).catch(err => {
            toast.error(err.response.data.message)
        })
    };

    render() {
        return (
            <>
                <ToastContainer enableMultiContainer position={toast.POSITION.TOP_RIGHT}/>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol md="12">
                            <MDBCard className="d-flex justify-content-center w-50 form-container"
                                     style={{marginTop: 100, marginLeft: 'auto', marginRight: 'auto'}}>
                                <MDBCardBody>
                                    <MDBCardHeader className="form-header deep-blue-gradient rounded">
                                        <h3 className="my-3">
                                            <MDBIcon icon="lock"/> Login:
                                        </h3>
                                    </MDBCardHeader>
                                    <form onSubmit={this.submitHandler}>
                                        <div className="grey-text">
                                            <MDBInput
                                                label="Type your email"
                                                name={"email"}
                                                icon="envelope"
                                                group
                                                type="email"
                                                validate
                                                error="wrong"
                                                success="right"
                                                onChange={this.changeHandler}
                                            />
                                            <MDBInput
                                                label="Type your password"
                                                name={"password"}
                                                icon="lock"
                                                group
                                                type="password"
                                                validate
                                                onChange={this.changeHandler}
                                            />
                                        </div>

                                        <div className="text-center mt-4">
                                            <MDBBtn
                                                color="light-blue"
                                                className="mb-3"
                                                type="submit"
                                            >
                                                Login
                                            </MDBBtn>
                                        </div>
                                    </form>
                                    <MDBModalFooter>
                                        <div className="font-weight-light">
                                            <p>Not a member? <Link to="register">Sign Up</Link></p>
                                            <p><Link to="">Forgot Password?</Link></p>
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

};