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

class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            blockModal: false,
            username: "",
            id:""
        }
    }

    componentDidMount() {
        Axios.post(`${api_url}users`, {
            token: this.props.token
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
    toggleBlockModal = () => {
        this.setState({
            blockModal: !this.state.blockModal
        });
    }
    toggleSuspendModal = () => {
        this.setState({
            suspendModal: !this.state.suspendModal
        });
    }

    render() {
        return (
            <MDBCard>
                <MDBContainer>
                    <MDBBtn onClick={this.toggleBlockModal}>Modal</MDBBtn>
                    <MDBModal isOpen={this.state.blockModal} toggle={this.toggleBlockModal}>
                        <MDBModalHeader toggle={this.toggleBlockModal}>Block Users {this.state.username} ?</MDBModalHeader>
                        <MDBModalBody>
                            (...)
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={this.toggleBlockModal}>Close</MDBBtn>
                            <MDBBtn color="primary">Save changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
                <MDBCardBody>
                    <MDBCardTitle>Users Data</MDBCardTitle>
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
                                cell: rows => <>
                                    <MDBBtn size={"sm"} gradient={"frozen-dreams"} onClick={() => this.setState({blockModal:true,username: rows.username,id: rows._id})}>Block</MDBBtn>
                                    <MDBBtn size={"sm"} gradient={"sunny-morning"}>Suspend</MDBBtn>
                                </>
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
                    {/*<MDBDataTable data={this.state.data} hover autoWidth responsive/>*/}
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
