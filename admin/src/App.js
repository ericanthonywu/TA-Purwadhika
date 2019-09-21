import React from 'react';
import logo from './logo.svg';
import './App.css';
import {toast, ToastContainer} from "react-toastify";
import {Route, Switch, withRouter} from "react-router-dom";
import DashboardPage from "./views/DashboardPage";
import LoginPage from "./views/LoginPage";
import Error404 from "./views/404";
import {logout, setloggedin} from "./redux/actions";
import {connect} from "react-redux";
import UserPage from "./views/UserPage";
import {
    MDBCol,
    MDBCollapse, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle,
    MDBIcon,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarToggler,
    MDBNavItem,
    MDBNavLink
} from "mdbreact";

class App extends React.Component {
    state = {
        isOpen: false,
        minimizedSidebar: false
    };

    toggleCollapse = () => {
        this.setState({isOpen: !this.state.isOpen});
    };
    logout = e => {
        this.props.logout();
        this.props.history.push('/')
    };
    toggleSidebar = e => {
        this.setState({
            minimizedSidebar: !this.state.minimizedSidebar
        })
    };
    menuList = list => {
        return list.map(o => {
            return (
                <li onClick={e => {
                    this.props.history.push(o.url);
                    if (window.location.href.includes(o.url)) {
                        e.target.classList.add('active')
                    } else {
                        e.target.classList.remove('active')
                    }
                }} className={window.location.href.includes(o.url) ? "active" : ""}><MDBIcon
                    icon={o.icon}/> {!this.state.minimizedSidebar ? o.menu : ""}
                </li>
            )
        })
    };

    componentDidMount() {
        this.props.setloggedin({
            token: localStorage.getItem('token'),
            username: localStorage.getItem('username'),
            role: localStorage.getItem('role'),
            id: localStorage.getItem('id')
        });
    }

    render() {
        return (
            <>
                <ToastContainer enableMultiContainer position={toast.POSITION.TOP_RIGHT}/>
                {
                    localStorage.getItem('token') ?
                        <div className={"double-nav"}>
                            <div className={"sidebar"} style={this.state.minimizedSidebar ? {width: "5%"} : {}}>
                                <div className={"sidebar-container"}>
                                    <div className="brand">
                                        Sosmed Admin
                                    </div>
                                    <div className="listMenu">
                                        <ul>
                                            {this.menuList([
                                                {
                                                    url: '/dashboard',
                                                    icon: 'chart-line',
                                                    menu: 'Dashboard'
                                                },
                                                {
                                                    url: '/user',
                                                    icon: 'user',
                                                    menu: 'User'
                                                },
                                                {
                                                    url: '/post',
                                                    icon: 'image',
                                                    menu: 'Post'
                                                },
                                                {
                                                    url: '/report',
                                                    icon: 'flag',
                                                    menu: 'Report'
                                                },
                                                {
                                                    url: '/settings',
                                                    icon: 'cog',
                                                    menu: 'Settings'
                                                }
                                            ])}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className={"topbar"} style={this.state.minimizedSidebar ? {width: "95%"} : {}}>
                                <MDBNavbar color="default-color" dark expand="md">
                                    <MDBNavbarBrand>
                                        <strong onClick={this.toggleSidebar} className="white-text pointer">
                                            <MDBIcon className={"transition"}
                                                     icon={!this.state.minimizedSidebar ? 'times' : 'bars'}/>
                                        </strong>
                                    </MDBNavbarBrand>
                                    <MDBNavbarToggler onClick={this.toggleCollapse}/>
                                    <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                                        <MDBNavbarNav right>
                                            <MDBNavItem>
                                                <MDBNavLink className="waves-effect waves-light" to="#!">
                                                    <MDBIcon fab icon="bell"/>
                                                </MDBNavLink>
                                            </MDBNavItem>
                                            <MDBNavItem>
                                                <MDBDropdown>
                                                    <MDBDropdownToggle nav caret>
                                                        <img src="" width={30}
                                                             className={"round"} alt=""/>
                                                        <span
                                                            className={"ml-2"}>{this.props.username || localStorage.getItem('username')}</span>
                                                    </MDBDropdownToggle>
                                                    <MDBDropdownMenu right className="dropdown-default">
                                                        <MDBDropdownItem href="#!"
                                                                         onClick={this.logout}>Logout</MDBDropdownItem>
                                                    </MDBDropdownMenu>
                                                </MDBDropdown>
                                            </MDBNavItem>
                                        </MDBNavbarNav>
                                    </MDBCollapse>
                                </MDBNavbar>
                            </div>
                        </div>
                        :
                        ""
                }
                <div className="container-fluid">
                    <div className="row">
                        <MDBCol size={12} className={"zeropadding"}>
                            <Switch>
                                <Route path={"/"} exact component={LoginPage}/>
                                {
                                    localStorage.getItem('token') ?
                                        <>
                                            <Route path={'/dashboard'} exact component={DashboardPage}/>
                                            <Route path={'/user'} exact component={UserPage}/>
                                        </>
                                        :
                                        null
                                }
                                <Route component={Error404}/>
                            </Switch>
                        </MDBCol>
                    </div>
                </div>
            </>
        );
    }
}

const mapToStateProps = state => {
    return {
        username: state.user.username
    }
};
export default withRouter(connect(mapToStateProps, {setloggedin, logout})(App));
