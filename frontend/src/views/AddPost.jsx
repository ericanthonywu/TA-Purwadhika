import React from "react";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBIcon,
    MDBInput,
    MDBBtn,
} from "mdbreact";
import {toast, ToastContainer} from "react-toastify";

import {Picker} from "emoji-mart";
import Post from "./template/Post";
import axios from 'axios'
import {api_url} from "../global";
import {connect} from "react-redux";
import {logout} from "../redux/actions";

class AddPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: [],
            loadimage: false,
            showsticker: false,
            caption: ""
        };
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.togglesticker = this.togglesticker.bind(this)
    }

    addPost = () => {
        const formdata = new FormData();
        for (let i = 0; i < this.state.file.length; i++) {
            formdata.append('image', this.state.file[i])
        }
        formdata.append('caption', this.state.caption);
        formdata.append('token', this.props.token);
        axios.post(`${api_url}addpost`, formdata, {
            headers: {
                "Content-Type": "multipart/form-data;charset=utf-8"
            }
        }).then(res => {
            this.props.history.push('/')
        }).catch(err => {
            console.log(err);
            toast.error("Session Expire please Login again");
            setTimeout(async () => {
                await this.props.logout(); //prevent concurrency
                this.props.history.push('/login')
            }, 1000)
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

    addEmoji = e => {
        let emoji = e.native;
        this.setState({
            caption: this.state.caption += emoji,
        });
        this.refs.captionlabel.classList.add('active')
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
    handlecaption = e => {
        this.setState({
            caption: e.target.value,
        })
    };
    filechoosen = e => {
        if (e.target.files.length) { //cek file
            const files = Array.from(e.target.files); //get files array
            this.setState({
                file: e.target.files
            });
            this.setState({
                loadimage: true
            });
            Promise.all(files.map(file => { //mapping files
                return (new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', e => {
                        resolve(e.target.result); //return images
                    });
                    reader.addEventListener('error', reject); //put error handler
                    reader.readAsDataURL(file);
                }));
            })).then(images => {
                this.setState({
                    loadimage: false,
                    image: images
                });
                console.log(this.state.image)

            }, error => {
                toast.error("an error occured please upload again")
            });
        }
    };

    render() {
        return (
            <MDBContainer>
                <ToastContainer enableMultiContainer position={toast.POSITION.TOP_RIGHT}/>
                <MDBRow>
                    <MDBCol lg="6">
                        <MDBCard className="d-flex justify-content-center w-100 form-container"
                                 style={{marginTop: 100, marginLeft: 'auto', marginRight: 'auto'}}>
                            <MDBCardBody>
                                <MDBCardHeader className="form-header deep-blue-gradient rounded">
                                    <h3 className="my-3">
                                        <MDBIcon icon="lock"/> Add Post:
                                    </h3>
                                </MDBCardHeader>
                                <form className={"needs-validation"} noValidate onSubmit={this.submitHandler}>
                                    <div className="md-form form-group d-flex justify-content-center">
                                        <button onClick={() => this.refs.uploadpost.click()} type="button"
                                                className={"btn btn-primary"}><MDBIcon icon="upload"/> &nbsp; Upload
                                            Image
                                        </button>
                                        <input type="file" multiple onChange={this.filechoosen} ref={"uploadpost"}
                                               accept={'.jpg,.jpeg,.png,.pneg'} style={{display: "none"}}/>
                                    </div>
                                    <div className="md-form form-group">
                                        <div className="md-form usercomment w-100">
                                            {this.state.showsticker && <div className={"emoji-container"}>
                                                <Picker set='emojione' title={"Choose Sticker"}
                                                        onSelect={this.addEmoji}/>
                                            </div>}
                                            <textarea style={{paddingTop: 12}}
                                                      className={"md-textarea comment-textarea form-control"}
                                                      onBlur={e => !e.target.value.length && this.refs.captionlabel.classList.remove('active')}
                                                      onFocus={() => this.refs.captionlabel.classList.add('active')}
                                                      id={"caption"}
                                                      onChange={this.handlecaption}
                                                      value={this.state.caption}
                                            >
                                            {this.state.comment}
                                        </textarea>
                                            <label htmlFor="caption" ref={"captionlabel"}>Caption</label>
                                            <MDBBtn className={"sticker"}
                                                    onClick={this.togglesticker} size="lg"
                                                    gradient="purple"><MDBIcon
                                                far icon="laugh-beam"/></MDBBtn>
                                        </div>
                                    </div>
                                    <div className="text-center mt-4">
                                        <MDBBtn
                                            color="light-blue"
                                            className="mb-3"
                                            type="button"
                                            onClick={this.addPost}
                                        >
                                            Add New Post
                                        </MDBBtn>
                                    </div>
                                </form>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol lg={6} style={{marginTop: 100}} className={"d-flex justify-content-center"}>
                        <MDBRow>
                            <MDBCol size={12}>
                                {this.state.loadimage ?
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    :
                                    this.state.image.length ?
                                        <>
                                            <p className={"bolder"}>Your Post Will be Like : </p>
                                            <Post
                                                style={{border: "1px solid black", padding: 20, borderRadius: 30}}
                                                id={1}
                                                postusername={localStorage.getItem("username")}
                                                posttime={"a few seconds ago"}
                                                postprofilepicture={localStorage.getItem('profile_picture')}
                                                postcaption={this.state.caption || "No caption here"}
                                                totalcomment={-2}
                                                postlikes={-2}
                                                likestatus={true}
                                                likeslist={[]}
                                                postimages={this.state.image}
                                                comments={[]}
                                            />
                                        </> : <p className={"bolder"}>Choose Photo to Preview Post</p>}
                            </MDBCol>
                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.user.token,
        profilepicture: state.user.profilepicture
    }
};

export default connect(mapStateToProps, {logout})(AddPost)

