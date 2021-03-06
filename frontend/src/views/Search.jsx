import React from 'react'
import axios from 'axios'
import {api_url, profile_url} from "../global";
import {connect} from "react-redux";
import {MDBBtn} from "mdbreact";
import Error404 from "./template/404";


class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            param: ""
        }
    }


    componentDidMount() {
        const param = this.props.location.search.split('=')[0] === "?user" ? this.props.location.search.split('=')[1] : null;
        this.setState({
            param: param
        });
        if (param) {
            axios.post(`${api_url}searchUser`, {
                param: param
            }).then(res => {
                this.setState({
                    data: res.data.data
                })
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const param = this.props.location.search.split('=')[0] === "?user" ? this.props.location.search.split('=')[1] : null;
        // console.log(prevProps.location.pathname)
        if(param) {
            if (prevProps.location.search !== this.props.location.search) {
                this.setState({
                    param: param
                });
                axios.post(`${api_url}searchUser`, {
                    param: param
                }).then(res => {
                    this.setState({
                        data: res.data.data
                    })
                })
            }
        }
    }

    render() {
        return (
            <div style={{paddingTop:100}}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10" style={{margin:"auto"}}>
                            {
                                this.state.data.length ?
                                this.state.data.map(o => {
                                    return (
                                        <div className="search-container">
                                            <div className="user-img" onClick={() => this.props.history.push('/profile/'+o._source.username)}>
                                                <img src={profile_url+o._source.profilepicture} width={"100%"} alt=""/>
                                            </div>
                                            <div className="user-desc">
                                                {
                                                    o._source.username === this.props.username
                                                        ?
                                                        <MDBBtn className={"waves-effect"} outline
                                                                color={"elegant"} onClick={() => this.props.history.push('/updateProfile')}> Edit
                                                            Profile </MDBBtn>
                                                        :
                                                        o._source.follower.length && o._source.follower.some(e => e._id === this.props.userid) ?
                                                            <MDBBtn className={"waves-effect"} outline
                                                                    color={"primary"} onClick={() => this.props.history.push('/profile/'+o._source.username)}> Following </MDBBtn> :
                                                            (
                                                                o._source.user && o._source.user.following.some(e => e._id === this.props.userid)
                                                                    ?
                                                                    <MDBBtn className={"waves-effect"}
                                                                            color={"primary"} onClick={() => this.props.history.push('/profile/'+o._source.username)}>Follow Back</MDBBtn>
                                                                    :
                                                                    <MDBBtn className={"waves-effect"}
                                                                            color={"primary"} onClick={() => this.props.history.push('/profile/'+o._source.username)}> Follow </MDBBtn>
                                                            )
                                                }
                                                <p onClick={() => this.props.history.push('/profile/'+o._source.username)}>{o._source.username}</p>
                                                <p onClick={() => this.props.history.push('/profile/'+o._source.username)}>{o._source.nickname} </p>
                                            </div>
                                        </div>
                                    )
                                })
                                    :
                                    <Error404/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapToStateProps = state => {
    return {
        token: state.user.token,
        username: state.user.username
    }
};
export default connect(mapToStateProps)(Search)
