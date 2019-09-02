import React from 'react'
import socketio from 'socket.io-client'
import {backend_url} from "../global";
import axios from 'axios'
import {connect} from "react-redux";
import {MDBInput, MDBBtn} from "mdbreact";

const socket = socketio(backend_url);

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chat: [{}],
            msg: ""
        }
    }

    sendChat = () => {
        socket.emit('send chat', {
            chat: this.state.msg,
            token: this.props.token
        });
        this.setState({
            msg: ""
        })
    };

    componentDidMount() {
        socket.on('show chat', msg => {
            console.log(msg)
            this.setState({
                chat: [...this.state.chat,msg]
            })
        });
    }

    render() {
        return (
            <div style={{paddingTop: 100,width:300}}>
                <div id={"ccon"}>
                    {this.state.chat.map(o => {
                        return <div><p style={{float: `${o.token === this.props.token ? "left" : "right"}` }}>{o.chat}</p>
                            <br/></div>
                    })}
                </div>
                <MDBInput onChange={e => this.setState({msg:e.target.value})} value={this.state.msg} ref={"chat"}/>
                <MDBBtn onClick={this.sendChat}>Send</MDBBtn>
            </div>
        )
    }
}

const mapStateToProps = (state => {
    return {
        token: state.user.token,
    }
});
export default connect(mapStateToProps, {})(Chat)
