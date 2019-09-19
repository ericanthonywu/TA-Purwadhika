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
    MDBIcon,
    MDBInput,
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
import {api_url, backend_url, base_url, post_url, profile_url} from "./global";
import {toast, ToastContainer} from "react-toastify";
import Search from "./views/Search";
import socketio from "socket.io-client";
import Axios from "axios";
import moment from "moment";


class App extends Component {
    constructor(a) {
        super(a);
        this.state = {
            isOpen: false,
            loggedin: false,
            bottommodal: false,
            timeout: null,
            chatMinimized: localStorage.getItem('chatMinimized'),
            notifications: [],
            unReadNotification: 0,
            listChat: [],
            search: null,
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
            });
            const socket = socketio(backend_url, {
                query: {
                    token: localStorage.getItem('token'),
                }
            });
            Axios.post(`${api_url}notification`, {
                token: localStorage.getItem('token')
            }).then(res => {
                this.setState({
                    notifications: res.data.data,
                    unReadNotification: res.data.unRead,
                })
            });
            Axios.post(`${api_url}getChat`, {
                token: localStorage.getItem('token')
            }).then(res => {
                let tempData = [];
                res.data.data.forEach(o => {
                    o.participans.forEach(data => {
                        if (data._id !== localStorage.getItem('_id')) {
                            tempData.push(data)
                        }
                    })
                });
                this.setState({
                    listChat: tempData
                })
            });
            socket.on('newNotifications', notifications => {
                if (notifications.to.username == localStorage.getItem('username')) {
                    const tempNotifications = this.state.notifications;
                    tempNotifications.unshift(notifications);
                    this.setState({
                        notifications: tempNotifications,
                        unReadNotification: this.state.unReadNotification + 1
                    })
                }
            });
            socket.on('newChat', chat => {
                if (chat.to._id == this.props.userid && base_url+"chat/"+chat.from.username != window.location.href) {
                    toast.info(`${chat.from.username} sends you a message`)
                }
            });

        } else {
            this.props.logout()
        }
    }
    searchUser = e => {
        if(e.target.value.length) {
            Axios.post(`${api_url}searchUser`, {
                param: e.target.value
            }).then(res => {
                this.setState({
                    search: res.data.data !== null ? res.data.data.filter(o => o._source.username !== this.props.username) : [],
                })
            })
        }else{
            this.setState({
                search: []
            })
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
                                                })} to={{
                                                    pathname:`/profile/${this.props.username}`
                                                }}>My
                                                    Profile</Link></MDBDropdownItem>
                                                <MDBDropdownItem><Link onClick={() => this.setState({
                                                    isOpen: false
                                                })} to={"/addpost"}>Add Post</Link></MDBDropdownItem>
                                                <MDBDropdownItem onClick={this.onLogout}><a>logout</a></MDBDropdownItem>
                                            </MDBDropdownMenu>
                                        </MDBDropdown>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBDropdown>
                                            <MDBDropdownToggle nav caret>
                                                <div style={{display: "flex", position: "absolute"}}
                                                     onClick={() => {
                                                         this.setState({unReadNotification: 0});
                                                         Axios.post(`${api_url}readNotif`, {
                                                             token: this.props.token
                                                         }).catch(err => {
                                                             if (err.statusCode == 419) {
                                                                 toast.error("Session Expired");
                                                                 this.props.logout()
                                                             }
                                                         })
                                                     }}>
                                                    <MDBIcon icon={"bell"}/>
                                                    {
                                                        this.state.unReadNotification ?
                                                            <div
                                                                className={"notification-unread"}>{this.state.unReadNotification}</div>
                                                            :
                                                            null
                                                    }
                                                </div>
                                            </MDBDropdownToggle>
                                            <MDBDropdownMenu className="dropdown-default notification-list">
                                                {
                                                    this.state.notifications.map(o => {
                                                        return (
                                                            <div className={"notif-item pointer"}
                                                                 style={!o.read ? {backgroundColor: "lightgrey"} : {}}>
                                                                <div style={{float: "left"}}>
                                                                    <a href={o.post ? base_url + "post/" + o.post._id : base_url + "profile/" + o.user.username}
                                                                       target="_blank" style={{padding: 0}}>
                                                                        <p className={"pointer"}
                                                                           style={{fontWeight: 600}}>{o.user.username}</p>
                                                                        <p className={"pointer"}
                                                                           style={{fontWeight: 600}}>{o.message} <span
                                                                            style={{fontWeight: "lighter"}}>{moment(o.time).fromNow()}</span>
                                                                        </p>
                                                                    </a>
                                                                </div>
                                                                <div style={{
                                                                    float: "right",
                                                                    position: "absolute",
                                                                    left: "calc(100% - 60px)"
                                                                }}>
                                                                    {
                                                                        o.post ?
                                                                            <img src={post_url + o.post.image[0]}
                                                                                 width={60}
                                                                                 alt=""/>
                                                                            :
                                                                            <img
                                                                                src={profile_url + o.user.profilepicture}
                                                                                style={{borderRadius: '50%'}}
                                                                                width={60} alt=""/>
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
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
                          onClick={() => this.setState({chatMinimized: !this.state.chatMinimized},() => {
                              localStorage.setItem('chatMinimized',this.state.chatMinimized)
                          })}><MDBIcon
                        icon={this.state.chatMinimized ? "bars" : "times"}/></span>
                    <div className={"chat-container"} style={this.state.chatMinimized ? {width: 0, left: "100%"} : {}}>
                        <div>
                            <MDBInput type={"text"} ref={"finduser"} onChange={this.searchUser} labelClass={"colorwhite"} label={"Find User ..."} style={{width:140}}/>
                        </div>
                        <div style={{backgroundColor:"white",color:"black"}}>
                            {
                                this.state.search ?
                                    this.state.search.map(o => {
                                        return (
                                            <div onClick={() => this.props.history.push(`/chat/${o._source.username}`)}>
                                                <img
                                                    src={profile_url + o._source.profilepicture}
                                                    className={"mr-2"} width={30}
                                                    alt={o._source.username + "'s photo"}/>
                                                <span>{o._source.username}</span>
                                                <span></span>
                                            </div>
                                        )
                                    })
                                    :
                                    null
                            }
                        </div>
                        {
                            this.state.listChat.map(data => {
                                return (
                                    <div onClick={() => this.props.history.push('/chat/'+data.username)}>
                                        <img width={60} src={profile_url + data.profilepicture} alt=""/>
                                        <span>{data.username}</span>
                                        <span></span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <Switch>
                    <Route path={'/'} exact component={DashboardPage}/>
                    <Route path={'/login'} exact component={Login}/>
                    <Route path={'/register'} exact component={Register}/>
                    <Route path={'/profile/:profile'} component={withAuth(Profile)}/>
                    <Route path={'/addpost'} exact component={withAuth(AddPost)}/>
                    <Route path={'/chat/:username'} exact component={Chat}/>
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
        profilepicture: state.user.profilepicture,
        userid: state.user._id
    }
};
export default withRouter(
    connect(mapStateToProps, {login, logout, setloggedin})(App)
)
