import React from "react";
import {post_url} from "../../global";

class TaggedImg extends React.Component{
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <img
                onDoubleClick={this.togglelike}
                className="d-block w-100"
                src={this.state.postlikes < 0 ? o :post_url + o}
                alt={`image ${id + 1}`}
            />
        );
    }

}
