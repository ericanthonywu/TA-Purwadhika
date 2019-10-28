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
import {api_url, frontend_url, post_url, profile_url} from "../global";
import Datatable from 'react-data-table-component'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {toast} from "react-toastify";
import DatePicker from 'react-date-picker'
import moment from "moment";

const swal = withReactContent(Swal);

class ReportPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            modal: false,
            username: "",
            id: "",
            suspendName: ""
        }
    }

    componentDidMount() {
        this.refreshTable();
    };

    refreshTable = () => {
        Axios.post(`${api_url}report`, {
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
    action = rows => rows.userId ? <>
        <MDBBtn size={"sm"} gradient={"frozen-dreams"} onClick={() => {
            swal.fire({
                title: `Apakah anda yakin akan ${rows.userId.status !== 1 ? "block" : "unblock"} ${rows.userId.username}?`,
                text: `Anda bisa ${rows.userId.status !== 1 ? "unblock" : "block"} ${rows.userId.username} kembali`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: `Ya, ${rows.userId.status !== 1 ? "Block" : "Unblock"} saja!`,
                cancelButtonText: 'Batalkan',
                reverseButtons: true
            }).then(res => {
                if (res.value) {
                    Axios.post(`${api_url}blockUsers`, {
                        token: this.props.token,
                        id: rows.userId._id,
                        status: rows.userId.status
                    }).then(res => {
                        swal.fire(
                            `Sukses! User ${rows.userId.username} telah di ${rows.userId.status !== 1 ? "Block" : "Unblock"}`,
                            '',
                            'success'
                        );
                        this.refreshTable()
                    }).catch(err => {
                        if (err.status == 419) {
                            toast.error("Session Expired");
                            this.props.history.push('/')
                        }
                        console.log(err)
                    })
                }
            })
        }}> {rows.userId.status == 1 ? "unblock" : "block"} </MDBBtn>
        <MDBBtn size={"sm"} gradient={"sunny-morning"} onClick={() => {
            this.setState({
                modal: true,
                suspendName: rows.username,
                suspendId: rows._id
            })
        }}> {rows.userId.status == 2 ? "unsuspend" : "suspend"}</MDBBtn>
    </> : <MDBBtn onClick={() => {
        swal.fire({
            title: `Apakah anda yakin akan ${!rows.postId.ban ? "hide" : "unhide"} post ini?`,
            text: `Anda bisa ${rows.postId.ban ? "unhide" : "hide"} post ini kembali`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: `Ya, ${!rows.postId.ban ? "Hide" : "Unhide"} saja!`,
            cancelButtonText: 'Batalkan',
            reverseButtons: true
        }).then(res => {
            if (res.value) {
                Axios.post(`${api_url}hidePost`, {
                    token: this.props.token,
                    post: rows.postId._id,
                    ban: !rows.postId.ban
                }).then(res => {
                    console.log(rows);
                    swal.fire(`Success! Post telah di hide!`, '', 'success');
                    this.refreshTable()
                })
            }
        })
    }} color={"red"}>{!rows.postId.ban ? "Hide" : "Unhide"} Posts</MDBBtn>;

    changeSuspendTime = date => {
        this.setState({suspendTime: date})
    };

    toggle = () => this.setState({
        modal: !this.state.modal,
        suspendName: this.state.modal ? this.state.suspendName : "",
        suspendId: this.state.modal ? this.state.suspendId : "",
        time: this.state.modal ? this.state.time : "",
    });

    suspendUser = () => {
        Axios.post(`${api_url}suspendUser`, {
            token: this.props.token,
            user: this.state.suspendId,
            time: this.state.suspendTime
        }).then(res => {
            swal.fire(`Sukses! User ${this.state.suspendName} telah di suspend!`, '', 'success');
            this.setState({
                suspendName: "",
                suspendId: "",
                time: "",
                modal: false
            }, () => this.refreshTable())
        }).catch(err => {
            if (err.response.status == 419) {
                toast.error("Session Expired")
            }
        })
    };

    render() {
        return (
            <MDBCard>
                <MDBCardBody>
                    <MDBCardTitle>Report Data</MDBCardTitle>
                    <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                        <MDBModalHeader toggle={this.toggle}>Suspend {this.state.suspendName}</MDBModalHeader>
                        <MDBModalBody>
                            <DatePicker
                                format={"d MMM y"}
                                value={this.state.suspendTime}
                                onChange={this.changeSuspendTime}
                            />
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
                            <MDBBtn color="primary" onClick={this.suspendUser}>Save changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                    <Datatable
                        columns={[
                            {
                                name: 'No',
                                selector: 'no',
                                sortable: true,
                                width: "60px"
                            },
                            {
                                name: 'Report Type',
                                selector: 'postId',
                                sortable: true,
                                cell: row => row.postId ? "post" : "user"
                            },
                            {
                                name: 'Report',
                                selector: 'postId',
                                cell: row => row.postId ? <div style={{display: "block"}}><MDBCarousel
                                    activeItem={1}
                                    length={row.postId.image.length}
                                    showControls={row.postId.image.length > 1}
                                    showIndicators={row.postId.image.length > 1}
                                    className="z-depth-1"
                                    interval={false}
                                    slide
                                >
                                    <MDBCarouselInner>
                                        {
                                            row.postId.image.map((o, id) => {
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
                                    <p>Caption : {row.postId.caption}</p>
                                    <p>Posted By :
                                        <a href={`${frontend_url}profile/${row.postId.user.username}`}
                                           target={"_blank"}>
                                            <img src={profile_url + row.postId.user.profilepicture} width={60}
                                                 alt={row.postId.user.profilepicture}/> {row.postId.user.username}
                                        </a>
                                    </p>
                                    <p><a href={`${frontend_url}post/${row.postId._id}`} target={'_blank'}>Post Url</a>
                                    </p>
                                </div> : <a href={`${frontend_url}profile/${row.userId.username}`}><img
                                    src={profile_url + row.userId.profilepicture} alt={row.userId.profilepicture}
                                    width={60}/> {row.userId.username} </a>
                            },
                            {
                                name: 'Reporter',
                                selector: 'reportedBy',
                                cell: row => <a href={`${frontend_url}profile/${row.reportedBy.username}`}><img
                                    src={profile_url + row.reportedBy.profilepicture}
                                    alt={row.reportedBy.profilepicture} width={60}/> {row.reportedBy.username} </a>
                            },
                            {
                                name: 'Action',
                                selector: '_id',
                                width: "300px",
                                cell: this.action
                            },
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
        );
    }
}

const mapToStateProps = state => {
    return {
        token: state.user.token
    }
};
export default connect(mapToStateProps)(ReportPage)
