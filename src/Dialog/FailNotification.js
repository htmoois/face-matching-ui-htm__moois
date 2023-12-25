import React, { Component } from "react";
import "../css/Notification.css";
import { FaExclamationCircle } from "react-icons/fa";
export default class FailNotification extends Component {
  render() {
    return (
      <div className="container-noti">
        <div className="container">
          <div id="red-noti" className="text">
            Something went wrong
          </div>
          <div className="img">
            <FaExclamationCircle
              style={{ color: "#f44336", fontSize: "18px" }}
            ></FaExclamationCircle>
          </div>
        </div>
      </div>
    );
  }
}
