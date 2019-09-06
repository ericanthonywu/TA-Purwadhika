import React from 'react'
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBModalFooter,
    MDBRow
} from "mdbreact";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {api_url, profile_url} from "../global";
import {Picker} from "emoji-mart";
import axios from 'axios'
import {toast} from "react-toastify";
import {updateProfile} from "../redux/actions";

class UpdateProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showsticker: false,
            bio: "",
            email: "",
            nickname: "",
            file: "",
            showFile: "",
            isLoading: true,
            notFound: false,
            userData: {}
        };
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.togglesticker = this.togglesticker.bind(this)
    }

    componentDidMount() {
        if (this.props.token) {
            axios.post(`${api_url}showProfile`, {
                token: this.props.token
            }).then(res => {
                this.setState({
                    userData: res.data.data,
                    isLoading: false,
                    bio: res.data.data.bio
                });
                console.log(res.data.data)
            }).catch(err => {
                this.setState({
                    isLoading: false
                });
                console.log(err)
            })
        }
    }

    changeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    submitHandler = e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('email', this.state.email || this.state.userData.email);
        formData.append('nickname', this.state.nickname || this.state.userData.nickname);
        formData.append('bio', this.state.bio || this.state.userData.bio);
        formData.append('file', this.state.file);
        axios.post(`${api_url}updateProfile`, formData, {
            headers: {
                "Content-Type": "multipart/form-data;charset=utf-8"
            }
        }).then(res => {
            toast.success("Profile Updated");
            localStorage.setItem('profile_picture', res.data.data);
            if(res.data.data) {
                this.props.updateProfile({
                    profilepicture: res.data.data
                })
            }
        }).catch(err => {
            toast.error("An error occurred")
        })
    };

    handleOutsideClick(e) {
        // ignore clicks on the component itself
        if (document.querySelector('section.emoji-mart') !== null) {
            this.setState({
                showsticker: !document.querySelector('section.emoji-mart').contains(e.target) || e.key === "Escape"
            });
            this.togglesticker()
        }
    }

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
    addEmoji = e => {
        const emoji = e.native;
        this.setState({
            bio: this.state.bio += emoji,
        });
        this.refs.biolabel.classList.add('active')
    };
    handlebio = e => {
        this.setState({
            bio: e.target.value
        })
    };
    fileChosen = e => {
        this.setState({
            file: e.target.files[0]
        });
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = e => {
            this.setState({
                showFile: reader.result
            })
        }
    };

    render() {
        return (
            <div>
                {
                    this.state.isLoading ?
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
                                <MDBCol md="12">
                                    <MDBCard className="d-flex justify-content-center w-50 form-container"
                                             style={{marginTop: 100, marginLeft: 'auto', marginRight: 'auto'}}>
                                        <MDBCardBody>
                                            <MDBCardHeader className="form-header deep-blue-gradient rounded">
                                                <h3 className="my-3">
                                                    <MDBIcon icon="user"/> Update
                                                    Profile
                                                </h3>
                                            </MDBCardHeader>
                                            <form onSubmit={this.submitHandler}>
                                                <div className="grey-text">
                                                    <div className="md-form form-group">
                                                        <div className="profilepicture">
                                                            <img
                                                                src={this.state.showFile || profile_url + this.props.profilepicture}
                                                                width={"100%"} alt=""/>
                                                            <span onClick={() => this.refs.cgprofile.click()}><MDBIcon
                                                                icon={"camera"} className={"change-camera"}/></span>
                                                            <input type="file" ref={"cgprofile"}
                                                                   onChange={this.fileChosen}
                                                                   accept={"image/*"}/>
                                                        </div>
                                                    </div>
                                                    <MDBInput
                                                        label="Email"
                                                        name={"email"}
                                                        icon="envelope"
                                                        group
                                                        type="email"
                                                        validate
                                                        error="wrong"
                                                        success="right"
                                                        onChange={this.changeHandler}
                                                        value={this.state.email || this.state.userData.email}
                                                    />
                                                    <MDBInput
                                                        label="Nickname "
                                                        name={"nickname"}
                                                        icon="user"
                                                        group
                                                        type="text"
                                                        validate
                                                        error="wrong"
                                                        success="right"
                                                        onChange={this.changeHandler}
                                                        value={this.state.nickname || this.state.userData.nickname}
                                                    />
                                                    <div className="md-form form-group">
                                                        <div className="md-form">
                                                            {this.state.showsticker &&
                                                            <div className={"emoji-container"}>
                                                                <Picker set='emojione' title={"Choose Sticker"}
                                                                        onSelect={this.addEmoji}/>
                                                            </div>}
                                                            <textarea style={{paddingTop: 12}}
                                                                      className={"md-textarea comment-textarea form-control"}
                                                                      onBlur={e => !e.target.value.length && this.refs.biolabel.classList.remove('active')}
                                                                      onFocus={() => this.refs.biolabel.classList.add('active')}
                                                                      id={"bio"}
                                                                      name={"bio"}
                                                                      onChange={this.handlebio}
                                                                      value={this.state.bio || this.state.userData.bio }
                                                            >
                                                    {this.state.bio}
                                                </textarea>
                                                            <label htmlFor="bio" ref={"biolabel"} className={(this.state.bio || this.state.userData.bio) ? "active" : ""}>Bio</label>
                                                            <MDBBtn className={"sticker"}
                                                                    onClick={this.togglesticker} size="lg"
                                                                    gradient="purple"><MDBIcon
                                                                far icon="laugh-beam"/></MDBBtn>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-center mt-4">
                                                    <MDBBtn
                                                        color="light-blue"
                                                        className="mb-3"
                                                        type="submit"
                                                    >
                                                        Update Profile
                                                    </MDBBtn>
                                                </div>
                                            </form>
                                            <MDBModalFooter>

                                            </MDBModalFooter>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                }
            </div>
        )
    }
}

const mapToStateProps = state => {
    return {
        token: state.user.token,
        username: state.user.username,
        profilepicture: state.user.profilepicture
    }
};

export default connect(mapToStateProps,{updateProfile})(UpdateProfile)
