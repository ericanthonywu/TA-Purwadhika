import React from 'react'
import socketio from 'socket.io-client'
import {api_url, backend_url, base_url} from "../global";
import axios from 'axios'
import {connect} from "react-redux";
import {MDBInput, MDBBtn, MDBCol, MDBIcon} from "mdbreact";
import {toast} from "react-toastify";
import {Picker} from "emoji-mart";
import moment from "moment";
import Error404 from "./template/404";
import {logout} from "../redux/actions";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chat: [],
            msg: "",
            username: "",
            notFound: false,
            read: false
        }
    }

    sendChat = e => {
        if (e.keyCode === 13 && !e.shiftKey) {
            const msg = e.target.value.replace(/\n$/, "");
            e.target.value = "";
            e.target.scrollTop = e.target.scrollHeight - e.target.clientHeight;
            axios.post(`${api_url}sendChat`, {
                msg: msg,
                token: this.props.token,
                username: this.state.username
            }).then(r => {
                if (this.state.chat.length) {
                    this.setState({
                        chat: [...this.state.chat, {
                            sender: {
                                username: this.props.username,
                            },
                            message: msg
                        }]
                    })
                } else {
                    this.setState({
                        chat: [{
                            sender: {
                                username: this.props.username,
                            },
                            message: msg
                        }]
                    })
                }
            })
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params !== this.props.match.params) {
            const {username} = this.props.match.params;
            if (username == this.props.username) {
                this.setState({
                    notFound: true
                })
            } else {
                axios.post(`${api_url}updateChat`, {
                    to: this.props.id,
                    username: username,
                    token: this.props.token
                });
                axios.post(`${api_url}showChat`, {
                    token: localStorage.getItem('token'),
                    username: username
                }).then(res => {
                    console.log(res);
                    this.setState({
                        chat: res.data.data.message,
                        notFound: false
                    });
                }).catch(err => {
                    if (err.response) {
                        switch (err.response.status) {
                            case 419:
                                toast.error("Session Expired");
                                this.props.logout();
                                break;
                            case 404:
                                this.setState({
                                    notFound: true
                                });
                                break;
                        }
                    }
                });
            }
        }
    }

    componentDidMount() {
        const {username} = this.props.match.params;
        if (username == this.props.username) {
            this.setState({
                notFound: true
            })
        } else {
            const socket = socketio(backend_url, {
                query: {
                    token: localStorage.getItem('token'),
                }
            });
            this.setState({
                username: username
            });
            axios.post(`${api_url}updateChat`, {
                token: localStorage.getItem('token'),
                username: username
            });
            socket.on('newChat', chat => {
                if (chat.to._id == this.props.id && chat.from.username == username) {
                    if (base_url + "chat/" + chat.from.username == window.location.href) {
                        axios.post(`${api_url}updateChat`, {
                            token: this.props.token || localStorage.getItem('token'),
                            username: username
                        }).then(res => {

                        })
                    }
                    this.setState({
                        chat: [...this.state.chat, chat.chat]
                    })
                }
            });
            socket.on('readChat', chat => {
                if (chat.to._id == this.props.id && chat.from.username == username) {
                    const temparr = this.state.chat
                    temparr.map(o => {
                        if(o) {
                            if (o.sender.username == this.props.username) {
                                o.read = true
                            }
                        }
                    });
                    console.log(temparr,this.state.chat)
                    this.setState({
                        chat:temparr
                    })
                }
            });
            axios.post(`${api_url}showChat`, {
                token: localStorage.getItem('token'),
                username: username
            }).then(res => {
                this.setState({
                    chat: this.state.chat.length ? [...this.state.chat, res.data.data.message] : res.data.data.message
                });
            }).catch(err => {
                if (err.response) {
                    switch (err.response.status) {
                        case 419:
                            toast.error("Session Expired");
                            this.props.logout();
                            break;
                        case 404:
                            this.setState({
                                notFound: true
                            });
                            break;
                    }
                }
            });
        }
    }

    addEmoji = e => {
        let emoji = e.native;
        this.refs.comment.value += emoji
    };
    togglesticker = () => {
        if (!this.state.showsticker) {
            // attach/remove event handler
            document.addEventListener('click', this.handleOutsideClick, false);
            document.onkeydown = this.handleOutsideClick
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
            document.onkeydown = this.handleOutsideClick
        }
        this.setState({
            showsticker: !this.state.showsticker
        })
    };
    handleOutsideClick = e => {
        // ignore clicks on the component itself
        if (document.querySelector('section.emoji-mart') !== null) {
            this.setState({
                showsticker: !document.querySelector('section.emoji-mart').contains(e.target) || e.key === "Escape"
            });
            this.togglesticker()
        }
    };

    render() {
        return (
            <>
                {
                    this.state.notFound ?
                        <Error404/>
                        :
                        <MDBCol size={4} style={{paddingTop: 100, margin: "auto"}}>
                            {/*<img src={""}/>*/}
                            <div className={"show-chat"}>
                                {
                                    this.state.chat ?
                                    this.state.chat.map(o => {
                                        return o ? (
                                            <div
                                                className={o.sender.username != this.props.username ? "receiver" : "sender"}>
                                                <div>{o.message}<br/>
                                                    <span>{moment(o.time).fromNow()} {o.sender.username == this.props.username ? (o.read ? "Read" : "Delivered") : null}</span>
                                                </div>
                                            </div>
                                        ) : null
                                    })
                                        :
                                        null
                                }
                            </div>
                            <div style={{display: "flex", marginTop: this.state.chat}}>
                                <div className="md-form usercomment w-100">
                                    {this.state.showsticker && <div className={"emoji-container"}>
                                        <Picker set='emojione' title={"Choose Sticker"}
                                                onSelect={this.addEmoji}/>
                                    </div>}
                                    <textarea style={{paddingTop: 0}}
                                              className={"md-textarea comment-textarea form-control"}
                                              id={"usercomment"}
                                              onKeyUp={this.sendChat}
                                              ref={"comment"}
                                              placeholder={"Enter Your Chat Here"}
                                    />
                                    <MDBBtn className={"sticker"}
                                            onClick={this.togglesticker} size="lg" gradient="purple"><MDBIcon
                                        far icon="laugh-beam"/></MDBBtn>
                                </div>
                                {/*<MDBInput onChange={e => this.setState({msg:e.target.value})} value={this.state.msg} ref={"chat"}/>*/}
                                {/*<MDBBtn onClick={this.sendChat}>Send</MDBBtn>*/}
                            </div>
                        </MDBCol>
                }
            </>
        )
    }
}

const mapStateToProps = (state => {
    return {
        token: state.user.token,
        id: state.user._id,
        username: state.user.username,
    }
});
export default connect(mapStateToProps, {logout})(Chat)
