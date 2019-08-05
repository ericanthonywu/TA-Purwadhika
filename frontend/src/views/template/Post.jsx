import React from "react";
import {
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
    MDBView,
    MDBBtn
} from "mdbreact";
import axios from 'axios'
import 'emoji-mart/css/emoji-mart.css'
import {Picker} from 'emoji-mart'

export default class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            id: "",
            showsticker: false
        }
    }

    togglelike = e => {
        e.target.classList.toggle('fa')
    };
    handlecomment = e => {
        if (e.keyCode == 13 && !e.shiftKey) {
            axios.post("http://localhost:3000/api/comments", {
                value: e.target.value,
                id: e.target.dataset.id
            }).then(res => {

            }).catch(tes => {

            });
            e.target.value = ""
        } else {
            this.setState({
                text: e.target.value,
                id: e.target.dataset.id
            })
        }
    };
    addEmoji = e => {
        let emoji = e.native;
        if (document.getElementById(`usercomment${this.state.id}`) !== null) {
            document.getElementById(`usercomment${this.state.id}`).value += `${emoji}`;
        }
    };
    togglesticker = e => {
        this.setState({
            showsticker: !this.state.showsticker
        })
    };

    render() {
        return (
            <>
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
                                length={3}
                                showControls={true}
                                showIndicators={true}
                                className="z-depth-1"
                                interval={false}
                                slide

                            >
                                <MDBCarouselInner>
                                    {this.props.postimages.map(o => {
                                        return (
                                            <MDBCarouselItem itemId={o.id}>
                                                <MDBView>
                                                    <img
                                                        className="d-block w-100"
                                                        src={o.image}
                                                        alt={o.image}
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
                                <MDBIcon className={"pointer"} onClick={this.togglelike} far icon="heart"/>
                                <MDBIcon className={"pointer"} far icon="comment"/>
                            </div>
                            <div className="description">
                                <span className="bolder">{this.props.postlikes} likes</span>
                                <div className={"img_desc normalweight"}><span
                                    className={"bolder pointer normalweight"}>{this.props.postusername}</span> {this.props.postcaption}
                                </div>
                                <div className={"pointer mt-2 mb-2"}>View all {this.props.totalcomment} Comments</div>
                                <div id="comment-container">
                                    {this.props.comments.map(o => {
                                        return (
                                            <div className="comments mb-2">
                                                <img src={o.profile} className="round mr-3"
                                                     alt="aligment" width={40} height={"100%"}/>
                                                <div className={"comment-info mr-5"}>
                                                    <span className={"bolder mr-2 pointer"}>{o.username}</span>
                                                    <span className={"normalweight"}>{o.comment}</span>
                                                    <div className={"mt-2"}>
                                                        <span>{o.time}</span>
                                                        {
                                                            o.like ?
                                                                <span
                                                                    className={"mr-3 ml-3"}>{o.like} Like{o.like == 1 && "s"} </span>
                                                                :
                                                                ""
                                                        }
                                                        <span data-id={o.id}
                                                              className={"pointer " + (o.like ? "" : "ml-3")}>Reply</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <MDBIcon data-id={o.id} className={"pointer ml-2 like"}
                                                             onClick={this.togglelike} far
                                                             icon="heart"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div className="comments mb-2">
                                        <img src={"https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg"}
                                             className="round mr-3"
                                             alt="aligment" width={40} height={"100%"}
                                        />
                                        <div className="md-form usercomment w-100">
                                            {this.state.showsticker && <div className={"emoji-container"}>
                                                <Picker set='emojione' title={"Choose Sticker"} onSelect={this.addEmoji}/>
                                            </div>}
                                            <textarea onFocus={() => this.setState({
                                                id: this.props.id
                                            })} type="text" data-id={this.props.id} style={{paddingTop: 0}}
                                                      className={"md-textarea comment-textarea form-control"}
                                                      id={"usercomment" + this.props.id}
                                                      onKeyUp={this.handlecomment}>
                                            </textarea>
                                            <MDBBtn className={"sticker"} data-id={this.props.id}
                                                    onClick={this.togglesticker} size="lg" gradient="purple"><MDBIcon
                                                far icon="laugh-beam"/></MDBBtn>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </>
        );
    }

};