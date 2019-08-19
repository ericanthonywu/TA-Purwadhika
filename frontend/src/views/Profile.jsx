import React from "react";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";

import Post from './template/Post'

export default class Profile extends React.Component {
    componentDidMount() {
        const {profile} = this.props.match.params
    }

    render() {
        return (
            <div style={{paddingTop: 100}}>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol size={8} className={"home_dashboard"}>
                            <div className={"post"}>
                                <Post
                                    id={1}
                                    postusername={"Eric Anthony"}
                                    posttime={"4 hours"}
                                    postprofilepicture={"https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg"}
                                    postcaption={"Hello World!"}
                                    totalcomment={100}
                                    postlikes={319}
                                    likestatus={true}
                                    postimages={[
                                        {
                                            id: 1,
                                            image: "https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg",
                                        },
                                        {
                                            id: 2,
                                            image: "https://mdbootstrap.com/img/Photos/Slides/img%20(129).jpg",
                                        },
                                        {
                                            id: 3,
                                            image: "https://mdbootstrap.com/img/Photos/Slides/img%20(70).jpg",
                                        },
                                    ]}
                                    comments={[
                                        {
                                            "id": 1,
                                            "username": "user1",
                                            "comment": "wwkwk gblok wwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblok",
                                            "like": 157,
                                            "time": "14 h",
                                            "profile": "https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg",
                                            "likestatus":false,
                                        },
                                        {
                                            "id": 2,
                                            "username": "user2",
                                            "comment": "apaan nih",
                                            "like": 1,
                                            "time": "2 min",
                                            "profile": "https://mdbootstrap.com/img/Photos/Avatars/avatar-2.jpg",
                                            "likestatus":true,
                                        }
                                    ]}
                                />
                                <Post
                                    id={2}
                                    postusername={"Eric Anthony"}
                                    posttime={"4 hours"}
                                    postprofilepicture={"https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg"}
                                    postcaption={"Hello World!"}
                                    totalcomment={100}
                                    postlikes={319}
                                    likestatus={false}
                                    postimages={[
                                        {
                                            id: 1,
                                            image: "https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg",
                                        },
                                        {
                                            id: 2,
                                            image: "https://mdbootstrap.com/img/Photos/Slides/img%20(129).jpg",
                                        },
                                        {
                                            id: 3,
                                            image: "https://mdbootstrap.com/img/Photos/Slides/img%20(70).jpg",
                                        },
                                    ]}
                                    comments={
                                        [
                                            {
                                                "id": 1,
                                                "username": "user1",
                                                "comment": "wwkwk gblok wwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblok",
                                                "like": 157,
                                                "time": "14 h",
                                                "profile": "https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg",
                                                "likestatus":false,
                                            },
                                            {
                                                "id": 2,
                                                "username": "user1",
                                                "comment": "apaan nih",
                                                "like": 1,
                                                "time": "2 min",
                                                "profile": "https://mdbootstrap.com/img/Photos/Avatars/avatar-2.jpg",
                                                "likestatus":true,
                                            }
                                        ]
                                    }
                                />
                            </div>
                        </MDBCol>
                        <MDBCol size={4} className={"home_data"}>

                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        );
    }

};