import React from "react";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBFormInline, MDBCard, MDBCardBody, MDBCardHeader, MDBIcon, MDBInput, MDBBtn, MDBModalFooter
} from "mdbreact";
import {Link} from "react-router-dom";


export default class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    submithandler = () => {

    }

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
                                        <MDBIcon icon="lock"/> My Profile:
                                    </h3>
                                </MDBCardHeader>
                                <form className={"needs-validation"} noValidate onSubmit={this.submitHandler}>
                                    <div className="d-flex justify-content-center">
                                       <div className={"custom-file-input-container"}>
                                           <div className="icon">
                                                <MDBIcon icon="plus" />
                                           </div>
                                       </div>
                                    </div>

                                    <div className="text-center mt-4">
                                        <MDBBtn
                                            color="light-blue"
                                            className="mb-3"
                                            type="button"
                                            onClick={this.submitHandler}
                                        >
                                            Register
                                        </MDBBtn>
                                    </div>
                                </form>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}