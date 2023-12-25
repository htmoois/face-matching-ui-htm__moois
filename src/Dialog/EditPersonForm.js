import React, { Component } from "react";
import "../css/AddNewPerson.css";
import { FaImage, FaFolder } from "react-icons/fa";
import CallApi from "../API/CallAPI";
import SucessNotification from "./SucessNotification";
import FailNotification from "./FailNotification";
class EditPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closeDialog: false,
      name: this.props.item.Name,
      code: this.props.item.Code,
      gender: "Unknown",
      address: "Unknown",
      image: this.props.item.Image,
      nameError: false,
      codeError: false,
      checkError: false,
      UrlError: false,
      changeImage: false,
      statusResponse: null,
    };
    this.inputRef = React.createRef(null);
  }
  handleInputNameChange = (event) => {
    let inputName = event.target.value;
    this.setState({
      name: inputName,
      nameError: inputName === "",
    });
  };

  handleInputCodeChange = (event) => {
    let inputCode = event.target.value;
    this.setState({
      code: inputCode,
      codeError: inputCode.length < 9 || inputCode.length > 12,
    });
  };
  handleClickClose = () => {
    this.setState({
      closeDialog: true,
    });
    this.props.close();
  };
  handleClickToChooseFile = () => {
    if (this.inputRef.current) {
      this.inputRef.current.click();
    }
  };
  handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.setState({ image: reader.result, changeImage: true });
      if (reader.result !== null) {
        this.setState({ UrlError: false });
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  handleClick = () => {
    this.setState({
      checkError: false,
    });
  };
  handleClickAdd = () => {
    this.setState(
      (prevState) => {
        const { name, code, image } = prevState;
        return { name: name, code: code, image: image };
      },
      () => {
        const { name, code, image } = this.state;
        let link = `Person/`;
        let query = this.props.item.PersonID;
        let requestLink = link + query;
        let bodyRequest = {
          Name: name,
          Code: code,
          Image: image.includes("data") ? image.split(",")[1] : image,
        };
        CallApi(requestLink, "PUT", bodyRequest)
          .then((response) => {
            if (response != null) {
              this.setState({
                statusResponse: true,
              });
              setTimeout(() => {
                this.setState({ statusResponse: null });
              }, 2000);
              setTimeout(() => {
                this.props.close();
              }, 1000);
            } else {
              this.setState({
                statusResponse: false,
              });
              setTimeout(() => {
                this.setState({ statusResponse: null });
              }, 3000);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
  };
  render() {
    const {
      closeDialog,
      name,
      code,
      gender,
      address,
      image,
      nameError,
      codeError,
      UrlError,
      checkError,
      changeImage,
      statusResponse,
    } = this.state;
    if (closeDialog) {
      return null;
    }
    return (
      <div>
        <div className="container-all">
          <div className="container-add">
            <div className="left">
              <div className="title-add">EDIT INFORMATION</div>
              <div
                className="box-add"
                id={nameError ? "border-red" : "border-blue"}
              >
                <div className="container">
                  <div className="box">Name: </div>
                  <input
                    type="text"
                    value={name !== undefined ? name.toUpperCase() : ""}
                    className="text"
                    onChange={(e) => {
                      this.handleInputNameChange(e);
                    }}
                  ></input>
                </div>
              </div>
              <div
                className="box-add distance-add"
                id={codeError ? "border-red" : "border-blue"}
              >
                <div className="container">
                  <div className="box">Code: </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      this.handleInputCodeChange(e);
                    }}
                    className="text"
                  ></input>
                </div>
              </div>
              <div className="box-add distance-add" id="border-blue">
                <div className="container">
                  <div className="box">Gender: </div>
                  <input type="text" value={gender} className="text"></input>
                </div>
              </div>
              <div className="box-add distance-add" id="border-blue">
                <div className="container">
                  <div className="box">Address: </div>
                  <input
                    type="text"
                    value={address}
                    className="text sroll"
                  ></input>
                </div>
              </div>
              <div className="subcontain-img">
                <div>
                  <FaFolder
                    style={{
                      color: "#7ac0d8",
                      fontSize: "50px",
                      paddingRight: "20px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      this.handleClickToChooseFile();
                      this.handleClick();
                    }}
                  ></FaFolder>
                </div>
                {checkError && UrlError ? (
                  <div
                    className="text"
                    onClick={() => {
                      this.handleClickToChooseFile();
                      this.handleClick();
                    }}
                  >
                    Forgot choosing a file <span className="label">*</span>
                  </div>
                ) : (
                  <div
                    className="text"
                    onClick={() => {
                      this.handleClickToChooseFile();
                      this.handleClick();
                    }}
                  >
                    Choose a file <span className="label">*</span>
                  </div>
                )}
              </div>
              <div>
                <div className="button-add">
                  <input
                    type="button"
                    value="ADD"
                    id="blue-add"
                    className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none blue-add"
                    style={{ marginTop: "5px", cursor: "pointer" }}
                    onClick={() => {
                      if (!nameError && !codeError && !UrlError) {
                        this.handleClickAdd();
                      } else {
                        this.setState({
                          checkError: true,
                        });
                      }
                    }}
                  />
                </div>
                <div className="button-add">
                  <input
                    type="button"
                    value="CANCEL"
                    id="red-add"
                    className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none red-add"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.handleClickClose();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="right">
              <div className="img">
                <input
                  type="file"
                  accept="image/*"
                  ref={this.inputRef}
                  style={{ display: "none" }}
                  onChange={this.handleFileChange}
                />
                {image ? (
                  <img
                    src={
                      changeImage ? image : "data:image/jpeg;base64," + image
                    }
                    alt="Person"
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <div className="icon">
                    <FaImage
                      style={{
                        color: "#7ac0d8",
                        fontSize: "50px",
                        paddingTop: "190px",
                        paddingLeft: "20px",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {statusResponse === true && <SucessNotification></SucessNotification>}
        {statusResponse === false && <FailNotification></FailNotification>}
      </div>
    );
  }
}
export default EditPerson;
