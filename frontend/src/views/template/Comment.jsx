import {MDBIcon} from "mdbreact";
import React from "react";

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commentlike: props.data.like,
            likestatus:props.data.likestatus
        }
    }

    togglelike = e => {
        if (e.target.classList.contains('fa')) {
            e.target.classList.remove('fa');
            e.target.classList.add('far');
            this.setState({
                commentlike: this.state.commentlike - 1
            })
        } else {
            e.target.classList.remove('far');
            e.target.classList.add('fa');
            this.setState({
                commentlike: this.state.commentlike + 1
            })
        }
    };

    render() {
        return (
            <div className="comments mb-2">
                <img src={this.props.data.profile} className="round mr-3"
                     alt="aligment" width={40} height={"100%"}/>
                <div className={"comment-info mr-5"}>
                    <span className={"bolder mr-2 pointer"}>{this.props.data.username}</span>
                    <span className={"normalweight"}>{this.props.data.comment}</span>
                    <div className={"mt-2"}>
                        <span>{this.props.data.time}</span>
                        {
                            this.state.commentlike ?
                                <span className={"mr-3 ml-3"}>{this.state.commentlike < 0 ? <span>&infin;</span> : this.state.commentlike} Like{this.state.commentlike > 1 ? "s" : ""} </span>
                                :
                                ""
                        }
                        <span className={"pointer " + (this.state.commentlike ? "" : "ml-3")}>Reply</span>
                    </div>
                </div>
                <div>
                    <MDBIcon className={"pointer ml-2 like"}
                             onClick={this.togglelike}
                             fa={this.state.likestatus} far={!this.state.likestatus}
                             icon="heart"
                    />
                </div>
            </div>
        );
    }

}
