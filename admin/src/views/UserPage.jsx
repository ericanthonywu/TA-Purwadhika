import React from "react";
import {connect} from "react-redux";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardTitle,
    MDBContainer,
    MDBDataTable,
    MDBModal, MDBModalBody, MDBModalFooter,
    MDBModalHeader
} from "mdbreact";
import Axios from "axios";
import {api_url, profile_url} from "../global";
import Datatable from 'react-data-table-component'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {toast} from "react-toastify";
import DatePicker from 'react-date-picker'
import moment from "moment";

const swal = withReactContent(Swal);

class UserPage extends React.Component {
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
        Axios.post(`${api_url}users`, {
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
    action = rows => <>
        <MDBBtn size={"sm"} gradient={"frozen-dreams"} onClick={() => {
            swal.fire({
                title: `Apakah anda yakin akan ${rows.status !== 1 ? "block" : "unblock"} ${rows.username}?`,
                text: `Anda bisa ${rows.status !== 1 ? "unblock" : "block"} ${rows.username} kembali`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: `Ya, ${rows.status !== 1 ? "Block" : "Unblock"} saja!`,
                cancelButtonText: 'Batalkan',
                reverseButtons: true
            }).then(res => {
                if (res.value) {
                    Axios.post(`${api_url}blockUsers`, {
                        token: this.props.token,
                        id: rows._id,
                        status: rows.status
                    }).then(res => {
                        swal.fire(
                            `Sukses! User ${rows.username} telah di ${rows.status !== 1 ? "Block" : "Unblock"}`,
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
        }}> {rows.status == 1 ? "unblock" : "block"} </MDBBtn>
        {/*<MDBBtn size={"sm"} gradient={"sunny-morning"} onClick={() => {*/}
        {/*    this.setState({*/}
        {/*        modal: true,*/}
        {/*        suspendName: rows.username,*/}
        {/*        suspendId: rows._id*/}
        {/*    })*/}
        {/*}}> {rows.status == 2 ? "unsuspend" : "suspend"}</MDBBtn>*/}
    </>;

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
            },() => this.refreshTable())
        }).catch(err => {
            if(err.response.status == 419){
                toast.error("Session Expired")
            }
        })
    };

    render() {
        return (
            <MDBCard>
                <MDBCardBody>
                    <MDBCardTitle>Users Data</MDBCardTitle>
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
                                name: 'Profile Picture',
                                selector: 'profilepicture',
                                width: "100px",
                                cell: row => <img width={60} src={profile_url + row.profilepicture} alt=""/>
                            },
                            {
                                name: 'Email',
                                selector: 'email',
                                sortable: true,
                            },
                            {
                                name: 'Username',
                                selector: 'username',
                                sortable: true,
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
export default connect(mapToStateProps)(UserPage)
