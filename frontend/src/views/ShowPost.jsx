import React from 'react'
import Post from "./template/Post";
import axios from 'axios'
import {api_url} from "../global";
import Error404 from "./template/404";
import moment from "moment";
import {connect} from 'react-redux'
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";

class ShowPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {},
            isLoading: true,
            notFound: false
        }
    }

    componentDidMount() {
        axios.post(`${api_url}showPost`, {
            id: this.props.match.params.postid,
        }).then(res => {
            this.setState({
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
    }

    render() {
        return (
            <div>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol size={9} style={{margin:"auto",paddingTop: 100}}>
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
                                        this.state.notFound ?
                                            <Error404/>
                                            :
                                            <Post
                                                _id={this.state.post._id}
                                                postusername={this.state.post.user.username}
                                                posttime={moment(this.state.post.createdAt).fromNow()}
                                                postprofilepicture={this.state.post.user.profilepicture}
                                                postcaption={this.state.post.caption}
                                                totalcomment={this.state.post.comments.length}
                                                likeslist={this.state.post.like}
                                                postlikes={this.state.post.like.length}
                                                likestatus={this.state.post.like.some(e => e._id === this.props.id)}
                                                postimages={this.state.post.image}
                                                comments={this.state.post.comments}
                                                {...this.props}
                                            />
                                    )
                            }
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>

            </div>
        )
    }
}

const mapToStateProps = state => {
    return {
        id: state.user._id
    }
}

export default connect(mapToStateProps)(ShowPost)
