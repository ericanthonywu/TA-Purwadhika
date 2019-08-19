import React, {Component} from 'react';
import {Route, withRouter, Switch, Link} from "react-router-dom";
import {
    MDBBtn,
    MDBCollapse, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBFormInline, MDBIcon,
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
import CheckToken from "./views/template/CheckToken";


const SomeComponent = withRouter(props => <App {...props}/>);

class App extends Component {
    constructor(a) {
        super(a);
        this.state = {
            isOpen: false,
            loggedin:false,
        };
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
            this.setState({
                loggedin:true
            })
        }
    }

    render() {
        return (
            <div onScroll={() => alert('a')}>
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
                            {!this.state.loggedin
                                ?
                                <>
                                    <MDBNavItem>
                                        <MDBNavLink to={'/login'}><MDBBtn gradient={"purple"}>Login</MDBBtn></MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink to={'/register'}><MDBBtn gradient={"aqua"}>Register</MDBBtn></MDBNavLink>
                                    </MDBNavItem>
                                </>
                                :
                                <MDBNavItem>
                                    <MDBDropdown>
                                        <MDBDropdownToggle nav caret>
                                            <MDBIcon icon="user" />
                                        </MDBDropdownToggle>
                                        <MDBDropdownMenu className="dropdown-default">
                                            <MDBDropdownItem>Hi, {localStorage.getItem('username')}</MDBDropdownItem>
                                            <MDBDropdownItem><Link to={`/profile/${localStorage.getItem('username')}`}>My Profile</Link> </MDBDropdownItem>
                                            <MDBDropdownItem><Link to={'addpost'}>Add Post</Link></MDBDropdownItem>
                                            <MDBDropdownItem onClick={() => {
                                                localStorage.removeItem('token');
                                                localStorage.removeItem('username');
                                                this.setState({
                                                    loggedin:false
                                                })
                                            }}>logout</MDBDropdownItem>
                                        </MDBDropdownMenu>
                                    </MDBDropdown>
                                </MDBNavItem>
                            }


                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
                <Switch>
                    <Route path={'/'} exact component={DashboardPage}/>
                    <Route path={'/login'} exact component={Login}/>
                    <Route path={'/register'} exact component={Register}/>
                    <Route path={'/profile/:profile'} component={CheckToken(Profile)}/>
                    <Route path={'/addpost'} component={CheckToken(AddPost)}/>
                    <Route component={Error404}/>
                </Switch>

            </div>
        )
    }
}

export default withRouter(App)