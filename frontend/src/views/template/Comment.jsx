import {MDBIcon} from "mdbreact";
import React from "react";
import {api_url, profile_url} from "../../global";
import moment from "moment";
import {connect} from "react-redux";
import axios from 'axios'

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commentlike: props.data.like,
            likestatus:props.data.likestatus
        }
    }

    togglelike = e => {
        if(this.props.loggedin) {
            if (e.target.classList.contains('fa')) {
                e.target.classList.remove('fa');
                e.target.classList.add('far');
                this.setState({
                    commentlike: this.state.commentlike - 1
                })
                axios.post(`${api_url}toogleCommentLike`, {
                    token: this.props.token,
                    id: this.props._id,
                    postid: this.props.postid,
                    action: "remove"
                }).catch(err => {
                    console.log(err)
                    this.setState({
                        commentlike: this.state.commentlike + 1
                    })
                })
            } else {
                e.target.classList.remove('far');
                e.target.classList.add('fa');
                this.setState({
                    commentlike: this.state.commentlike + 1
                })
                axios.post(`${api_url}toogleCommentLike`, {
                    token: this.props.token,
                    id: this.props._id,
                    postid: this.props.postid,
                    action: "remove"
                }).catch(err => {
                    console.log(err)
                    this.setState({
                        commentlike: this.state.commentlike - 1
                    })
                })
            }
        }
    };

    render() {
        return (
            <div className="comments mb-2">
                <img src={profile_url+this.props.data.user.profilepicture} className="round mr-3"
                     alt="aligment" width={40} height={"100%"}/>
                <div className={"comment-info mr-5"}>
                    <span className={"bolder mr-2 pointer"}>{this.props.data.user.username}</span>
                    <span className={"normalweight"}>{this.props.data.comments}</span>
                    <div className={"mt-2"}>
                        <span>{moment(this.props.data.time).fromNow()}</span>
                        {
                            this.state.commentlike ?
                                <span className={"mr-3 ml-3"}>{this.state.commentlike < 0 ? <span>&infin;</span> : this.state.commentlike} Like{this.state.commentlike > 1 ? "s" : ""} </span>
                                :
                                ""
                        }
                        <span className={"pointer " + (this.state.commentlike ? "" : "ml-3")}>Reply</span>
                    </div>
                </div>
                <div>
                    <MDBIcon className={"pointer ml-2 like"}
                             onClick={this.togglelike}
                             fa={this.state.likestatus} far={!this.state.likestatus}
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
        loggedin: state.user.loggedin
    }
}
export default connect(mapToStateProps)(Comment)
