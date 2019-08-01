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
    MDBView
} from "mdbreact";

export default class Post extends React.Component {
    togglelike = e => {
        e.target.classList.toggle('fa')
    }

    render() {
        return (
            <>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol size="12" className={"w-100"}>
                            <div className={"float-left flex"}>
                                <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg" className="round mr-3"
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
                                slide

                            >
                                <MDBCarouselInner>
                                    <MDBCarouselItem itemId="1">
                                        <MDBView>
                                            <img
                                                className="d-block w-100"
                                                src="https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg"
                                                alt="First slide"
                                            />
                                        </MDBView>
                                    </MDBCarouselItem>
                                    <MDBCarouselItem itemId="2">
                                        <MDBView>
                                            <img
                                                className="d-block w-100"
                                                src="https://mdbootstrap.com/img/Photos/Slides/img%20(129).jpg"
                                                alt="Second slide"
                                            />
                                        </MDBView>
                                    </MDBCarouselItem>
                                    <MDBCarouselItem itemId="3">
                                        <MDBView>
                                            <img
                                                className="d-block w-100"
                                                src="https://mdbootstrap.com/img/Photos/Slides/img%20(70).jpg"
                                                alt="Third slide"
                                            />
                                        </MDBView>
                                    </MDBCarouselItem>
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
                                <span className="bolder">10,000 likes</span>
                                <div className={"img_desc"}><span className={"bolder pointer"}>username</span> Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit AmetLorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet</div>
                                <span className={"pointer"}>View all 42 Comments</span>
                                <div id="comment-container">
                                    <div className="comments mb-2">
                                        <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg" className="round mr-3"
                                             alt="aligment" width={40} height={"100%"}/>
                                        <div className={"comment-info"}>
                                            <span className={"bolder mr-2 pointer"}>username</span>
                                            <span>Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet</span>
                                            <div className={"mt-2"}>
                                                <span>14h</span>
                                                <span className={"mr-3 ml-3"}>157 Likes</span>
                                                <span className={"pointer"}>Reply</span>
                                            </div>
                                        </div>
                                        <div>
                                            <MDBIcon data-id={1} className={"pointer"} onClick={this.togglelike} far icon="heart"/>
                                        </div>
                                    </div>
                                    <div className="comments mb-2">
                                        <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg" className="round mr-3"
                                             alt="aligment" width={40} height={"100%"}/>
                                        <div className={"comment-info"}>
                                            <span className={"bolder mr-2"}>username</span>
                                            <span>Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet</span>
                                            <div className={"mt-2"}>
                                                <span>14h</span>
                                                <span className={"mr-3 ml-3"}>157 Likes</span>
                                                <span>Reply</span>
                                            </div>
                                        </div>
                                        <div>
                                            <MDBIcon onClick={this.togglelike} far icon="heart"/>
                                        </div>
                                    </div>
                                    <div className="comments mb-2">
                                        <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg" className="round mr-3"
                                             alt="aligment" width={40} height={"100%"}/>
                                        <div className={"comment-info"}>
                                            <span className={"bolder mr-2"}>username</span>
                                            <span>Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet</span>
                                            <div className={"mt-2"}>
                                                <span>14h</span>
                                                <span className={"mr-3 ml-3"}>157 Likes</span>
                                                <span>Reply</span>
                                            </div>
                                        </div>
                                        <div>
                                            <MDBIcon onClick={this.togglelike} far icon="heart"/>
                                        </div>
                                    </div>
                                    <div className="comments mb-2">
                                        <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg" className="round mr-3"
                                             alt="aligment" width={40} height={"100%"}/>
                                        <div className={"comment-info"}>
                                            <span className={"bolder mr-2"}>username</span>
                                            <span>Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet Lorem Ipsum Donor Sit Amet</span>
                                            <div className={"mt-2"}>
                                                <span>14h</span>
                                                <span className={"mr-3 ml-3"}>157 Likes</span>
                                                <span>Reply</span>
                                            </div>
                                        </div>
                                        <div>
                                            <MDBIcon onClick={this.togglelike} far icon="heart"/>
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