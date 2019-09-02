import {MDBBtn, MDBIcon, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader} from "mdbreact";
import React from "react";
import {api_url, profile_url} from "../../global";
import moment from "moment";
import {connect} from "react-redux";
import axios from 'axios'

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commentlike: props.data.like.length,
            likeslist: props.data.like,
            showlikes: false
        }
    }

    togglelike = e => {
        if(this.props.loggedin) {
            const likelist = [...this.state.likeslist];
            if (e.target.classList.contains('fa')) {
                e.target.classList.remove('fa');
                e.target.classList.add('far');
                this.setState({
                    commentlike: this.state.commentlike - 1,
                    likeslist: likelist.filter(o => {return o === this.props.id})
                })
                axios.post(`${api_url}toogleCommentLike`, {
                    token: this.props.token,
                    id: this.props._id,
                    postid: this.props.postid,
                    action: "remove"
                }).catch(err => {
                    likelist.push({
                        username: this.props.username,
                        profilepicture: localStorage.getItem('profile_picture')
                    })
                    console.log(err)
                    this.setState({
                        commentlike: this.state.commentlike + 1,
                        likeslist: likelist
                    })
                })
            } else {
                e.target.classList.remove('far');
                e.target.classList.add('fa');
                likelist.push({
                    username: this.props.username,
                    profilepicture: localStorage.getItem('profile_picture')
                })
                this.setState({
                    commentlike: this.state.commentlike + 1,
                    likeslist: likelist
                })
                axios.post(`${api_url}toogleCommentLike`, {
                    token: this.props.token,
                    id: this.props._id,
                    postid: this.props.postid,
                    action: "add"
                }).catch(err => {
                    console.log(err)
                    this.setState({
                        commentlike: this.state.commentlike - 1,
                        likeslist: likelist.filter(o => {return o === this.props.id})
                    })
                })
            }
        }
    };

    render() {
        return (
            <div className="comments mb-2">
                <MDBModal isOpen={this.state.showlikes} toggle={() => this.setState({
                    showlikes: !this.state.showlikes
                })}>
                    <MDBModalHeader toggle={() => this.setState({
                        showlikes: !this.state.showlikes
                    })}>Likes List</MDBModalHeader>
                    <MDBModalBody>
                        {
                            this.state.likeslist.map(o => {
                                return  (
                                    <div className="comments mb-2"><img
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
                            showlikes: false
                        })}>Close</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
                <img src={profile_url+this.props.data.user.profilepicture} className="round mr-3"
                     alt="aligment" width={40} height={"100%"}/>
                <div className={"comment-info mr-5"}>
                    <span className={"bolder mr-2 pointer"}>{this.props.data.user.username}</span>
                    <span className={"normalweight"}>{this.props.data.comments}</span>
                    <div className={"mt-2"}>
                        <span>{moment(this.props.data.time).fromNow()}</span>
                        {
                            this.state.commentlike > 0 ?
                                <span className={"mr-3 ml-3 pointer"} onClick={() => this.setState({
                                    showlikes: true
                                })}>{this.state.commentlike < 0
                                    ? <span>&infin;</span> : this.state.commentlike} Like{this.state.commentlike > 1 ? "s" : ""} </span>
                                :
                                ""
                        }
                        <span className={"pointer " + (this.state.commentlike > 0 ? "" : "ml-3")}>Reply</span>
                    </div>
                </div>
                <div>
                    <MDBIcon className={"pointer ml-2 like"}
                             onClick={this.togglelike}
                             fa={this.state.likeslist.some(e => e._id === this.props.userid)} far={!this.state.likeslist.some(e => e._id === this.props.userid)}
                             icon="heart"
                    />
                </div>
            </div>
        );
    }
}
const mapToStateProps = state => {
    return {
        token: state.user.token,
        loggedin: state.user.loggedin,
        userid: state.user._id,
        username: state.user.username
    }
}
export default connect(mapToStateProps)(Comment)
