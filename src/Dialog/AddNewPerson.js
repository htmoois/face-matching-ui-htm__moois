import React, { Component } from "react";
import "../css/AddNewPerson.css";
import { FaImage, FaFolder } from "react-icons/fa";
import AlertCancel from "./AlertCancel";
import CallApi from "../API/CallAPI";
import SucessNotification from "./SucessNotification";
import FailNotification from "./FailNotification";
class AddNewPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closeDialog: false,
      code: "",
      name: "",
      openAlertCancel: false,
      previewUrl: "",
      statusResponse: null,
      nameError: true,
      codeError: true,
      UrlError: true,
      checkError: false,
      existedPerson: false,
      imageExisted: false,
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
  handleClick = () => {
    this.setState({
      checkError: false,
      existedPerson: false,
      imageExisted: false,
    });
  };
  handleAddClick = () => {
    this.setState(
      (prevState) => {
        const { name, code, previewUrl } = prevState;
        let link = `Person`;
        let body = {
          Name: name,
          Code: code,
          Image: previewUrl.split(",")[1],
        };
        return { requestLink: link, bodyRequest: body };
      },
      () => {
        const { requestLink, bodyRequest } = this.state;
        CallApi(requestLink, "POST", bodyRequest)
          .then((response) => {
            if (response != null) {
              if (response.Status === 0) {
                this.setState({
                  statusResponse: true,
                  existedPerson: false,
                  imageExisted: false,
                });
                setTimeout(() => {
                  this.setState({ statusResponse: null });
                }, 3000);
                setTimeout(
                  () =>
                    this.setState({
                      name: "",
                      code: "",
                      previewUrl: "",
                    }),
                  1000
                );
              } else {
                this.setState({
                  statusResponse: false,
                });
                setTimeout(() => {
                  this.setState({ statusResponse: null });
                }, 3000);
                if (response.Data.includes("Person exist")) {
                  this.setState({
                    existedPerson: true,
                  });
                }
                if (response.Data.includes("This one's image was created")) {
                  this.setState({
                    imageExisted: true,
                  });
                }
              }
            } else {
              this.setState({
                statusResponse: null,
              });
            }
          })
          .catch((error) => {
            console.log("Couldn't add a new person because: ", error);
          });
      }
    );
  };
  handleOpenAlertCancel = () => {
    this.setState({
      openAlertCancel: true,
    });
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
      this.setState({ previewUrl: reader.result });
      if (reader.result !== null) {
        this.setState({ UrlError: false });
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  render() {
    const {
      closeDialog,
      name,
      code,
      openAlertCancel,
      previewUrl,
      statusResponse,
      nameError,
      codeError,
      UrlError,
      checkError,
      existedPerson,
      imageExisted,
    } = this.state;
    if (closeDialog) {
      return null;
    }
    return (
      <div>
        {openAlertCancel && (
          <AlertCancel
            Accept={() => {
              this.setState({
                openAlertCancel: false,
                code: "",
                name: "",
                previewUrl: "",
              });
              this.props.statusDialog();
            }}
            Refuse={() => this.setState({ openAlertCancel: false })}
          ></AlertCancel>
        )}

        <div className="container-all">
          <div className="container-add">
            <div className="left">
              <div className="title-add">ADD A NEW PERSON</div>
              <div
                className="box-add"
                id={nameError ? "border-red" : "border-blue"}
              >
                <input
                  type="text"
                  value={name}
                  placeholder="Enter name"
                  style={{ cursor: "pointer" }}
                  onChange={this.handleInputNameChange}
                  onClick={this.handleClick}
                  autoFocus
                />
              </div>
              <div
                className="box-add distance-add"
                id={codeError ? "border-red" : "border-blue"}
              >
                <input
                  type="text"
                  value={code}
                  placeholder="Enter code"
                  style={{ cursor: "pointer" }}
                  onChange={this.handleInputCodeChange}
                  onClick={() => this.handleClick()}
                />
              </div>
              <div className="subcontain-img">
                <div>
                  <FaFolder
                    style={{
                      color: "#7ac0d8",
                      fontSize: "6vh",
                      paddingRight: "2vw",
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
              {existedPerson && (
                <div className="text">
                  {" "}
                  Person's code existed. Please check again.
                </div>
              )}
              {imageExisted && (
                <div className="text">
                  Person's template was created. Please check again.
                </div>
              )}
              <div className="subcontain-button">
                <div className="button-add">
                  <input
                    type="button"
                    value="ADD"
                    id="blue-add"
                    className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none blue-add"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (!nameError && !codeError && !UrlError) {
                        this.handleAddClick();
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
                    onClick={this.handleOpenAlertCancel}
                  />
                </div>
              </div>
            </div>
            <div className="right">
              <div
                className="img"
                onClick={() => this.handleClickToChooseFile()}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={this.inputRef}
                  style={{ display: "none" }}
                  onChange={this.handleFileChange}
                />
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <div className="icon">
                    <FaImage
                      style={{
                        color: "#7ac0d8",
                        fontSize: "5vh",
                        paddingTop: "20vh",
                        paddingLeft: "2vw",
                        cursor: "pointer",
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
export default AddNewPerson;
