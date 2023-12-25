import React, { Component } from "react";
import "../css/Home.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CallApi from "../API/CallAPI";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordVisible: false,
      userName: "",
      passWord: "",
      passwordError: false,
      loggedIn: false,
      usernameError: false,
      chooseMenu: false,
    };
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
  }

  togglePasswordVisibility = () => {
    const { passwordVisible } = this.state;
    this.setState({
      passwordVisible: !passwordVisible,
    });
  };

  handleUserNameChange = (event) => {
    this.setState({
      userName: event.target.value,
    });
  };

  handlePasswordChange = (event) => {
    this.setState({
      passWord: event.target.value,
    });
  };

  handleClickBox = () => {
    this.setState({
      passwordError: false,
      usernameError: false,
    });
  };
  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.getAccessToken();
    }
  };
  getAccessToken = () => {
    const { userName, passWord } = this.state;
    let link = `Login`;
    let body = {
      Username: userName,
      Password: passWord,
    };

    CallApi(link, "POST", body)
      .then((response) => {
        if (response.Status === 0) {
          sessionStorage.setItem("token", response.Data.Token);
          sessionStorage.setItem("roles", response.Data.Roles.toLowerCase());
          window.location.href = "/menu";
        } else {
          this.setState({
            usernameError: true,
            passwordError: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const {
      passwordVisible,
      userName,
      passWord,
      passwordError,
      usernameError,
    } = this.state;

    return (
      <div className="container-home">
        <div className="home">
          <div className="title">LOG IN</div>
          <div className="coverbutton distance-far">
            <div className="button">
              <input
                type="text"
                id="userName"
                value={userName}
                placeholder="User Name"
                style={{ cursor: "pointer" }}
                onChange={(e) => this.handleUserNameChange(e)}
                onClick={() => this.handleClickBox()}
                autoFocus
              />
            </div>
            <div
              className={
                passwordError
                  ? "buttonerror distance-near"
                  : "button distance-near"
              }
            >
              <input
                type={passwordVisible ? "text" : "password"}
                value={passWord}
                placeholder="Password"
                id="passwordInput"
                onChange={this.handlePasswordChange}
                onClick={this.handleClickBox}
                onKeyUp={(e) => this.handleKeyPress(e)}
              />
              <span onClick={this.togglePasswordVisibility}>
                {passwordVisible ? (
                  <FaEye style={{ color: "#0b5394" }} />
                ) : (
                  <FaEyeSlash style={{ color: "#0b5394" }} />
                )}
              </span>
            </div>
            {usernameError && (
              <div className="distance-near error">User name doesn't exist</div>
            )}
          </div>
          <div className="button-home distance-near">
            <input
              type="submit"
              value="Log In"
              id="blue-home"
              className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none blue-home"
              style={{ cursor: "pointer" }}
              onClick={(event) => {
                this.getAccessToken(event);
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
