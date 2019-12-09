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
    MDBInput,
    MDBRow,
    MDBView
} from "mdbreact";
import axios from 'axios'
import 'emoji-mart/css/emoji-mart.css'
import {Picker} from 'emoji-mart'
import Comment from './Comment'
import PostVideo from "./postvideo";
import ReactCursorPosition from 'react-cursor-position'
import {api_url, base_url, post_url, profile_url} from "../../global";
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
            tempComments: [],
            showFullComments: false,
            likeslist: props.likeslist,
            searchValue: null,
            search: null,
            searchLoading: false,
            reportModal: false,
            radio: 0,
            reportOther: ""
        };
    }

    handleOutsideClick = e => {
        // ignore clicks on the component itself
        if (document.querySelector('section.emoji-mart') !== null) {
            this.setState({
                showsticker: !document.querySelector('section.emoji-mart').contains(e.target) || e.key === "Escape"
            });
            this.togglesticker()
        }
    };


    togglelike = e => {
        if (this.props.loggedin) {
            const likelist = [...this.state.likeslist];
            if (document.getElementById('postlike').classList.contains('fa')) {
                document.getElementById('postlike').classList.remove('fa');
                document.getElementById('postlike').classList.add('far');
                this.setState({
                    postlikes: this.state.postlikes - 1,
                    likeslist: likelist.filter(o => {
                        return o === this.props.id
                    })
                });
                axios.post(`${api_url}tooglelike`, {
                    token: this.props.token,
                    id: this.props._id,
                    action: "remove"
                }).catch(err => {
                    console.log(err);
                    likelist.push({
                        username: this.props.username,
                        profilepicture: localStorage.getItem('profile_picture')
                    });
                    this.setState({
                        postlikes: this.state.postlikes + 1,
                        likeslist: likelist
                    })
                })
            } else {
                document.getElementById('postlike').classList.remove('far');
                document.getElementById('postlike').classList.add('fa');
                likelist.push({
                    username: this.props.username,
                    profilepicture: localStorage.getItem('profile_picture')
                });
                this.setState({
                    postlikes: this.state.postlikes + 1,
                    likeslist: likelist
                });
                axios.post(`${api_url}tooglelike`, {
                    token: this.props.token,
                    id: this.props._id,
                    action: "add"
                }).catch(err => {
                    console.log(err);
                    this.setState({
                        postlikes: this.state.postlikes - 1,
                        likeslist: likelist.filter(o => o === this.props.id)
                    })
                })
            }
        } else {
            toast.error('You need to logged In');
        }
    };
    handlecomment = e => {
        const arr = e.target.value.split(" ");
        if (e.keyCode === 13 && !e.shiftKey) {
            const comments = e.target.value.replace(/\n$/, "");
            e.target.value = "";
            axios.post(`${api_url}comments`, {
                value: comments,
                id: this.props._id,
                token: this.props.token,
            }).then(res => {
                this.setState({
                    tempComments: [...this.state.tempComments, {
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
                    comments: [...this.state.comments, {
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
        } else if (arr[arr.length - 1].charAt(0) == "@") {
            this.setState({
                searchingStatus: true,
                searchValue: arr[arr.length - 1].replace("@", "")
            })
        } else if (e.target.value.charAt(e.target.value.length - 1) == " ") {
            this.setState({
                searchValue: null,
                search: null,
                searchingStatus: false,
                searchLoading: false
            })
        }
        if (e.keyCode == 8) {
            if (arr[arr.length - 1].charAt(0) == "@") {
                this.setState({
                    searchValue: arr[arr.length - 1].replace("@", "").slice(0, -1),
                    searchingStatus: true
                })
            } else {
                this.setState({
                    searchingStatus: false
                })
            }
        }
        if (this.state.searchingStatus) {
            axios.post(`${api_url}searchUser`, {
                param: this.state.searchValue.replace("@", "")
            }).then(res => {
                this.setState({
                    search: res.data.data !== null ? res.data.data : [],
                })
            })
        }
    };
    componentDidMount() {
        console.log(this.props)
    }

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
    report = e => this.setState({reportModal: true});

    toggleRepost = () => this.setState({reportModal: !this.state.reportModal});

    onClick = nr => () => {
        this.setState({
            radio: nr
        });
    };
    sendReport = e => {
        if (this.state.radio || (this.state.radio === 11 && !this.state.reportOther)) {
            let radioMeans = '';
            switch (this.state.radio) {
                case 1:
                    radioMeans = "Its spam or inappropriate";
                    break;
                case 2:
                    radioMeans = "Nudity or pornography";
                    break;
                case 3:
                    radioMeans = "Hate speech or symbols";
                    break;
                case 4:
                    radioMeans = "Violence or threat violence";
                    break;
                case 5:
                    radioMeans = "Sale or promotion of firearms";
                    break;
                case 6:
                    radioMeans = "Sale or promotion of drugs";
                    break;
                case 7:
                    radioMeans = "Harassment or bullying";
                    break;
                case 8:
                    radioMeans = "Intellectual property violation";
                    break;
                case 9:
                    radioMeans = "Self injury";
                    break;
                case 10:
                    radioMeans = "False Information";
                    break;
                case 11:
                    radioMeans = this.state.reportOther;
                    break
            }
            axios.post(`${api_url}reportPost`, {
                token: this.props.token || localStorage.getItem('token'),
                report: radioMeans,
                postId: this.props._id
            }).then(r => toast.success("Post reported! ")).catch(err => toast.error("You already report this post"))
            this.setState({
                reportModal: false
            })
        }
    };

    render() {
        return (
            <div style={this.props.style}>
                <MDBModal isOpen={this.state.reportModal} toggle={() => this.toggleRepost()}>
                    <MDBModalHeader toggle={this.toggle}>Report Post</MDBModalHeader>
                    <MDBModalBody className={"text-left"}>
                        <MDBContainer>
                            What are your reason for reporting this post?
                            <div className="custom-control custom-radio">
                                <input type="radio" className="custom-control-input" id="ck1"
                                       name="report" onClick={this.onClick(1)}
                                       checked={this.state.radio === 1 ? "checked" : ""}/>
                                <label className="custom-control-label" htmlFor="ck1">
                                    Its spam or inappropriate
                                </label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input type="radio" className="custom-control-input" id="ck2"
                                       name="report" onClick={this.onClick(2)}
                                       checked={this.state.radio === 2 ? "checked" : ""}/>
                                <label className="custom-control-label" htmlFor="ck2">
                                    Nudity or pornography
                                </label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input type="radio" className="custom-control-input" id="ck3"
                                       name="report" onClick={this.onClick(3)}
                                       checked={this.state.radio === 3 ? "checked" : ""}/>
                                <label className="custom-control-label" htmlFor="ck3">
                                    Hate speech or symbols
                                </label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input type="radio" className="custom-control-input" id="ck4"
                                       name="report" onClick={this.onClick(4)}
                                       checked={this.state.radio === 4 ? "checked" : ""}/>
                                <label className="custom-control-label" htmlFor="ck4">
                                    Violence or threat violence
                                </label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input type="radio" className="custom-control-input" id="ck5"
                                       name="report" onClick={this.onClick(5)}
                                       checked={this.state.radio === 5 ? "checked" : ""}/>
                                <label className="custom-control-label" htmlFor="ck5">
                                    Sale or promotion of firearms
                                </label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input type="radio" className="custom-control-input" id="ck6"
                                       name="report" onClick={this.onClick(6)}
                                       checked={this.state.radio === 6 ? "checked" : ""}/>
                                <label className="custom-control-label" htmlFor="ck6">
                                    Sale or promotion of drugs
                                </label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input type="radio" className="custom-control-input" id="ck7"
                                       name="report" onClick={this.onClick(7)}
                                       checked={this.state.radio === 7 ? "checked" : ""}/>
                                <label className="custom-control-label" htmlFor="ck7">
                                    Harassment or bullying
                                </label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input type="radio" className="custom-control-input" id="ck8"
                                       name="report" onClick={this.onClick(8)}
                                       checked={this.state.radio === 8 ? "checked" : ""}/>
                                <label className="custom-control-label" htmlFor="ck8">
                                    Intellectual property violation
                                </label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input type="radio" className="custom-control-input" id="ck9"
                                       name="report" onClick={this.onClick(9)}
                                       checked={this.state.radio === 9 ? "checked" : ""}/>
                                <label className="custom-control-label" htmlFor="ck9">
                                    Self injury
                                </label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input type="radio" className="custom-control-input" id="ck10"
                                       name="report" onClick={this.onClick(10)}
                                       checked={this.state.radio === 10 ? "checked" : ""}/>
                                <label className="custom-control-label" htmlFor="ck10">
                                    False Information
                                </label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input type="radio" className="custom-control-input" id="ck11"
                                       name="report" onClick={this.onClick(11)}
                                       checked={this.state.radio === 11 ? "checked" : ""}/>
                                <label className="custom-control-label" htmlFor="ck11">
                                    Others
                                </label>
                            </div>
                            {
                                this.state.radio === 11 ?
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
                        <MDBBtn color="secondary" onClick={() => this.toggleRepost()}>Close</MDBBtn>
                        <MDBBtn color="primary" onClick={this.sendReport}>Send Report</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol size="12" className={"w-100"}>
                            <div className={"float-left flex"}>
                                <img src={profile_url + this.props.postprofilepicture}
                                     className="round mr-3"
                                     alt="aligment" style={{width: 60,height: 60}}
                                     onClick={() => this.props.history.push("/profile/" + this.props.postusername)}/>
                                <div className={"user-info"}>
                                    <span className={"bolder pointer"}
                                          onClick={() => this.props.history.push("/profile/" + this.props.postusername)}>{this.props.postusername}</span>
                                    <span>{this.props.posttime}</span>
                                </div>
                            </div>
                            <div className={"float-right con-moreinfo"}>
                                <MDBDropdown>
                                    <MDBDropdownToggle caret color="primary" className={"more-button"}>
                                        <span className={"more-info"}>More</span>
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu right basic>
                                        <MDBDropdownItem onClick={this.report}>Report</MDBDropdownItem>
                                        <MDBDropdownItem onClick={() => {
                                            console.log(this.props._id)
                                            navigator.clipboard.writeText(`http://localhost:3001/post/${this.props._id}`).then(() => {
                                                toast.success('Copied!')
                                            }).catch(err => toast.error(err));
                                        }}>Copy Link</MDBDropdownItem>
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
                                                    <ReactCursorPosition>
                                                        <img
                                                            onDoubleClick={this.togglelike}
                                                            className="d-block w-100"
                                                            src={this.state.postlikes < 0 ? o : post_url + o}
                                                            alt={`image ${id + 1}`}
                                                        />
                                                    </ReactCursorPosition>
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
                                return (
                                    <div className="comments mb-2"
                                         onClick={() => this.props.history.push("/profile/" + o.username)}><img
                                        src={profile_url + o.profilepicture}
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
                                         onClick={this.togglelike} id={"postlike"} icon="heart"/>
                                <MDBIcon className={"pointer"} far icon="comment"/>
                            </div>
                            <div className="description">
                                {this.state.postlikes > 0 ?
                                    <span className="bolder pointer" onClick={() => this.setState({
                                        showlikes: true
                                    })}>{this.state.postlikes < 0 ?
                                        <span>&infin;</span> : this.state.postlikes} like{this.state.postlikes > 1 ? "s" : ""}</span>
                                    :
                                    null
                                }
                                <div className={"img_desc normalweight"}><span
                                    className={"bolder pointer normalweight"}
                                    onClick={() => this.props.history.push("/profile/" + this.props.postusername)}>{this.props.postusername}</span> &nbsp;
                                    <span style={{whiteSpace: "pre-line"}} dangerouslySetInnerHTML={{
                                        __html: this.props.postcaption.split(" ").map(o => {
                                            switch (o.charAt(0)) {
                                                case "@":
                                                    return `<a href="${base_url}profile/${o.substring(1)}" target="_blank" style="color:blue"> ${o} </a>`;
                                                case "#":
                                                    return `<a href="${base_url}hashtag/${o.substring(1)}" target="_blank" style="color:blue"> ${o} </a>`;
                                                default:
                                                    return o
                                            }
                                        }).join(" ")
                                    }}>

                                </span>
                                </div>
                                {
                                    !this.state.showFullComments && this.props.totalcomment > 0 ?
                                        <div onClick={() => this.setState({
                                            showFullComments: true
                                        })}
                                             className={"pointer mt-2 mb-2"}>View {this.props.totalcomment > 10 ? "all" : ""} {this.props.totalcomment < 0 ?
                                            <span>&infin;</span> : this.props.totalcomment} Comment{this.props.totalcomment > 1 ? "s" : ""}
                                        </div>
                                        :
                                        null
                                }
                                <div id="comment-container" className={"mt-3"}>
                                    {this.state.showFullComments ?
                                        this.state.comments.map(o => {
                                            return <Comment {...this.props} refs={this.refs} data={o}
                                                            postid={this.props._id}/>
                                        })
                                        :
                                        this.state.tempComments.map(o => {
                                            return <Comment {...this.props} refs={this.refs} data={o}
                                                            postid={this.props._id}/>
                                        })
                                    }
                                    {this.props.loggedin ?
                                        <div className="comments mb-2">
                                            <img src={profile_url + this.props.profilepicture}
                                                 className="round mr-3"
                                                 alt="aligment" width={40} height={"100%"}
                                            />
                                            <div className="md-form usercomment w-100">
                                                {this.state.showsticker && <div className={"emoji-container"}>
                                                    <Picker set='emojione' title={"Choose Sticker"}
                                                            onSelect={this.addEmoji}/>
                                                </div>}
                                                {
                                                    this.state.searchingStatus ?
                                                        <div className={"autocomplete"}>
                                                            {
                                                                this.state.search ?
                                                                    this.state.search.map(o => {
                                                                        return (
                                                                            <div onClick={e => {
                                                                                const comment = this.refs.comment.value.split(" ");
                                                                                comment[comment.length - 1] = `@${o._source.username} `;
                                                                                this.refs.comment.value = comment.join(" ");
                                                                                this.setState({
                                                                                    searchingStatus: false,
                                                                                    search: []
                                                                                }, () => this.refs.comment.focus())
                                                                            }}>
                                                                                <img
                                                                                    src={profile_url + o._source.profilepicture}
                                                                                    className={"mr-2"} width={30}
                                                                                    alt={o._source.username + "'s photo"}/>
                                                                                <span>{o._source.username}</span>
                                                                            </div>
                                                                        )
                                                                    })
                                                                    :
                                                                    <div>
                                                                        <h1>No user founded</h1>
                                                                    </div>
                                                            }
                                                        </div>
                                                        :
                                                        null
                                                }
                                                <textarea style={{paddingTop: 0}}
                                                          className={"md-textarea comment-textarea form-control"}
                                                          id={"usercomment"}
                                                          onKeyUp={this.handlecomment}
                                                          ref={"comment"}
                                                          placeholder={"Enter Your Comments Here"}
                                                />
                                                <MDBBtn className={"sticker"}
                                                        onClick={this.togglesticker} size="lg"
                                                        gradient="purple"><MDBIcon
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
