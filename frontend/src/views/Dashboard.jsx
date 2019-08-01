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

import Post from './template/post'

export default class Dashboard extends React.Component {
    togglelike = e => {
        e.target.classList.toggle('fa')
    }

    render() {
        return (
            <>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol size={8} className={"home_dashboard"}>
                            <div className={"post"}>
                               <Post
                                   postusername={"Eric Anthony"}
                                   posttime={"4 hours"}
                               />
                            </div>
                        </MDBCol>
                        <MDBCol size={4} className={"home_data"}>

                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </>
        );
    }

};