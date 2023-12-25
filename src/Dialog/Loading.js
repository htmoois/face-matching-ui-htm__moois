import React, { Component } from "react";
import "../css/Loading.css";

class Loading extends Component {
  render() {
    return (
      <div className="container-load">
        <div className="loading-spinner"></div>
      </div>
    );
  }
}

export default Loading;
