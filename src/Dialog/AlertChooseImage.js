import React, { Component } from "react";
import "../css/Notification.css";
import { FaRegUserCircle } from "react-icons/fa";
export default class ChooseImage extends Component {
  render() {
    return (
      <div className="container-noti">
        <div className="container">
          <div id="blue-noti" className="text">
            Choose human image
          </div>
          <div className="img">
            <FaRegUserCircle
              style={{ color: "#379abc", fontSize: "18px" }}
            ></FaRegUserCircle>
          </div>
        </div>
      </div>
    );
  }
}
