import React, {Component} from "react";
import Error404 from "./404";
import axios from 'axios'
import {api_url} from "../../global";
import {connect} from 'react-redux'
import {updateToken, logout} from "../../redux/actions";
import {toast} from "react-toastify";

export const withAuth = ComponentToProtect => {
    class CheckToken extends Component {
        constructor(a) {
            super(a);
        }

        componentWillReceiveProps(nextProps, nextContext)  {
            if (nextProps.token) {
                axios.post(`${api_url}checktoken`, {
                    token: nextProps.token
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
                        nextProps.logout();
                        this.setState({loggedin: false})
                    })
            }else{
                nextProps.logout();
                this.setState({loggedin: false})
            }
        }
        // componentWillMount() {
        //     if (this.props.token) {
        //         axios.post(`${api_url}checktoken`, {
        //             token: this.props.token
        //         }).then(async res => {
        //             const loadData = () => {
        //                 this.props.updateToken({
        //                     token: res.data.token
        //                 });
        //                 localStorage.setItem('token', res.data.token);
        //             };
        //             await loadData();
        //             this.setState({
        //                 loggedin: true
        //             })
        //         })
        //             .catch(err => {
        //                 this.props.logout();
        //                 this.setState({loggedin: false})
        //             })
        //     }else{
        //         this.props.logout();
        //         this.setState({loggedin: false})
        //     }
        // }

        componentWillMount() {
            this.setState({
                loggedin: localStorage.getItem('token')
            })
        }

        // async checktoken(){
        //     if (this.props.token) {
        //         axios.post(`${api_url}checktoken`, {
        //             token: this.props.token
        //         }).then(async res => {
        //             const loadData = () => {
        //                 this.props.updateToken({
        //                     token: res.data.token
        //                 });
        //                 localStorage.setItem('token', res.data.token);
        //             };
        //             await loadData();
        //             return true
        //         })
        //             .catch(async err => {
        //                 await this.props.logout();
        //                 return false;
        //             })
        //     }else{
        //         await this.props.logout();
        //         return false
        //     }
        // }

        render() {
            // new Promise((resolve, reject) => {
            //     resolve(this.checktoken())
            // }).then(check => {
                if (this.state.loggedin) {
                    return (
                        <React.Fragment>
                            <ComponentToProtect {...this.props} />
                        </React.Fragment>
                    );
                } else {
                    return <Error404/>
                }

            // });
        }
    }

    const mapStateToProps = state => ({
        token: state.user.token
    });

    return connect(mapStateToProps, {updateToken, logout})(CheckToken)
};
