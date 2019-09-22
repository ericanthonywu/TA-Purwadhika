import React from "react";
import {connect} from "react-redux";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardTitle, MDBCarousel, MDBCarouselInner, MDBCarouselItem,
    MDBContainer,
    MDBDataTable,
    MDBModal, MDBModalBody, MDBModalFooter,
    MDBModalHeader, MDBView
} from "mdbreact";
import Axios from "axios";
import {api_url, profile_url} from "../global";
import Datatable from 'react-data-table-component'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {toast} from "react-toastify";
import DatePicker from 'react-date-picker'
import moment from "moment";
import {post_url} from "../global";

const swal = withReactContent(Swal);

class PostPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            postModal: false,
            username: "",
            id: "",
            suspendName: "",
            image: []
        }
    }

    componentDidMount() {
        this.refreshTable();
    };

    refreshTable = () => {
        Axios.post(`${api_url}posts`, {
            token: this.props.token || localStorage.getItem('token')
        }).then(res => {
            const data = res.data.data;
            data.forEach((o, id) => {
                data[id].no = id + 1;
            });
            this.setState({
                data: data,
                loading: false
            })
        });
    };

    toggle = () => this.setState({
        postModal: !this.state.postModal,
    });

    toggleHidePost = rows => <MDBBtn onClick={() => {
        swal.fire({
            title: `Apakah anda yakin akan ${!rows.ban ? "hide" : "unhide"} post ini?`,
            text: `Anda bisa ${rows.ban ? "unhide" : "hide"} post ini kembali`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: `Ya, ${!rows.ban ? "Hide" : "Unhide"} saja!`,
            cancelButtonText: 'Batalkan',
            reverseButtons: true
        }).then(res => {
            if (res.value) {
                Axios.post(`${api_url}hidePost`, {
                    token: this.props.token,
                    post: rows._id,
                    ban: !rows.ban
                }).then(res => {
                    console.log(rows);
                    swal.fire(`Success! Post telah di hide!`, '', 'success');
                    this.refreshTable()
                })
            }
        })
    }} color={"red"}>{!rows.ban ? "Hide" : "Unhide"} Posts</MDBBtn>;

    render() {
        return (
            <>
                <MDBModal isOpen={this.state.postModal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>Post Image</MDBModalHeader>
                    <MDBModalBody>
                        <MDBCarousel
                            activeItem={1}
                            length={this.state.image.length}
                            showControls={this.state.image.length > 1}
                            showIndicators={this.state.image.length > 1}
                            className="z-depth-1"
                            interval={false}
                            slide
                        >
                            <MDBCarouselInner>
                                {
                                    this.state.image.map((o, id) => {
                                        return (
                                            <MDBCarouselItem itemId={id + 1}>
                                                <MDBView>
                                                    <img
                                                        className="d-block w-100"
                                                        src={post_url + o}
                                                        alt={`image ${id + 1}`}
                                                    />
                                                </MDBView>
                                            </MDBCarouselItem>
                                        )
                                    })
                                }
                            </MDBCarouselInner>
                        </MDBCarousel>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
                <MDBCard>
                <MDBCardBody>
                    <MDBCardTitle>Posts Data</MDBCardTitle>
                    <Datatable
                        columns={[
                            {
                                name: 'No',
                                selector: 'no',
                                sortable: true,
                                width: "60px"
                            },
                            {
                                name: 'Image',
                                selector: 'image',
                                cell: row => <MDBBtn onClick={() => this.setState({postModal: true, image: row.image})}>Show
                                    Post Image</MDBBtn>
                            },
                            {
                                name: 'Caption',
                                selector: 'caption',
                                sortable: true,
                                cell: row => <div style={{whiteSpace: "pre-line"}}>{row.caption}</div>
                            },
                            {
                                name: 'Posted By',
                                selector: 'user',
                                sortable: true,
                                cell: row => row.user.username
                            },
                            {
                                name: 'Action',
                                selector: '_id',
                                width: "300px",
                                cell: this.toggleHidePost
                            }
                        ]}
                        data={this.state.data}
                        progressPending={this.state.loading}
                        progressComponent={
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
                        }
                        pagination
                    />
                </MDBCardBody>
            </MDBCard>
            </>
        );
    }
}

const mapToStateProps = state => {
    return {
        token: state.user.token
    }
};
export default connect(mapToStateProps)(PostPage)
