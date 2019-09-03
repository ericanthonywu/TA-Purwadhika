import React from "react";
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBBtn, MDBIcon
} from "mdbreact";
import axios from 'axios'
import {logout} from "../redux/actions";
import {connect} from 'react-redux'
import Post from './template/Post'
import Error404 from "./template/404";
import {api_url, post_url, profile_url} from "../global";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            post: [],
            isLoading: true,
            notFound: false
        }
    }


    componentDidMount() {
        const {profile} = this.props.match.params;
        if(this.props.token){
            axios.post(`${api_url}getprofile`, {
                token: this.props.token,
                username: profile
            }).then(res => {
                this.setState({
                    user: res.data.user,
                    post: res.data.post,
                    isLoading: false
                })
            }).catch(err => {
                console.log(err);
                this.setState({
                    isLoading: false,
                    notFound: true
                })
            })
        }else{
            this.setState({
                isLoading: false,
                notFound: true
            })
        }
    }

    render() {
        return (
            <>
                {
                    this.state.isLoading ?
                        <div className={"container-loading"}>
                            <div className="spinner-grow text-warning" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow text-default" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                        :
                        (
                            this.state.notFound  ?
                                <Error404/>
                                :
                                <div style={{paddingTop: 100}}>
                                    <MDBContainer>
                                        <MDBRow>
                                            <MDBCol size={3}>
                                                <img width={"100%"} src={profile_url+this.state.user.profilepicture}
                                                     className={"round-img"} alt=""/>
                                            </MDBCol>
                                            <MDBCol size={1}>

                                            </MDBCol>
                                            <MDBCol size={6} className={"user_data"}>
                                                <div>
                                                    <span className={"profile_username"}>{this.state.user.username}</span>
                                                    {
                                                        this.props.match.params.profile === this.props.username
                                                            ?
                                                            <MDBBtn className={"waves-effect"} outline
                                                                    color={"elegant"}> Edit
                                                                Profile </MDBBtn>
                                                            :
                                                            this.state.user.follower.includes(this.props.userid) ?
                                                                <MDBBtn className={"waves-effect"} outline
                                                                        color={"primary"}> Following </MDBBtn> :
                                                                (
                                                                    this.state.user.following.includes(this.props.userid)
                                                                        ?
                                                                        <MDBBtn className={"waves-effect"}
                                                                                color={"primary"}> Following
                                                                            You </MDBBtn>
                                                                        :
                                                                        <MDBBtn className={"waves-effect"}
                                                                                color={"primary"}> Follow </MDBBtn>
                                                                )
                                                    }
                                                </div>
                                                <div>
                                                    <span className={"bolder"}>{this.state.post.length}</span> posts
                                                    <span className={"bolder"}>{this.state.user.follower.length}</span> followers
                                                    <span className={"bolder"}>{this.state.user.following.length}</span> following
                                                </div>
                                                <div>
                                                    {this.state.user.nickname || ""}
                                                </div>
                                                <div>
                                                    {this.state.user.bio || null}
                                                </div>
                                            </MDBCol>
                                            <MDBCol size={1}>

                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow>
                                            <MDBCol size={10}>
                                                <MDBRow>
                                                    {
                                                        this.state.post.map(o => {
                                                            return (
                                                                <MDBCol size={4}>
                                                                    <div className={"post-thumbnail"} onClick={() => this.props.history.push(`/post/${o._id}`)}>
                                                                        <img
                                                                            src={post_url+o.image[0]}
                                                                            width={"100%"} alt={o.image}/>
                                                                        <div className={"post_desc"}>
                                                                            <span>
                                                                                <MDBIcon className={'pointer '} far
                                                                                         onClick={this.togglelike} icon="heart"/> {o.like.length}
                                                                            </span>
                                                                            <span><MDBIcon className={"pointer"} fa icon="comment"/> {o.comments.length} </span>
                                                                        </div>
                                                                    </div>
                                                                </MDBCol>
                                                            )
                                                        })
                                                    }
                                                </MDBRow>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBContainer>
                                </div>
                        )

                }
            </>
        );
    }
}

const mapToStateProps = state => {
    return {
        token: state.user.token,
        username: state.user.username,
        userid: state.user.id
    }
};
export default connect(mapToStateProps, {logout})(Profile)
