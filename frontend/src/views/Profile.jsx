import React from "react";
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBBtn
} from "mdbreact";

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
                        <MDBCol size={4}>
                                <img width={"100%"} src="https://github.githubassets.com/favicon.ico" className={"round-img"} alt=""/>
                        </MDBCol>
                        <MDBCol size={1}>

                        </MDBCol>
                        <MDBCol size={6} className={"user_data"}>
                            <div>
                                <span className={"profile_username"}>username_example</span>
                                <MDBBtn className={"waves-effect"} outline color={"primary"}> Following </MDBBtn>
                                <MDBBtn className={"waves-effect"} color={"primary"}> Follow </MDBBtn>
                            </div>
                            <div>
                                <span className={"bolder"}>107</span> posts
                                <span className={"bolder"}>102K</span> followers
                                <span className={"bolder"}>261k</span> following
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        );
    }

};
