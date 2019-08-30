import React, {Component} from 'react';
import {Route, withRouter, Switch, Link} from "react-router-dom";
import {
    MDBBtn,
    MDBCollapse,
    MDBDropdown,
    MDBDropdownItem,
    MDBDropdownMenu,
    MDBDropdownToggle,
    MDBFormInline,
    MDBIcon,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarToggler,
    MDBNavItem,
    MDBNavLink
} from "mdbreact";
import DashboardPage from './views/Dashboard'
import Register from './views/Register'
import Login from './views/Login'
import Profile from "./views/Profile";
import Error404 from "./views/template/404";
import AddPost from "./views/AddPost";
import {withAuth} from "./views/template/CheckToken";

import {connect} from "react-redux";
import {login,logout,setloggedin} from "./redux/actions";

class App extends Component {
    constructor(a) {
        super(a);
        this.state = {
            isOpen: false,
            loggedin:false,
        };
    }

    onLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.props.logout();
        this.props.history.push('/');
    }
    toggleCollapse = () => {
        this.setState({isOpen: !this.state.isOpen});
    };
    handleActiveNav = e => {
        const allnav = document.querySelectorAll('.navbar-item,.nav-link');
        for (let i = 0; i < allnav.length; i++) {
            allnav[i].classList.remove('active');
            allnav[i].closest('.nav-item').classList.remove('active')
        }
        e.target.classList.add('active');
        e.target.closest('.nav-item').classList.add('active')
    };

    componentDidMount() {
        const {location} = this.props;
        const allnav = document.querySelectorAll('.navbar-item,.nav-link');
        const pathname = location.pathname.split('/')[1];
        const checkurl = [
            '',
            'explore',
        ];
        for (let i = 0; i < allnav.length; i++) {
            allnav[i].classList.remove('active');
            allnav[i].closest('.nav-item').classList.remove('active')
        }

        for (let x = 0; x <= checkurl.length; x++) {
            if (pathname === checkurl[x]) {
                allnav[x].classList.add('active');
                allnav[x].closest('.nav-item').classList.add('active')
            }
        }
        if(localStorage.getItem('token') !== "" && localStorage.getItem('username') !== ""){
            this.props.setloggedin({
                username: localStorage.getItem('username'),
                token: localStorage.getItem('token'),
            })
        }else{
            this.props.logout()
        }
    }

    render() {
        return (
            <div>
                <MDBNavbar color="indigo" dark expand="md" className={'mb-2 w-100'}>
                    <MDBNavbarBrand>
                        <strong className="white-text">SosMed</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse}/>
                    <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                        <MDBNavbarNav left>
                            <MDBNavItem active={true}>
                                <MDBNavLink to="/" onClick={this.handleActiveNav}>Home</MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink to="/explore"
                                            onClick={this.handleActiveNav}>Explore</MDBNavLink>
                            </MDBNavItem>
                        </MDBNavbarNav>
                        <MDBNavbarNav right>
                            <MDBNavItem>
                                <MDBFormInline waves>
                                    <div className="md-form my-0">
                                        <input className="form-control mr-sm-2 w-100 mt-3 w-100" type="text" placeholder="Find User"
                                               aria-label="Search"/>
                                    </div>
                                </MDBFormInline>
                            </MDBNavItem>
                            {this.props.loggedin
                                ?
                                    <MDBNavItem>
                                        <MDBDropdown>
                                            <MDBDropdownToggle nav caret>
                                                <MDBIcon icon="user" />
                                            </MDBDropdownToggle>
                                            <MDBDropdownMenu className="dropdown-default">
                                                <MDBDropdownItem>Hi, {this.props.username}</MDBDropdownItem>
                                                <MDBDropdownItem><Link to={`/profile/${this.props.username}`}>My Profile</Link> </MDBDropdownItem>
                                                <MDBDropdownItem><Link to={'addpost'}>Add Post</Link></MDBDropdownItem>
                                                <MDBDropdownItem onClick={this.onLogout}>logout</MDBDropdownItem>
                                            </MDBDropdownMenu>
                                        </MDBDropdown>
                                    </MDBNavItem>
                                :
                                    <>
                                        <MDBNavItem>
                                        <MDBNavLink to={'/login'}><MDBBtn gradient={"purple"}>Login</MDBBtn></MDBNavLink>
                                        </MDBNavItem>
                                        <MDBNavItem>
                                        <MDBNavLink to={'/register'}><MDBBtn gradient={"aqua"}>Register</MDBBtn></MDBNavLink>
                                        </MDBNavItem>
                                    </>
                            }
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
                <Switch>
                    <Route path={'/'} exact component={DashboardPage}/>
                    <Route path={'/login'} exact component={Login}/>
                    <Route path={'/register'} exact component={Register}/>
                    <Route path={'/profile/:profile'} component={withAuth(Profile)}/>
                    <Route path={'/addpost'} component={withAuth(AddPost)}/>
                    <Route component={Error404}/>
                </Switch>

            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        token: state.user.token,
        username: state.user.username,
        loggedin: state.user.loggedin
    }
}
export default withRouter(connect(mapStateToProps,{login,logout,setloggedin})(App))
