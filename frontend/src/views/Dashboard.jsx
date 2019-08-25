import React from "react";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
import {connect} from "react-redux";
import Post from './template/Post'

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            pagination: 0
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loading:false
            })
        },2000)
        document.addEventListener('scroll',this.infiniteScroll)
    }
    componentWillUnmount() {
        document.removeEventListener('scroll',this.infiniteScroll);
    }

    infiniteScroll = (e) => {
        // console.log(e.target.scrollingElement.)
        if((e.target.scrollingElement.scrollHeight - e.target.scrollingElement.scrollTop) === e.target.scrollingElement.clientHeight){ //Mentok di bawah
            this.setState({
                pagination:this.state.pagination+1
            })
            console.log(this.state.pagination)
        }

    }

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
                                        "https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg",
                                        "https://mdbootstrap.com/img/Photos/Slides/img%20(129).jpg",
                                        "https://mdbootstrap.com/img/Photos/Slides/img%20(70).jpg",
                                    ]}
                                    comments={[
                                        {
                                            "id": 1,
                                            "username": "user1",
                                            "comment": "wwkwk gblok wwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblokwwkwk gblok",
                                            "like": 157,
                                            "time": "14 h",
                                            "profile": "https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg",
                                            "likestatus": false,
                                        },
                                        {
                                            "id": 2,
                                            "username": "user2",
                                            "comment": "apaan nih",
                                            "like": 1,
                                            "time": "2 min",
                                            "profile": "https://mdbootstrap.com/img/Photos/Avatars/avatar-2.jpg",
                                            "likestatus": true,
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
                                        "https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg",
                                        "https://mdbootstrap.com/img/Photos/Slides/img%20(129).jpg",
                                        "https://mdbootstrap.com/img/Photos/Slides/img%20(70).jpg",
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
                                                "likestatus": false,
                                            },
                                            {
                                                "id": 2,
                                                "username": "user1",
                                                "comment": "apaan nih",
                                                "like": 1,
                                                "time": "2 min",
                                                "profile": "https://mdbootstrap.com/img/Photos/Avatars/avatar-2.jpg",
                                                "likestatus": true,
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
                }
            </div>
        );
    }

};
export default connect(null,{})(Dashboard)
