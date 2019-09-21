import React from "react";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBCardHeader,
    MDBBtn,
    MDBInput
} from "mdbreact";
// import "./login.scss"
import Axios from "axios";
import {api_url} from "../global";
import {toast} from "react-toastify";
import {login} from "../redux/actions";
import {connect} from "react-redux";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            this.props.history.push('/dashboard')
        }
    }

    login = e => {
        e.preventDefault();
        Axios.post(`${api_url}login`, this.state).then(async res => {
            const {id, role, username, token} = res.data;
            localStorage.setItem('id', id);
            localStorage.setItem('role', role);
            localStorage.setItem('username', username);
            localStorage.setItem('token', token);
            await this.props.login(res.data);
            this.props.history.push('/dashboard')
        }).catch(err => {
            toast.error("Wrong username / password")
        })
    };
    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    render() {
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol md="6" className={"login-center"}>
                        <MDBCard>
                            <MDBCardBody>
                                <MDBCardHeader className="form-header deep-blue-gradient rounded">
                                    <h3 className="my-3">
                                        <MDBIcon icon="lock"/> Login:
                                    </h3>
                                </MDBCardHeader>
                                <form onSubmit={this.login}>
                                    <div className="grey-text">
                                        <MDBInput
                                            label="Type your Username"
                                            icon="user"
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            name={"username"}
                                            onChange={this.handleInput}
                                        />
                                        <MDBInput
                                            label="Type your password"
                                            icon="lock"
                                            group
                                            type="password"
                                            validate
                                            name={"password"}
                                            onChange={this.handleInput}
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
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}

export default connect(null, {login})(LoginPage);
