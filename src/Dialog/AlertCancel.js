import React, { Component } from "react";
import "../css/AlertCancel.css";

class AlertCancel extends Component {
  render() {
    return (
      <div className="container-cancel">
        <div className="container-cancelDialog">
          <div className="title">Are you sure?</div>
          <div className="text">Are you sure about your decision?</div>
          <div className="sub">
            <div className="button-cancel">
              <input
                type="button"
                value="NO"
                id="blue-cancel"
                className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none blue-cancel"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  //this.handleStatusAlert(this.props.statusAlertActive, 0)
                  this.props.Refuse()
                }
              />
            </div>
            <div className="button-cancel">
              <input
                type="button"
                value="YES"
                id="red-cancel"
                className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none red-cancel"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  //this.handleStatusAlert(this.props.statusAlertActive, 1)
                  this.props.Accept()
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AlertCancel;
