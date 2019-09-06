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
import axios from "axios"
import {connect} from "react-redux";
import {login} from "../redux/actions";
import {api_url} from "../global";

class Login extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    changeHandler = e => {
        this.setState({[e.target.name]: e.target.value});
    };
    submitHandler = e => {
        e.preventDefault();
        axios.post(`${api_url}login`, {
            email: this.state.email,
            password: this.state.password
        }).then(res => {
            toast.success('Berhasil Login');
            localStorage.setItem('token', res.data._token);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('profile_picture', res.data.profile_picture);
            localStorage.setItem('_id', res.data._id);
            this.props.login({
                token: res.data._token,
                username: res.data.username,
                profilepicture: res.data.profile_picture,
                _id:res.data._id,
                loggedin: true,
            })
            setTimeout(() => {
                this.props.history.push('/')
            }, 1000)
        }).catch(err => {
            toast.error(err.response.data.message)
        })
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
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.user.token,
        username: state.user.username,
        loggedin: state.user.loggedin,
    }
}

export default connect(mapStateToProps, {login})(Login)
