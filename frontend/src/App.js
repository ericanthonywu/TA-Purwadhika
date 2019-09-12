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
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarToggler,
    MDBNavItem,
    MDBNavLink,
    MDBModal,
    MDBModalBody,
    MDBIcon
} from "mdbreact";
import DashboardPage from './views/Dashboard'
import Register from './views/Register'
import Login from './views/Login'
import Profile from "./views/Profile";
import Error404 from "./views/template/404";
import AddPost from "./views/AddPost";
import {withAuth} from "./views/template/CheckToken";
import Chat from "./views/Chat";

import {connect} from "react-redux";
import {login, logout, setloggedin} from "./redux/actions";
import ShowPost from "./views/ShowPost";
import UpdateProfile from "./views/UpdateProfile";
import {profile_url} from "./global";
import {toast, ToastContainer} from "react-toastify";
import Search from "./views/Search";

class App extends Component {
    constructor(a) {
        super(a);
        this.state = {
            isOpen: false,
            loggedin: false,
            bottommodal: false,
            timeout: null,
            chatMinimized: false
        };
    }

    onLogout = () => {
        this.props.logout();
        this.props.history.push('/');
    };
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
        e.target.closest('.nav-item').classList.add('active');
        this.setState({
            isOpen: false
        })
    };

    componentDidMount() {
        if (!localStorage.getItem('token') && this.props.token) {
            this.setState({
                bottommodal: true
            })
        }
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
        if (localStorage.getItem('token')) {
            this.props.setloggedin({
                username: localStorage.getItem('username'),
                token: localStorage.getItem('token'),
                _id: localStorage.getItem('_id'),
                profilepicture: localStorage.getItem('profile_picture')
            })
        } else {
            this.props.logout()
        }
    }

    render() {
        return (
            <div>
                <ToastContainer enableMultiContainer position={toast.POSITION.TOP_RIGHT}/>
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
                                        <input className="form-control mr-sm-2 w-100 mt-3 w-100" type="text"
                                               placeholder="Find User"
                                               aria-label="Search"
                                               onChange={
                                                   e => {
                                                       if (this.state.timeout) {
                                                           clearTimeout(this.state.timeout);
                                                           this.setState({
                                                               timeout: null
                                                           })
                                                       }
                                                       const search = e.target.value;
                                                       this.setState({
                                                           timeout: setTimeout(() => {
                                                               this.props.history.push("/search?user=" + search)
                                                           }, 500)
                                                       })
                                                   }
                                               }
                                        />
                                    </div>
                                </MDBFormInline>
                            </MDBNavItem>
                            {this.props.loggedin
                                ?
                                <>
                                    <MDBNavItem>
                                        <MDBDropdown>
                                            <MDBDropdownToggle nav caret>
                                                <img src={profile_url + this.props.profilepicture} width={30}
                                                     className={"round"} alt=""/>
                                                <span className={"ml-2"}>{this.props.username}</span>
                                            </MDBDropdownToggle>
                                            <MDBDropdownMenu className="dropdown-default">
                                                <MDBDropdownItem><Link onClick={() => this.setState({
                                                    isOpen: false
                                                })} to={`/profile/${this.props.username}`}>My
                                                    Profile</Link></MDBDropdownItem>
                                                <MDBDropdownItem><Link onClick={() => this.setState({
                                                    isOpen: false
                                                })} to={'addpost'}>Add Post</Link></MDBDropdownItem>
                                                <MDBDropdownItem onClick={this.onLogout}><a>logout</a></MDBDropdownItem>
                                            </MDBDropdownMenu>
                                        </MDBDropdown>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBDropdown>
                                            <MDBDropdownToggle nav caret>
                                                <div style={{display:"flex",position:"absolute"}}>
                                                    <MDBIcon icon={"bell"}/>
                                                    <div className={"notification-unread"}>1</div>
                                                </div>
                                            </MDBDropdownToggle>
                                            <MDBDropdownMenu className="dropdown-default notification-list">
                                                <div className={"notif-item pointer"}>
                                                    <div style={{float: "left"}} >
                                                        <p className={"pointer"} style={{fontWeight:600}}>EricAnthony</p>
                                                        <p className={"pointer"} style={{fontWeight:600}}>Started Following you <span style={{fontWeight:"lighter"}}>1h</span></p>
                                                    </div>
                                                    <div style={{float: "right"}}>
                                                        <img src="http://localhost:3000/uploads/profile_picture/2019-09-10T15-14-56.652Z1.jpg" width={60} alt=""/>
                                                    </div>
                                                </div>
                                                <div className={"notif-item pointer"}>
                                                    <div style={{float: "left"}} >
                                                        <p className={"pointer"} style={{fontWeight:600}}>EricAnthony</p>
                                                        <p className={"pointer"} style={{fontWeight:600}}>Started Following you <span style={{fontWeight:"lighter"}}>1h</span></p>
                                                    </div>
                                                    <div style={{float: "right"}}>
                                                        <img src="http://localhost:3000/uploads/profile_picture/2019-09-10T15-14-56.652Z1.jpg" width={60} alt=""/>
                                                    </div>
                                                </div>
                                                <div className={"notif-item pointer"}>
                                                    <div style={{float: "left"}} >
                                                        <p className={"pointer"} style={{fontWeight:600}}>EricAnthony</p>
                                                        <p className={"pointer"} style={{fontWeight:600}}>Started Following you <span style={{fontWeight:"lighter"}}>1h</span></p>
                                                    </div>
                                                    <div style={{float: "right"}}>
                                                        <img src="http://localhost:3000/uploads/profile_picture/2019-09-10T15-14-56.652Z1.jpg" width={60} alt=""/>
                                                    </div>
                                                </div>
                                            </MDBDropdownMenu>
                                        </MDBDropdown>
                                    </MDBNavItem>
                                </>
                                :
                                <>
                                    <MDBNavItem>
                                        <MDBNavLink to={'/login'}><MDBBtn onClick={() => this.setState({
                                            isOpen: false
                                        })} gradient={"purple"}>Login</MDBBtn></MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink to={'/register'}><MDBBtn onClick={() => this.setState({
                                            isOpen: false
                                        })} gradient={"aqua"}>Register</MDBBtn></MDBNavLink>
                                    </MDBNavItem>
                                </>
                            }
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
                <div>
                    <span className={"toggle-chat"} style={this.state.chatMinimized ? {left: "calc(100% - 20px)"} : {}}
                          onClick={() => this.setState({chatMinimized: !this.state.chatMinimized})}><MDBIcon
                        icon={this.state.chatMinimized ? "bars" : "times"}/></span>
                    <div className={"chat-container"} style={this.state.chatMinimized ? {width: 0, left: "100%"} : {}}>
                        <div>
                            <img src="https://github.githubassets.com/favicon.ico" alt=""/>
                            <span>github</span>
                            <span className={"online"}>

                        </span>
                        </div>
                        <div>
                            <img src="https://github.githubassets.com/favicon.ico" alt=""/>
                            <span>github</span>
                            <span className={"online"}>

                        </span>
                        </div>
                        <div>
                            <img src="https://github.githubassets.com/favicon.ico" alt=""/>
                            <span>github</span>
                            <span className={"online"}>

                        </span>
                        </div>
                        <div>
                            <img src="https://github.githubassets.com/favicon.ico" alt=""/>
                            <span>github</span>
                            <span className={"online"}>

                        </span>
                        </div>
                        <div>
                            <img src="https://github.githubassets.com/favicon.ico" alt=""/>
                            <span>github</span>
                            <span className={"online"}></span>
                        </div>
                        <div>
                            <img src="https://github.githubassets.com/favicon.ico" alt=""/>
                            <span>github</span>
                            <span className={"online"}>

                        </span>
                        </div>
                        <div>
                            <img src="https://github.githubassets.com/favicon.ico" alt=""/>
                            <span>github</span>
                            <span className={"online"}>

                        </span>
                        </div>
                        <div>
                            <img src="https://github.githubassets.com/favicon.ico" alt=""/>
                            <span>github</span>
                            <span className={"online"}>

                        </span>
                        </div>
                        <div>
                            <img src="https://github.githubassets.com/favicon.ico" alt=""/>
                            <span>github</span>
                            <span className={"online"}>

                        </span>
                        </div>
                        <div>
                            <img src="https://github.githubassets.com/favicon.ico" alt=""/>
                            <span>github</span>
                            <span className={"online"}>

                        </span>
                        </div>
                        <div>
                            <img src="https://github.githubassets.com/favicon.ico" alt=""/>
                            <span>github</span>
                            <span className={"online"}>

                        </span>
                        </div>
                        <div>
                            <img src="https://github.githubassets.com/favicon.ico" alt=""/>
                            <span>github</span>
                            <span className={"online"}>

                        </span>
                        </div>
                        <div>
                            <img src="https://github.githubassets.com/favicon.ico" alt=""/>
                            <span>github</span>
                            <span className={"online"}>

                        </span>
                        </div>
                    </div>
                </div>
                <Switch>
                    <Route path={'/'} exact component={DashboardPage}/>
                    <Route path={'/login'} exact component={Login}/>
                    <Route path={'/register'} exact component={Register}/>
                    <Route path={'/profile/:profile'} component={withAuth(Profile)}/>
                    <Route path={'/addpost'} exact component={withAuth(AddPost)}/>
                    <Route path={'/chat'} exact component={Chat}/>
                    <Route path={'/post/:postid'} component={ShowPost}/>
                    <Route path={'/updateProfile'} exact component={withAuth(UpdateProfile)}/>
                    <Route path={'/search'} component={Search}/>
                    <Route component={Error404}/>
                </Switch>
                <MDBModal isOpen={this.state.bottommodal} backdrop={false} toggle={() => this.setState({
                    bottommodal: !this.state.bottommodal
                })} frame position="bottom">
                    <MDBModalBody>
                        Somedata is missing from your browser, Please Login Again
                        <MDBBtn color="secondary" onClick={() => this.setState({
                            bottommodal: false
                        })}>Close</MDBBtn>
                    </MDBModalBody>
                </MDBModal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.user.token,
        username: state.user.username,
        loggedin: state.user.loggedin,
        profilepicture: state.user.profilepicture
    }
};
export default withRouter(
    connect(mapStateToProps, {login, logout, setloggedin})(App)
)
