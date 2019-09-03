import React from 'react'
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
import {connect} from "react-redux";
import {profile_url} from "../global";

class UpdateProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    changeHandler = e => {
        this.setState({[e.target.name]: e.target.value});
    };
    submitHandler = () => {

    };

    render() {
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol md="12">
                        <MDBCard className="d-flex justify-content-center w-50 form-container"
                                 style={{marginTop: 100, marginLeft: 'auto', marginRight: 'auto'}}>
                            <MDBCardBody>
                                <MDBCardHeader className="form-header deep-blue-gradient rounded">
                                    <h3 className="my-3">
                                        <MDBIcon icon="user"/> Update Profile
                                    </h3>
                                </MDBCardHeader>
                                <form onSubmit={this.submitHandler}>
                                    <div className="grey-text">
                                        <div className="md-form form-group">
                                            <div className="profilepicture">
                                                <img src={profile_url+localStorage.getItem('profile_picture')} width={"100%"} alt=""/>
                                                <MDBIcon icon={"plus"} className={"change-camera"}/>
                                                <input type="file" ref={"cgprofile"} accept={"image/*"}/>
                                            </div>
                                        </div>
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
        )
    }
}

const mapToStateProps = state => {
    return {
        profilepicture: state.user.profilepicture,
        username: state.user.username,
    }
}

export default connect(mapToStateProps)(UpdateProfile)
