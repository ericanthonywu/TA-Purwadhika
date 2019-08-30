import React, {Component} from "react";
import Error404 from "./404";
import axios from 'axios'
import {api_url} from "../../global";
import {connect} from 'react-redux'
import {updateToken, logout} from "../../redux/actions";

export const withAuth = ComponentToProtect => {
    const mapStateToProps = state => ({
        token: state.user.token
    });

    class CheckToken extends Component {
        constructor(a) {
            super(a);
            this.state = {
                loggedin: true
            }
        }

        // componentWillReceiveProps(nextProps, nextContext)  {
        //     if (nextProps.token) {
        //         axios.post(`${api_url}checktoken`, {
        //             token: nextProps.token
        //         })
        //             .then(async res => {
        //                 const loadData = () => {
        //                     this.props.updateToken({
        //                         token: res.data.token
        //                     });
        //                     localStorage.setItem('token', res.data.token);
        //                 };
        //                 await loadData();
        //                 this.setState({
        //                     loggedin: true
        //                 })
        //             })
        //             .catch(err => {
        //                 nextProps.logout();
        //                 this.setState({loggedin: false})
        //             })
        //     }else{
        //         nextProps.logout();
        //         this.setState({loggedin: false})
        //     }
        // }
        componentDidMount() {
            if (this.props.token) {
                axios.post(`${api_url}checktoken`, {
                    token: this.props.token
                })
                    .then(async res => {
                        const loadData = () => {
                            this.props.updateToken({
                                token: res.data.token
                            });
                            localStorage.setItem('token', res.data.token);
                        };
                        await loadData();
                        this.setState({
                            loggedin: true
                        })
                    })
                    .catch(err => {
                        this.props.logout();
                        this.setState({loggedin: false})
                    })
            }else{
                this.props.logout();
                this.setState({loggedin: false})
            }
        }

        render() {
            if (this.state.loggedin) {
                return (
                    <React.Fragment>
                        <ComponentToProtect {...this.props} />
                    </React.Fragment>
                );
            } else {
                return <Error404/>
            }
        }
    }

    return connect(mapStateToProps, {updateToken, logout})(CheckToken)
};
