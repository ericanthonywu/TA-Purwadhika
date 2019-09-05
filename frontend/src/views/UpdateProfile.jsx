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


class UpdateProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showsticker: false,
            bio: "",
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
        axios.post(`${api_url}`,{
            token: this.props.token
        }).then(res => {
            this.setState({
                userData : res
            })
        }).catch(err => {
            console.log(err)
        })
    }

    changeHandler = e => {
        this.setState({[e.target.name]: e.target.value});
    };
    submitHandler = () => {

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
            <MDBContainer>
                <MDBRow>
                    <MDBCol md="12">
                        <MDBCard className="d-flex justify-content-center w-50 form-container"
                                 style={{marginTop: 100, marginLeft: 'auto', marginRight: 'auto'}}>
                            <MDBCardBody>
                                <MDBCardHeader className="form-header deep-blue-gradient rounded">
                                    <h3 className="my-3">
                                        <MDBIcon icon="user"/> Update Profile
                                    </h3>
                                </MDBCardHeader>
                                <form onSubmit={this.submitHandler}>
                                    <div className="grey-text">
                                        <div className="md-form form-group">
                                            <div className="profilepicture">
                                                <img
                                                    src={this.state.showFile || profile_url + localStorage.getItem('profile_picture')}
                                                    width={"100%"} alt=""/>
                                                <span onClick={() => this.refs.cgprofile.click()}><MDBIcon
                                                    icon={"camera"} className={"change-camera"}/></span>
                                                <input type="file" ref={"cgprofile"} onChange={this.fileChosen}
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
                                        />
                                        <MDBInput
                                            label="Nickname "
                                            name={"user"}
                                            icon="user"
                                            group
                                            type="email"
                                            validate
                                            error="wrong"
                                            success="right"
                                            onChange={this.changeHandler}
                                        />
                                        <div className="md-form form-group">
                                            <div className="md-form">
                                                {this.state.showsticker && <div className={"emoji-container"}>
                                                    <Picker set='emojione' title={"Choose Sticker"}
                                                            onSelect={this.addEmoji}/>
                                                </div>}
                                                <textarea style={{paddingTop: 12}}
                                                          className={"md-textarea comment-textarea form-control"}
                                                          onBlur={e => !e.target.value.length && this.refs.biolabel.classList.remove('active')}
                                                          onFocus={() => this.refs.biolabel.classList.add('active')}
                                                          id={"bio"}
                                                          onChange={this.handlebio}
                                                          value={this.state.bio}
                                                >
                                                    {this.state.bio}
                                                </textarea>
                                                <label htmlFor="bio" ref={"biolabel"}>Bio</label>
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
                                    <div className="font-weight-light">
                                        <p>Not a member? <Link to="register">Sign Up</Link></p>
                                        <p><Link to="">Forgot Password?</Link></p>
                                    </div>
                                </MDBModalFooter>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}

const mapToStateProps = state => {
    return {
        token: state.user.token,
        username: state.user.username,
    }
};

export default connect(mapToStateProps)(UpdateProfile)
