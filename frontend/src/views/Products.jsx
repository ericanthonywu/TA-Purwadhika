import React from "react";
import {
    MDBBtn,
    MDBRow,
    MDBCol,
    MDBContainer,
    MDBCard,
    MDBCardImage,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardFooter,
    MDBIcon,
    MDBTooltip,
} from "mdbreact";

const Item = () => {
    return (
        <section className="text-center my-5">
            <h2 className="h1-responsive font-weight-bold text-center my-5">
                Our bestsellers
            </h2>
            <p className="grey-text text-center w-responsive mx-auto mb-5">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit,
                error amet numquam iure provident voluptate esse quasi, veritatis
                totam voluptas nostrum quisquam eum porro a pariatur veniam.
            </p>
            <MDBContainer>
                <MDBRow>
                    <MDBCol lg="3" md="6" className="mb-lg-0 mb-4">
                        <MDBCard cascade narrow ecommerce>
                            <MDBCardImage
                                cascade
                                src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Vertical/1.jpg"
                                top
                                alt="sample photo"
                                overlay="white-slight"
                            />
                            <MDBCardBody cascade className="text-center">
                                <a href="#!" className="grey-text">
                                    <h5>Denim</h5>
                                </a>
                                <MDBCardTitle>
                                    <strong>
                                        <a href="#!">Denim trousers</a>
                                    </strong>
                                </MDBCardTitle>
                                <ul className="rating">
                                    <li>
                                        <MDBIcon icon="star"/>
                                    </li>
                                    <li>
                                        <MDBIcon icon="star"/>
                                    </li>
                                    <li>
                                        <MDBIcon icon="star"/>
                                    </li>
                                    <li>
                                        <MDBIcon icon="star"/>
                                    </li>
                                    <li>
                                        <MDBIcon far icon="star"/>
                                    </li>
                                </ul>
                                <MDBCardText>
                                    Neque porro quisquam est, qui dolorem ipsum quia dolor sit.
                                </MDBCardText>
                                <MDBCardFooter className="px-1">
                                <span className="float-left font-weight-bold">
                                  <strong>49$</strong>
                                </span>
                                    <span className="float-right">
                                      <MDBTooltip
                                          placement="top">
                                          <a><i className={"fa fa-shopping-cart grey-text ml-3"}></i></a>
                                        <div>
                                          Add to cart
                                        </div>
                                      </MDBTooltip>
                            </span>
                                </MDBCardFooter>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
};

export default Item;