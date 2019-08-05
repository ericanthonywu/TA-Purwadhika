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

export default class Login extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol md="12">
                        <MDBCard className="d-flex justify-content-center w-50" style={{marginTop:100,marginLeft:'auto',marginRight:'auto'}}>
                            <MDBCardBody >
                                <MDBCardHeader className="form-header deep-blue-gradient rounded">
                                    <h3 className="my-3">
                                        <MDBIcon icon="lock" /> Login:
                                    </h3>
                                </MDBCardHeader>
                                <form>
                                    <div className="grey-text">
                                        <MDBInput
                                            label="Type your email"
                                            icon="envelope"
                                            group
                                            type="email"
                                            validate
                                            error="wrong"
                                            success="right"
                                        />
                                        <MDBInput
                                            label="Type your password"
                                            icon="lock"
                                            group
                                            type="password"
                                            validate
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
        );
    }

};