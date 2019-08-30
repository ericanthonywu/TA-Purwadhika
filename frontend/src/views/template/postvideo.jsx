import React from "react";
import {MDBIcon} from "mdbreact";
import {defaultFormat} from "moment";

export default class PostVideo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            mute:true,
            seconds:0
        }
    }
    convertseconds(second){
        const sec_num = parseInt(second, 10); // don't forget the second param
        let hours   = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
    }
    render() {
        return (
            <div onClick={() => {
                this.setState({mute:!this.state.mute})
            }}>
                <span className={"video-time"}>{this.convertseconds(this.state.seconds)}</span>
                <video onTimeUpdate={e => this.setState({seconds:Math.round(e.target.currentTime)})}
                       className="video-fluid"
                       autoPlay
                       loop
                       muted={this.state.mute}>
                    <source src={this.props.src}
                            type={this.props.type}/>
                </video>
                <MDBIcon className={"video-volume-icon"} icon={`volume-${this.state.mute ? "mute" : "up" }`} />
            </div>
        )
    }
}
