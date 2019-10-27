import React from "react";
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBBtn,
    MDBIcon,
    MDBModalHeader,
    MDBModalBody,
    MDBModalFooter,
    MDBModal,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem, MDBDropdown
} from "mdbreact";
import axios from 'axios'
import {logout} from "../redux/actions";
import {connect} from 'react-redux'
import Post from './template/Post'
import Error404 from "./template/404";
import {api_url, followformat, post_url, profile_url} from "../global";
import moment from "moment";
import {toast} from "react-toastify";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            post: [],
            isLoading: true,
            notFound: false,
            follower: [],
            showFollower: false,
            showFollowing: false,
            postDetail: {
                user: {username: ""},
                comments: [],
                like: []
            },
            reportModal: false,
            reportOption: 0,
            reportOther: ""
        }
    }
    report = e => this.setState({reportModal: true});

    toggleReport = () => this.setState({reportModal: !this.state.reportModal});

    onClick = nr => {
        this.setState({
            reportOption: nr
        });
    };

    sendReport = e => {
        if (this.state.reportOption || (this.state.reportOption === 7 && !this.state.reportOther)) {
            let radioMeans = '';
            switch (this.state.reportOption) {
                case 1:
                    radioMeans = "Its spam or inappropriate";
                    break;
                case 2:
                    radioMeans = "Posting inappropriate content";
                    break;
                case 3:
                    radioMeans = "Posting spam";
                    break;
                case 4:
                    radioMeans = "Posting annoying content";
                    break;
                case 5:
                    radioMeans = "This profile pretending to be someone else";
                    break;
                case 6:
                    radioMeans = "Might be posting my intellectual property without authorization";
                    break;
                case 7:
                    radioMeans = this.state.reportOther;
                    break
            }
            axios.post(`${api_url}reportUser`, {
                token: this.props.token || localStorage.getItem('token'),
                report: radioMeans,
                userId: this.state.user._id
            }).then(r => toast.success("User reported! ")).catch(err => toast.error("You already report this user"))
            this.setState({
                reportModal: false
            })
        }
    };

    follow = () => {
        axios.post(`${api_url}follow`, {
            token: this.props.token,
            userid: this.props.userid,
            userTarget: this.state.user._id
        }).then(res => {
            // console.log(this.state.follower)
            this.setState({
                follower: [...this.state.follower, {
                    username: this.props.username,
                    profilepicture: this.props.profilepicture,
                    _id: this.props.userid
                }]
            })
            // console.log(this.state.follower)
        })
    };
    unFollow = () => {
        axios.post(`${api_url}unfollow`, {
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
    };
    followStatus = () => (
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
                                color={"primary"} onClick={this.follow}>Follow Back</MDBBtn>
                        :
                        <MDBBtn className={"waves-effect"}
                                color={"primary"} onClick={this.follow}> Follow </MDBBtn>
                )
    );

    componentDidMount() {
        const {profile} = this.props.match.params;
        if (this.props.token) {
            axios.post(`${api_url}getprofile`, {
                token: this.props.token,
                username: profile
            }).then(res => {
                this.setState({
                    user: res.data.user,
                    follower: res.data.user.follower,
                    post: res.data.post,
                    isLoading: false,
                });
            }).catch(err => {
                console.log(err);
                this.setState({
                    isLoading: false,
                    notFound: true
                })
            })
        } else {
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
                            this.state.notFound ?
                                <Error404/>
                                :
                                <div style={{paddingTop: 100}}>
                                    <MDBModal isOpen={this.state.reportModal} toggle={() => this.toggleReport()}>
                                        <MDBModalHeader toggle={this.toggle}>Report Post</MDBModalHeader>
                                        <MDBModalBody className={"text-left"}>
                                            <MDBContainer>
                                                What are your reason for reporting this post?
                                                <div className="custom-control custom-radio">
                                                    <input type="radio" className="custom-control-input" id="ck1"
                                                           name="report" onClick={() => this.onClick(1)}
                                                           checked={this.state.reportOption === 1 ? "checked" : ""}/>
                                                    <label className="custom-control-label" htmlFor="ck1">
                                                        Its spam or inappropriate
                                                    </label>
                                                </div>
                                                <div className="custom-control custom-radio">
                                                    <input type="radio" className="custom-control-input" id="ck2"
                                                           name="report" onClick={() => this.onClick(2)}
                                                           checked={this.state.reportOption === 2 ? "checked" : ""}/>
                                                    <label className="custom-control-label" htmlFor="ck2">
                                                        Posting inappropriate content
                                                    </label>
                                                </div>
                                                <div className="custom-control custom-radio">
                                                    <input type="radio" className="custom-control-input" id="ck3"
                                                           name="report" onClick={() => this.onClick(3)}
                                                           checked={this.state.reportOption === 3 ? "checked" : ""}/>
                                                    <label className="custom-control-label" htmlFor="ck3">
                                                        Posting spam
                                                    </label>
                                                </div>
                                                <div className="custom-control custom-radio">
                                                    <input type="radio" className="custom-control-input" id="ck4"
                                                           name="report" onClick={() => this.onClick(4)}
                                                           checked={this.state.reportOption === 4 ? "checked" : ""}/>
                                                    <label className="custom-control-label" htmlFor="ck4">
                                                        Posting annoying content
                                                    </label>
                                                </div>
                                                <div className="custom-control custom-radio">
                                                    <input type="radio" className="custom-control-input" id="ck5"
                                                           name="report" onClick={() => this.onClick(5)}
                                                           checked={this.state.reportOption === 5 ? "checked" : ""}/>
                                                    <label className="custom-control-label" htmlFor="ck5">
                                                        This profile pretending to be someone else
                                                    </label>
                                                </div>
                                                <div className="custom-control custom-radio">
                                                    <input type="radio" className="custom-control-input" id="ck6"
                                                           name="report" onClick={() => this.onClick(6)}
                                                           checked={this.state.reportOption === 6 ? "checked" : ""}/>
                                                    <label className="custom-control-label" htmlFor="ck6">
                                                        Might be posting my intellectual property without authorization
                                                    </label>
                                                </div>
                                                <div className="custom-control custom-radio">
                                                    <input type="radio" className="custom-control-input" id="ck11"
                                                           name="report" onClick={() => this.onClick(7)}
                                                           checked={this.state.reportOption === 7 ? "checked" : ""}/>
                                                    <label className="custom-control-label" htmlFor="ck11">
                                                        Others
                                                    </label>
                                                </div>
                                                {
                                                    this.state.reportOption === 7 ?
                                                        <div className="md-form form-group">
                                                            <div className="md-form">
                                        <textarea style={{paddingTop: 12}}
                                                  className={"md-textarea form-control"}
                                                  onBlur={e => !e.target.value.length && this.refs.report.classList.remove('active')}
                                                  onFocus={() => this.refs.report.classList.add('active')}
                                                  id={"report"}
                                                  onChange={e => this.setState({reportOther: e.target.value})}
                                                  value={this.state.caption}
                                        >
                                                {this.state.reportOther}
                                            </textarea>
                                                                <label htmlFor="report" ref={"report"}>Spesify Your Report here</label>
                                                            </div>
                                                        </div>
                                                        :
                                                        ""
                                                }
                                            </MDBContainer>
                                        </MDBModalBody>
                                        <MDBModalFooter>
                                            <MDBBtn color="secondary" onClick={() => this.toggleReport()}>Close</MDBBtn>
                                            <MDBBtn color="primary" onClick={this.sendReport}>Send Report</MDBBtn>
                                        </MDBModalFooter>
                                    </MDBModal>
                                    <MDBContainer>
                                        <MDBRow>
                                            <MDBCol size={3}>
                                                <img width={"100%"} src={profile_url + this.state.user.profilepicture}
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
                                                                return (
                                                                    <div className="comments mb-2"
                                                                         onClick={() => this.props.history.push("/profile/" + o.username)}>
                                                                        <img
                                                                            src={profile_url + o.profilepicture}
                                                                            className="round mr-3" alt="aligment"
                                                                            width="40" height="100%"/>
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

                                                <MDBModal isOpen={this.state.showFollowing}
                                                          toggle={() => this.setState({
                                                              showFollower: !this.state.showFollowing
                                                          })}>
                                                    <MDBModalHeader toggle={() => this.setState({
                                                        showFollowing: !this.state.showFollowing
                                                    })}>Following List</MDBModalHeader>
                                                    <MDBModalBody>
                                                        {
                                                            this.state.user.following.map(o => {
                                                                return (
                                                                    <div className="comments mb-2"
                                                                         onClick={() => this.props.history.push("/profile/" + o.username)}>
                                                                        <img
                                                                            src={profile_url + o.profilepicture}
                                                                            className="round mr-3" alt="aligment"
                                                                            width="40" height="100%"/>
                                                                        <div className="comment-info mr-5">
                                                                            <span
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
                                            <MDBCol size={6}>
                                                <div className="user_data">
                                                    <div>
                                                        <span
                                                            className={"profile_username"}>{this.state.user.username}</span>
                                                        {this.followStatus()}
                                                    </div>
                                                    <div>
                                                        <span className={"bolder"}>{this.state.post.length}</span> posts
                                                        <span onClick={() => {
                                                            if (this.state.follower.length) {
                                                                this.setState({showFollower: true})
                                                            }
                                                        }}
                                                              style={this.state.follower.length ? {cursor: "pointer"} : {}}><span
                                                            className={"bolder"}>{followformat(parseInt(this.state.follower.length))}</span> followers</span>
                                                        <span onClick={() => {
                                                            if (this.state.user.following.length) {
                                                                this.setState({showFollowing: true})
                                                            }
                                                        }}
                                                              style={this.state.user.following.length ? {cursor: "pointer"} : {}}><span
                                                            className={"bolder"}>{followformat(parseInt(this.state.user.following.length))}</span> following</span>
                                                    </div>
                                                </div>
                                                <div style={{position:"absolute",right:-75,top:0}}>
                                                {this.props.match.params.profile !== this.props.username ?
                                                    <MDBDropdown>
                                                        <MDBDropdownToggle caret color="primary">
                                                            <span className={"more-info"}>More</span>
                                                        </MDBDropdownToggle>
                                                        <MDBDropdownMenu right basic>
                                                            <MDBDropdownItem onClick={this.report}>Report</MDBDropdownItem>
                                                            <MDBDropdownItem onClick={async () => {
                                                                await navigator.clipboard.writeText(`${window.location.origin}/profile/${this.state.user.username}`);
                                                                toast.success('Copied!')
                                                            }}>Copy Profile Url</MDBDropdownItem>
                                                            <MDBDropdownItem onClick={() => {
                                                                this.props.history.push("/chat/"+this.state.user.username)
                                                            }}>Send Message</MDBDropdownItem>
                                                        </MDBDropdownMenu>
                                                    </MDBDropdown> : null}
                                                </div>
                                                <div>
                                                    {this.state.user.nickname || ""}
                                                </div>
                                                <div style={{whiteSpace: "pre-line"}}>
                                                    {this.state.user.bio || null}
                                                </div>
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow>
                                            <MDBModal size={"lg"} isOpen={this.state.showPost}
                                                      toggle={() => this.setState({
                                                          showPost: !this.state.showPost
                                                      })}>
                                                <MDBModalHeader toggle={() => this.setState({
                                                    showPost: !this.state.showPost
                                                })}>Show Post</MDBModalHeader>
                                                <MDBModalBody>
                                                    {
                                                        this.state.postDetail !== {} ?
                                                            <Post
                                                                _id={this.state.postDetail._id}
                                                                postusername={this.state.postDetail.user.username}
                                                                posttime={moment(this.state.postDetail.createdAt).fromNow()}
                                                                postprofilepicture={this.state.postDetail.user.profilepicture}
                                                                postcaption={this.state.postDetail.caption}
                                                                totalcomment={this.state.postDetail.comments.length}
                                                                likeslist={this.state.postDetail.like}
                                                                postlikes={this.state.postDetail.like.length}
                                                                likestatus={this.state.postDetail.like.some(e => e._id === this.props.userid)}
                                                                postimages={this.state.postDetail.image}
                                                                comments={this.state.postDetail.comments}
                                                                {...this.props}
                                                            />
                                                            :
                                                            ""
                                                    }
                                                </MDBModalBody>
                                                <MDBModalFooter>
                                                    <MDBBtn color="secondary" onClick={() => this.setState({
                                                        showPost: false
                                                    })}>Close</MDBBtn>
                                                </MDBModalFooter>
                                            </MDBModal>
                                            <MDBCol size={12}>
                                                <MDBRow>
                                                    {
                                                        this.state.post.length ?
                                                            this.state.post.map(o => {
                                                                return (
                                                                    <MDBCol size={4}>
                                                                        <div className={"post-thumbnail"}
                                                                             onClick={() => {
                                                                                 axios.post(`${api_url}showPost`, {
                                                                                     id: o._id
                                                                                 }).then(res => {
                                                                                     this.setState({
                                                                                         postDetail: res.data.post,
                                                                                         showPost: true,
                                                                                     })
                                                                                 });

                                                                             }
                                                                             }>
                                                                            <img
                                                                                src={post_url + o.image[0]}
                                                                                width={"100%"} alt={o.image}/>
                                                                            <div className={"post_desc"}>
                                                                            <span>
                                                                                <MDBIcon className={'pointer '} far
                                                                                         onClick={this.togglelike}
                                                                                         icon="heart"/> {o.like.length}
                                                                            </span>
                                                                                <span><MDBIcon className={"pointer"} fa
                                                                                               icon="comment"/> {o.comments.length} </span>
                                                                            </div>
                                                                        </div>
                                                                    </MDBCol>
                                                                )
                                                            })
                                                            :
                                                            <center><h1>This User Has no Post to be Shown</h1></center>
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
