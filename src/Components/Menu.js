import React, { Component } from "react";
import "../css/Menu.css";
import {
  FaDatabase,
  FaCheckSquare,
  FaSearch,
  FaBars,
  FaRegArrowAltCircleLeft,
} from "react-icons/fa";
import { NavLink, Navigate } from "react-router-dom";
import AlertCancel from "../Dialog/AlertCancel";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chooseDatabase: false,
      chooseIdentify: false,
      chooseVerify: false,
      chooseHome: false,
      openNav: false,
      role: "",
      openAlertCancel: false,
      loggedOut: false,
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem("roles") !== null) {
      let roleString = sessionStorage.getItem("roles");
      let isAdmin = roleString.split(",").includes("admin");
      let role = "";
      if (isAdmin) {
        role = "admin";
      }
      this.setState({
        role: role,
      });
    }
  }
  chooseDatabase = () => {
    this.setState({
      chooseDatabase: false,
      chooseIdentify: false,
      chooseVerify: false,
      chooseHome: false,
    });
  };

  chooseIdentify = () => {
    this.setState({
      chooseDatabase: false,
      chooseIdentify: true,
      chooseVerify: false,
      chooseHome: false,
    });
  };

  chooseVerify = () => {
    this.setState({
      chooseDatabase: false,
      chooseIdentify: false,
      chooseVerify: true,
      chooseHome: false,
    });
  };

  chooseHome = () => {
    this.setState({
      chooseDatabase: false,
      chooseIdentify: false,
      chooseVerify: false,
      chooseHome: true,
      openAlertCancel: true,
    });
  };

  renderDatabase() {
    return (
      <li onClick={this.chooseDatabase}>
        <NavLink to="/database" className="menu-link" activeClassName="active">
          <div className="icon">
            <FaDatabase style={{ color: "#fdfdfd", fontSize: "20px" }} />
          </div>
          <div className="text">Database</div>
        </NavLink>
      </li>
    );
  }
  renderIdentify() {
    return (
      <li onClick={this.chooseIdentify}>
        <NavLink to="/identify" className="menu-link" activelassname="active">
          <div className="icon">
            <FaSearch style={{ color: "#fdfdfd", fontSize: "20px" }} />
          </div>
          <div className="text">Identify</div>
        </NavLink>
      </li>
    );
  }
  renderVerify() {
    return (
      <li onClick={this.chooseVerify}>
        <NavLink to="/verify" className="menu-link" activeclassname="active">
          <div className="icon">
            <FaCheckSquare style={{ color: "#fdfdfd", fontSize: "20px" }} />
          </div>
          <div className="text">Verify</div>
        </NavLink>
      </li>
    );
  }
  renderLogOut() {
    return (
      <li onClick={this.chooseHome}>
        <div className="menu-link" activeclassname="active">
          <div className="icon">
            <FaRegArrowAltCircleLeft
              style={{ color: "#fdfdfd", fontSize: "20px" }}
            />
          </div>
          <div className="text">Log Out</div>
        </div>
      </li>
    );
  }
  render() {
    const { role, openAlertCancel } = this.state;
    if (sessionStorage.getItem("token") === null) {
      return <Navigate to="/" />;
    }

    return (
      <div>
        {openAlertCancel && (
          <AlertCancel
            Accept={() => {
              this.setState({ openAlertCancel: false });
              sessionStorage.removeItem("roles");
              sessionStorage.removeItem("token");
              window.location.reload();
            }}
            Refuse={() => this.setState({ openAlertCancel: false })}
          ></AlertCancel>
        )}
        <div className="menu-container">
          <div className="menu-header">
            <div className="text">MENU</div>
            <div className="icon">
              <FaBars
                style={{
                  color: "#fdfdfd",
                  fontSize: "3vh",
                  paddingLeft: "12vw",
                }}
              />
            </div>
          </div>
          <div className="distance"></div>
          <ul className="menu">
            {role === "admin" && this.renderDatabase()}
            {this.renderIdentify()}
            {this.renderVerify()}
            {this.renderLogOut()}
          </ul>
        </div>
      </div>
    );
  }
}

export default Menu;
