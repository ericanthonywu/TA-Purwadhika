import React from "react";
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBBtn, MDBIcon, MDBModalHeader, MDBModalBody, MDBModalFooter, MDBModal
} from "mdbreact";
import axios from 'axios'
import {logout} from "../redux/actions";
import {connect} from 'react-redux'
import Post from './template/Post'
import Error404 from "./template/404";
import {api_url, followformat, post_url, profile_url} from "../global";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            post: [],
            isLoading: true,
            notFound: false,
            follower:[],
            showFollower: false,
            showFollowing: false
        }
    }

    follow = () => {
        axios.post(`${api_url}follow`,{
            token: this.props.token,
            userid: this.props.userid,
            userTarget: this.state.user._id
        }).then(res => {
            // console.log(this.state.follower)
            this.setState({
                follower: [...this.state.follower,{
                    username: this.props.username,
                    profilepicture: this.props.profilepicture,
                    _id: this.props.userid
                }]
            })
            // console.log(this.state.follower)
        })
    }
    unFollow = () =>{
        axios.post(`${api_url}unfollow`,{
            token: this.props.token,
            userid: this.props.userid,
            userTarget: this.state.user._id
        }).then(res => {
            this.setState({
                follower: this.state.follower.filter(o => {
                    return o._id !== this.props.userid
                })
            })
        })
    }
    followStatus = () => {
        return (
            this.props.match.params.profile === this.props.username
                ?
                <MDBBtn className={"waves-effect"} outline
                        color={"elegant"} onClick={() => this.props.history.push('/updateProfile')}> Edit
                    Profile </MDBBtn>
                :
                this.state.follower.some(e => e._id === this.props.userid) ?
                    <MDBBtn className={"waves-effect"} outline
                            color={"primary"} onClick={this.unFollow}> Following </MDBBtn> :
                    (
                        this.state.user.following.some(e => e._id === this.props.userid)
                            ?
                            <MDBBtn className={"waves-effect"}
                                    color={"primary"} onClick={this.follow}> Following
                                You </MDBBtn>
                            :
                            <MDBBtn className={"waves-effect"}
                                    color={"primary"} onClick={this.follow}> Follow </MDBBtn>
                    )
        )
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
                    follower: res.data.user.follower,
                    post: res.data.post,
                    isLoading: false,
                })
                console.log(this.state.follower)
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
                                                <MDBModal isOpen={this.state.showFollower} toggle={() => this.setState({
                                                    showFollower: !this.state.showFollower
                                                })}>
                                                    <MDBModalHeader toggle={() => this.setState({
                                                        showFollower: !this.state.showFollower
                                                    })}>Followers List</MDBModalHeader>
                                                    <MDBModalBody>
                                                        {
                                                            this.state.follower.map(o => {
                                                                return  (
                                                                    <div className="comments mb-2" onClick={() => this.props.history.push("/profile/"+o.username)}><img
                                                                        src={profile_url+o.profilepicture}
                                                                        className="round mr-3" alt="aligment" width="40" height="100%"/>
                                                                        <div className="comment-info mr-5"><span
                                                                            className="bolder mr-2 pointer">{o.username}</span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </MDBModalBody>
                                                    <MDBModalFooter>
                                                        <MDBBtn color="secondary" onClick={() => this.setState({
                                                            showFollower: false
                                                        })}>Close</MDBBtn>
                                                    </MDBModalFooter>
                                                </MDBModal>

                                                <MDBModal isOpen={this.state.showFollowing} toggle={() => this.setState({
                                                    showFollower: !this.state.showFollowing
                                                })}>
                                                    <MDBModalHeader toggle={() => this.setState({
                                                        showFollowing: !this.state.showFollowing
                                                    })}>Followers List</MDBModalHeader>
                                                    <MDBModalBody>
                                                        {
                                                            this.state.user.following.map(o => {
                                                                return  (
                                                                    <div className="comments mb-2" onClick={() => this.props.history.push("/profile/"+o.username)}><img
                                                                        src={profile_url+o.profilepicture}
                                                                        className="round mr-3" alt="aligment" width="40" height="100%"/>
                                                                        <div className="comment-info mr-5"><span
                                                                            className="bolder mr-2 pointer">{o.username}</span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </MDBModalBody>
                                                    <MDBModalFooter>
                                                        <MDBBtn color="secondary" onClick={() => this.setState({
                                                            showFollowing: false
                                                        })}>Close</MDBBtn>
                                                    </MDBModalFooter>
                                                </MDBModal>
                                            </MDBCol>
                                            <MDBCol size={6} className={"user_data"}>
                                                <div>
                                                    <span className={"profile_username"}>{this.state.user.username}</span>
                                                    {
                                                        this.followStatus()
                                                    }
                                                </div>
                                                <div>
                                                    <span className={"bolder"}>{this.state.post.length}</span> posts
                                                    <span onClick={() => {
                                                        if(this.state.follower.length){
                                                            this.setState({showFollower: true})
                                                        }
                                                    }} style={this.state.follower.length ? {cursor:"pointer"}:{}}><span className={"bolder"} >{followformat(parseInt(this.state.follower.length))}</span> followers</span>
                                                    <span onClick={() => {
                                                       if(this.state.user.following.length){
                                                           this.setState({showFollowing: true})
                                                       }
                                                    }} style={this.state.user.following.length ? {cursor:"pointer"}:{}}><span className={"bolder"}>{followformat(parseInt(this.state.user.following.length))}</span> following</span>
                                                </div>
                                                <div>
                                                    {this.state.user.nickname || ""}
                                                </div>
                                                <div style={{whiteSpace:"pre-line"}}>
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
        userid: state.user._id,
        profilepicture: state.user.profilepicture
    }
};
export default connect(mapToStateProps, {logout})(Profile)
