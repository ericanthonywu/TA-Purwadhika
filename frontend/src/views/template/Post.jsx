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
    MDBIcon,
    MDBRow,
    MDBView
} from "mdbreact";
import axios from 'axios'
import 'emoji-mart/css/emoji-mart.css'
import {Picker} from 'emoji-mart'
import Comment from './Comment'
import PostVideo from "./postvideo";

export default class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            showsticker: false,
            postlikes: props.postlikes,
            commentlike: false,
            likestatus: props.likestatus
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
        if (e.target.classList.contains('fa')) {
            e.target.classList.remove('fa');
            e.target.classList.add('far');
            this.setState({
                postlikes: this.state.postlikes - 1
            })
        } else {
            e.target.classList.remove('far');
            e.target.classList.add('fa');
            this.setState({
                postlikes: this.state.postlikes + 1
            })
        }
    };
    handlecomment = e => {
        if (e.keyCode == 13 && !e.shiftKey) {
            axios.post("http://localhost:3000/api/comments", {
                value: e.target.value,
                id: this.props.id
            }).then(res => {

            }).catch(tes => {

            });
            this.setState({
                comment: "",
            })
        } else {
            this.setState({
                comment: e.target.value,
            })
        }
    };
    addEmoji = e => {
        let emoji = e.native;
        this.setState({
            comment: this.state.comment += emoji,
        });
        console.log(this.state.comment)
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
    showPost = () => {

    };

    render() {
        return (
            <div style={this.props.style}>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol size="12" className={"w-100"}>
                            <div className={"float-left flex"}>
                                <img src={this.props.postprofilepicture}
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
                                                        src={o}
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
                <MDBContainer>
                    <MDBRow>
                        <MDBCol size={12}>
                            <div className="icon">
                                <MDBIcon className={'pointer '} fa={this.props.likestatus} far={!this.props.likestatus}
                                         onClick={this.togglelike} icon="heart"/>
                                <MDBIcon className={"pointer"} far icon="comment"/>
                            </div>
                            <div className="description">
                                <span className="bolder">{this.state.postlikes < 0 ?
                                    <span>&infin;</span> : this.state.postlikes} likes</span>
                                <div className={"img_desc normalweight"}><span
                                    className={"bolder pointer normalweight"}>{this.props.postusername}</span> {this.props.postcaption}
                                </div>
                                <div className={"pointer mt-2 mb-2"}>View all {this.props.totalcomment < 0 ?
                                    <span>&infin;</span> : this.props.totalcomment} Comments
                                </div>
                                <div id="comment-container">
                                    {this.props.comments.map(o => {
                                        return <Comment data={o}/>
                                    })}
                                    <div className="comments mb-2">
                                        <img src={"https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg"}
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
                                                      onChange={this.handlecomment}
                                                      value={this.state.comment}
                                                      placeholder={"Enter Your Comments Here"}
                                            >
                                                {this.state.comment}
                                            </textarea>
                                            <MDBBtn className={"sticker"}
                                                    onClick={this.togglesticker} size="lg" gradient="purple"><MDBIcon
                                                far icon="laugh-beam"/></MDBBtn>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        );
    }

};
