import React, {Component} from 'react';
import {BrowserRouter, Route, withRouter, Switch} from "react-router-dom";
import {
    MDBBtn,
    MDBCollapse, MDBFormInline,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarToggler,
    MDBNavItem,
    MDBNavLink
} from "mdbreact";
import DashboardPage from './views/Dashboard'
import CariLoker from './views/CariLoker'
import PasangLoker from './views/PasangLoker'
import TipsLoker from './views/TipsLoker'
import Login from './views/Login'

const SomeComponent = withRouter(props => <App {...props}/>);

class App extends Component {
    constructor(a) {
        super(a);
        this.state = {
            isOpen: false,
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
            'pasang-iklan',
            'cari-loker',
            'tips-loker'
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
    }

    render() {
        return (
            <>
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
                            <MDBNavItem>
                                <MDBNavLink to={'/login'}><MDBBtn gradient={"purple"}>Login</MDBBtn></MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink to={'/register'}><MDBBtn gradient={"aqua"}>Register</MDBBtn></MDBNavLink>
                            </MDBNavItem>

                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
                <Switch>
                    <Route path={'/'} exact component={DashboardPage}/>
                    <Route path={'/cari-loker'} component={CariLoker}/>
                    <Route path={'/pasang-loker'} component={PasangLoker}/>
                    <Route path={'/tips-loker'} component={TipsLoker}/>
                    <Route path={'/login'} component={Login}/>
                </Switch>

            </>
        )
    }
}

export default withRouter(App)