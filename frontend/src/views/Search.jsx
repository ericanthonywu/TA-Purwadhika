import React from 'react'
import axios from 'axios'
import {api_url} from "../global";
import {connect} from "react-redux";


class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            param: ""
        }
    }

    search = () => {
        const param = this.props.location.search.split('=')[0] === "?user" ? this.props.location.search.split('=')[1] : null;
        this.setState({
            param: param
        })
        if (param) {
            axios.post(`${api_url}searchUser`, {
                param: param
            }).then(res => {
                this.setState({
                    data: res.data.data
                })
            })

        }
    };

    componentDidMount() {
        this.search()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.param !== this.state.param)
            this.search()
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}

const mapToStateProps = state => {
    return {
        token: state.user.token
    }
};
export default Search
