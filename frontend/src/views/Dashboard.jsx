import React from "react";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
import {connect} from "react-redux";
import Post from './template/Post'
import axios from 'axios'
import {api_url, backend_url} from "../global";
import moment from "moment";
import socketio from "socket.io-client";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            pagination: 0,
            post: []
        }
    }

    componentDidMount() {
        const socket = socketio(backend_url,{
            query: {
                token:localStorage.getItem('token'),
                offset: this.state.pagination
            }
        });
        socket.emit('get post',{
            token: localStorage.getItem('token'),
            offset: this.state.pagination
        });
        socket.on('show post',post => {

        })
        axios.post(`${api_url}dashboard`, {
            token: localStorage.getItem('token'),
            offset: this.state.pagination
        }).then(res => {
            this.setState({
                loading: false,
                post: res.data.post
            });
        }).catch(err => {
            if(err.data.message === "jwt expired"){
                alert('Session Expired');
                this.props.history.push('/')
            }else {
                alert('Error Connection, Please try again');

            }
        });
        document.addEventListener('scroll', this.infiniteScroll)
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.infiniteScroll);
    }

    infiniteScroll = (e) => {
        // console.log(e.target.scrollingElement.)
        if ((e.target.scrollingElement.scrollHeight - e.target.scrollingElement.scrollTop) === e.target.scrollingElement.clientHeight) { //Mentok di bawah
            this.setState({
                pagination: this.state.pagination + 10
            });
        }

    };

    render() {
        return (
            <div style={{paddingTop: 100}} id={'scroll-div'} onScroll={this.infiniteScroll}>
                {this.state.loading
                    ?
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
                    <MDBContainer>
                        <MDBRow>
                            <MDBCol size={9} className={"home_dashboard"}>
                                <div className={"post"}>
                                    {
                                        this.state.post.length
                                            ?
                                        this.state.post.map(o => {
                                            return (
                                                <Post
                                                    id={o.id}
                                                    postusername={o.user.username}
                                                    posttime={moment(o.createdAt).fromNow()}
                                                    postprofilepicture={o.user.profilepicture}
                                                    postcaption={o.caption}
                                                    totalcomment={o.comments.length}
                                                    postlikes={o.like.length}
                                                    likestatus={o.like.includes(this.props.id)}
                                                    postimages={o.image}
                                                    comments={o.comments}
                                                />
                                            )
                                        })
                                            :
                                        <h1>Upload Post to be shared to your friends! :)</h1>
                                    }
                                </div>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.user.token,
        id: state.user._id
    }
};
export default connect(mapStateToProps)(Dashboard)
