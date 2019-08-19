import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Error404 from "./404";

export default function withAuth(ComponentToProtect) {
    // eslint-disable-next-line react/display-name
    return class extends Component {
        constructor(a) {
            super(a);
            this.state = {
                token: false
            };
        }
        // eslint-disable-next-line react/no-deprecated
        componentWillMount() {
            if (localStorage.getItem("token")) {
                this.setState({
                    token: true
                });
            }
        }

        render() {
            // const { token } = this.state;
            const token = true;
            if (token) {
                return (
                    <React.Fragment>
                        <ComponentToProtect {...this.props} />
                    </React.Fragment>
                );
            } else {
                return <Error404/>
            }
        }
    };
}
