import React from "react";
import {
    MDBBtn,
    MDBCarousel,
    MDBCarouselInner,
    MDBCarouselItem,
    MDBCol,
    MDBContainer,
    MDBDropdown,
    MDBDropdownItem,
    MDBDropdownMenu,
    MDBDropdownToggle,
    MDBIcon, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader,
    MDBRow,
    MDBView
} from "mdbreact";
import axios from 'axios'
import 'emoji-mart/css/emoji-mart.css'
import {Picker} from 'emoji-mart'
import Comment from './Comment'
import PostVideo from "./postvideo";
import {api_url, post_url, profile_url} from "../../global";
import {connect} from "react-redux";
import {toast} from "react-toastify";
import moment from "moment";

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showsticker: false,
            postlikes: props.postlikes,
            commentlike: false,
            likestatus: props.likestatus,
            comments: props.comments,
            tempComments:[],
            showFullComments: false,
            likeslist: props.likeslist
        };
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.togglesticker = this.togglesticker.bind(this)
    }

    handleOutsideClick(e) {
        // ignore clicks on the component itself
        if (document.querySelector('section.emoji-mart') !== null) {
            this.setState({
                showsticker: !document.querySelector('section.emoji-mart').contains(e.target) || e.key === "Escape"
            });
            this.togglesticker()
        }
    }


    togglelike = e => {
        if(this.props.loggedin) {
            const likelist = [...this.state.likeslist];
            if (e.target.classList.contains('fa')) {
                e.target.classList.remove('fa');
                e.target.classList.add('far');
                this.setState({
                    postlikes: this.state.postlikes - 1,
                    likeslist: likelist.filter(o => {return o === this.props.id})
                });
                axios.post(`${api_url}tooglelike`, {
                    token: this.props.token,
                    id: this.props._id,
                    action: "remove"
                }).catch(err => {
                    console.log(err)
                    likelist.push({
                        username: this.props.username,
                        profilepicture: localStorage.getItem('profile_picture')
                    })
                    this.setState({
                        postlikes: this.state.postlikes + 1,
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
                    postlikes: this.state.postlikes + 1,
                    likeslist: likelist
                });
                axios.post(`${api_url}tooglelike`, {
                    token: this.props.token,
                    id: this.props._id,
                    action: "add"
                }).catch(err => {
                    console.log(err)
                    this.setState({
                        postlikes: this.state.postlikes - 1,
                        likeslist: likelist.filter(o => {return o === this.props.id})
                    })
                })
            }
        }else{
            toast.error('You need to logged In');
        }
    };
    handlecomment = e => {
        if (e.keyCode === 13 && !e.shiftKey) {
            const comments = e.target.value.replace(/\n$/, "");
            e.target.value = "";
            axios.post(`${api_url}comments`, {
                value: comments,
                id: this.props._id,
                token: this.props.token,
            }).then(res => {
                this.setState({
                    tempComments: [...this.state.tempComments,{
                        _id: res.data.id,
                        comments: comments,
                        like: 0,
                        time: moment(),
                        user: {
                            username: this.props.username,
                            // profilepicture: this.props.profilepicture
                            profilepicture: localStorage.getItem('profile_picture')
                        }
                    }],
                    comments: [...this.state.comments,{
                        _id: res.data.id,
                        comments: comments,
                        like: 0,
                        time: moment(),
                        user: {
                            username: this.props.username,
                            profilepicture: localStorage.getItem('profile_picture')
                        }
                    }]
                })
            }).catch(err => {

            })
        }
    };
    addEmoji = e => {
        let emoji = e.native;
        this.refs.comment.value += emoji
    };
    togglesticker = () => {
        if (!this.state.showsticker) {
            // attach/remove event handler
            document.addEventListener('click', this.handleOutsideClick, false);
            document.onkeydown = this.handleOutsideClick
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
            document.onkeydown = this.handleOutsideClick
        }
        this.setState({
            showsticker: !this.state.showsticker
        })
    };

    render() {
        return (
            <div style={this.props.style}>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol size="12" className={"w-100"}>
                            <div className={"float-left flex"}>
                                <img src={profile_url + this.props.postprofilepicture}
                                     className="round mr-3"
                                     alt="aligment" width={60}/>
                                <div className={"user-info"}>
                                    <span className={"bolder pointer"}>{this.props.postusername}</span>
                                    <span>{this.props.posttime}</span>
                                </div>
                            </div>
                            <div className={"float-right con-moreinfo"}>
                                <MDBDropdown>
                                    <MDBDropdownToggle caret color="primary">
                                        <span className={"more-info"}>More</span>
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu right basic>
                                        <MDBDropdownItem>Report</MDBDropdownItem>
                                        <MDBDropdownItem>Copy Link</MDBDropdownItem>
                                        <MDBDropdownItem>Mute</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol size="12" className={"mt-3 w-100"}>
                            <MDBCarousel
                                activeItem={1}
                                length={this.props.postimages.length}
                                showControls={this.props.postimages.length > 1}
                                showIndicators={this.props.postimages.length > 1}
                                className="z-depth-1"
                                interval={false}
                                slide
                            >
                                <MDBCarouselInner>
                                    {this.props.postimages.map((o, id) => {
                                        return (
                                            <MDBCarouselItem itemId={id + 1}>
                                                <MDBView>
                                                    <img
                                                        className="d-block w-100"
                                                        src={this.state.postlikes < 0 ? o :post_url + o}
                                                        alt={`image ${id + 1}`}
                                                    />
                                                </MDBView>
                                            </MDBCarouselItem>
                                        )
                                    })}
                                </MDBCarouselInner>
                            </MDBCarousel>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
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
                <MDBContainer>
                    <MDBRow>
                        <MDBCol size={12}>
                            <div className="icon">
                                <MDBIcon className={'pointer '} fa={this.props.likestatus} far={!this.props.likestatus}
                                         onClick={this.togglelike} icon="heart"/>
                                <MDBIcon className={"pointer"} far icon="comment"/>
                            </div>
                            <div className="description">
                                {this.state.postlikes > 0 ?
                                    <span className="bolder pointer" onClick={() => this.setState({
                                        showlikes:true
                                    })}>{this.state.postlikes < 0 ?
                                        <span>&infin;</span> : this.state.postlikes} like{this.state.postlikes > 1 ? "s" : ""}</span>
                                    :
                                    null
                                }
                                <div className={"img_desc normalweight"}><span
                                    className={"bolder pointer normalweight"}>{this.props.postusername}</span> {this.props.postcaption}
                                </div>
                                {
                                    !this.state.showFullComments && this.props.totalcomment > 0 ? <div onClick={() => this.setState({
                                            showFullComments: true
                                        })} className={"pointer mt-2 mb-2"}>View {this.props.totalcomment > 10 ? "all" : ""} {this.props.totalcomment < 0 ?
                                        <span>&infin;</span> : this.props.totalcomment} Comment{this.props.totalcomment > 1 ? "s" : ""}
                                    </div>
                                    :
                                    null
                                }
                                <div id="comment-container" className={"mt-3"}>
                                    {this.state.showFullComments ?
                                        this.state.comments.map(o => {
                                            return <Comment data={o} postid={this.props._id}/>
                                        })
                                        :
                                        this.state.tempComments.map(o => {
                                            return <Comment data={o} postid={this.props._id}/>
                                        })
                                    }
                                    {this.props.loggedin ?
                                        <div className="comments mb-2">
                                            <img src={profile_url + this.props.postprofilepicture}
                                                 className="round mr-3"
                                                 alt="aligment" width={40} height={"100%"}
                                            />
                                            <div className="md-form usercomment w-100">
                                                {this.state.showsticker && <div className={"emoji-container"}>
                                                    <Picker set='emojione' title={"Choose Sticker"}
                                                            onSelect={this.addEmoji}/>
                                                </div>}
                                                <textarea style={{paddingTop: 0}}
                                                          className={"md-textarea comment-textarea form-control"}
                                                          id={"usercomment"}
                                                          onKeyUp={this.handlecomment}
                                                          ref={"comment"}
                                                          placeholder={"Enter Your Comments Here"}
                                                />
                                                <MDBBtn className={"sticker"}
                                                        onClick={this.togglesticker} size="lg" gradient="purple"><MDBIcon
                                                    far icon="laugh-beam"/></MDBBtn>
                                            </div>
                                        </div>
                                        :
                                        ""
                                    }
                                </div>
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        id: state.user._id,
        token: state.user.token,
        loggedin: state.user.loggedin,
        profilepicture: state.user.profilepicture,
        username: state.user.username,
    }
};

export default connect(mapStateToProps)(Post)
