import React, { Component } from "react";
import "../css/Notification.css";
import { FaCheckCircle } from "react-icons/fa";
export default class SucessNotification extends Component {
  render() {
    return (
      <div className="container-noti">
        <div className="container">
          <div id="green" className="text">
            SUCCESSFUL
          </div>
          <div className="img">
            <FaCheckCircle
              style={{ color: "#8bdb68", fontSize: "18px" }}
            ></FaCheckCircle>
          </div>
        </div>
      </div>
    );
  }
}
