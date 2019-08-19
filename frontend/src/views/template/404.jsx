import React from "react";
import {Link} from 'react-router-dom'

export default class Error404 extends React.Component{
    constructor(props) {
        super(props);

    }
    render() {
        return(
            <div style={{paddingTop: 100}} className={"errorcontainer"}>
                <div className="errorcenter">
                    <div style={{height:190}} className={"con404"}>
                        <h1>4 <span></span> 4</h1>
                    </div>
                    <h2>Oops! Page Not Be Found</h2>
                    <p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
                    <Link to={'/'}>Back to homepage</Link>
                </div>
            </div>
        )
    }

}