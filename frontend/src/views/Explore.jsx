import React from "react";
import Axios from "axios";
import {api_url, post_url} from "../global";
import {MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";

class Explore extends React.Component {
    state = {post: []}

    componentDidMount() {
        Axios.post(`${api_url}explore`).then(data => {
            this.setState({
                post: data.data.data
            })
        }).catch(err => console.error(err))
    }

    render() {
        return (
            <MDBContainer>
                <MDBRow>
                    {
                        this.state.post.map(o =>
                            <MDBCol size={4}>
                                <div className={"post-thumbnail"}
                                     onClick={() => this.props.history.push("/post/" + o._id)
                                     }>
                                    <img
                                        src={post_url + o.image[0]}
                                        width={"100%"} alt={o.image}/>
                                    <div className={"post_desc"}>
                                    <span>
                                        <MDBIcon className={'pointer '} far
                                                 icon="heart"/> {o.like}
                                    </span>
                                        <span><MDBIcon className={"pointer"} fa
                                                       icon="comment"/> {o.comments} </span>
                                    </div>
                                </div>
                            </MDBCol>
                        )}
                </MDBRow>
            </MDBContainer>
        );
    }

}

export default Explore
