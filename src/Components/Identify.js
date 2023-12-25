import React, { Component } from "react";
import "../css/Database.css";
import "../css/Identify.css";
import {
  FaImage,
  FaFolder,
  FaPlayCircle,
  FaPauseCircle,
  FaRegImages,
} from "react-icons/fa";
import CallApi from "../API/CallAPI";
import DetailPerson from "../Dialog/DetailPerson";
import SucessNotification from "../Dialog/SucessNotification";
import FailNotification from "../Dialog/FailNotification";
import Loading from "../Dialog/Loading";

export default class Database extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentPage: 1,
      itemsPerPage: 10,
      inputPage: "",
      previewImg: "",
      openDatailPerson: false,
      itemPerson: [],
      check: null,
      checkData: null,
      urlError: true,
      checkError: false,
      loading: false,
      far: 60, //False acceptance rate
    };
    this.inputRef = React.createRef(null);
    this.initialInputValue = "";
    this.videoRef = React.createRef();
    this.frameRef = React.createRef();
    this.videoFrameRef = React.createRef();
    this.canvasRef = React.createRef();
    this.stream = null;
  }
  handleClickToChooseFile = () => {
    if (this.inputRef.current) {
      this.inputRef.current.click();
    }
  };
  handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.setState({
        previewImg: reader.result,
        checkData: null,
        urlError: false,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  getIdentify = () => {
    this.setState(
      (prevState) => {
        const { previewImg, far } = prevState;
        let link = `Person/Identify?thresold=` + far;
        let body = { Image: previewImg.split(",")[1] };
        return { requestLink: link, bodyRequest: body, loading: true };
      },
      () => {
        const { requestLink, bodyRequest } = this.state;
        CallApi(requestLink, "POST", bodyRequest)
          .then((response) => {
            if (response != null) {
              if (response.Status === 1) {
                console.log("Face not found");
                this.setState({
                  checkData: "FaceNotFound",
                });
                return;
              } else if (response.Status === 0) {
                this.setState({
                  check: true,
                  data: response.Data,
                });
                setTimeout(() => {
                  this.setState({ check: null });
                }, 3000);
                if (response.Data.length === 0) {
                  this.setState({
                    checkData: "NoTemplate",
                  });
                } else {
                  this.setState({ checkData: "Data" });
                }
              }
            } else {
              this.setState({
                check: false,
                data: [],
              });
              setTimeout(() => {
                this.setState({ check: null });
              }, 3000);
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            this.setState({
              loading: false,
            });
          });
      }
    );
  };
  sortData = () => {
    const { data } = this.state;
    this.setState({
      data: data.sort((a, b) => b.score - a.score),
    });
  };
  handleClickItem = (item) => {
    this.setState({
      itemPerson: item,
      openDetailPerson: true,
    });
  };
  componentWillUnmount() {
    this.stopCamera();
  }
  startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const video = this.videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
          // Set the stream as the source for the video frame
          const videoFrame = this.videoFrameRef.current;
          if (videoFrame) {
            videoFrame.srcObject = stream;
            videoFrame.play();
          }
        }
      }
      this.setState({
        openCamera: true,
      });
    } catch (error) {
      console.error("Failed to start camera:", error);
    }
  };
  stopCamera = () => {
    const video = this.videoRef.current;
    const videoFrame = this.videoFrameRef.current;
    if (video) {
      const stream = video.srcObject;
      const tracks = stream && stream.getTracks();
      tracks && tracks.forEach((track) => track.stop());
    }
    if (videoFrame) {
      const stream = videoFrame.srcObject;
      const tracks = stream && stream.getTracks();
      tracks && tracks.forEach((track) => track.stop());
    }
    this.setState({
      openCamera: false,
    });
  };

  captureImage = () => {
    const videoFrame = this.videoFrameRef.current;
    const canvas = this.canvasRef.current;
    if (videoFrame && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = videoFrame.videoWidth;
      canvas.height = videoFrame.videoHeight;
      context.drawImage(videoFrame, 0, 0, canvas.width, canvas.height);
      // Do something with the captured image, e.g., upload to server or display on the UI
    }
    const imageData = canvas.toDataURL("image/png");

    this.setState({
      previewImg: imageData,
      urlError: false,
    });
  };
  handleFarChange = (event) => {
    const far = parseInt(event.target.value);
    this.setState({ far });
  };
  renderPagination() {
    let { far } = this.state;

    return (
      <div className="pagination">
        <select value={far} onChange={this.handleFarChange}>
          <option value={24}>1%</option>
          <option value={36}>0.1%</option>
          <option value={48}>0.01%</option>
          <option value={60}>0.001%</option>
          <option value={72}>0.0001%</option>
          <option value={84}>0.00001%</option>
        </select>
      </div>
    );
  }

  renderShowData() {
    const { data, checkData } = this.state;
    return (
      <div className="only-table">
        <table className="table-id">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Image</th>
              <th>Rate</th>
            </tr>
          </thead>
          {checkData === "Data" && (
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td onClick={() => this.handleClickItem(item)}>
                    {index + 1}
                  </td>
                  <td onClick={() => this.handleClickItem(item)}>
                    {item.Name}
                  </td>
                  <td onClick={() => this.handleClickItem(item)}>
                    <img
                      src={"data:image/jpeg;base64," + item.Image}
                      alt="Person"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </td>
                  <td onClick={() => this.handleClickItem(item)}>
                    {item.Score}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {checkData === "NoTemplate" && (
          <div className="return-false">Not found template</div>
        )}
        {checkData === "FaceNotFound" && (
          <div className="return-false">Face Not Found</div>
        )}
      </div>
    );
  }
  handleClick = () => {
    this.setState({
      checkError: false,
    });
  };
  handleClickDeleteImg = () => {
    this.setState({
      previewImg: "",
    });
  };
  render() {
    let { previewImg, openDetailPerson, check, urlError, checkError, loading } =
      this.state;
    return (
      <div>
        {openDetailPerson && (
          <DetailPerson
            item={this.state.itemPerson}
            close={() => this.setState({ openDetailPerson: false })}
            typeMatching={"identify"}
          ></DetailPerson>
        )}
        {loading && <Loading></Loading>}
        <div className="container">
          <div class="title">Identify</div>
          <div className="distance"></div>
          <div className="container-bar">
            <div className="container">
              <div className="button">
                <input
                  type="button"
                  value="DELETE IMAGE"
                  id="red"
                  className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none red"
                  style={{ marginLeft: "88.5vw", cursor: "pointer" }}
                  onClick={() => {
                    this.handleClickDeleteImg();
                  }}
                />
              </div>
            </div>
          </div>
          <div className="subcontainer distance-ver">
            <div className="left-side">
              <div className="table-container">
                {this.renderShowData()}
                <div
                  id="background-pagination"
                  className="pagination-container"
                >
                  <div className="text" style={{ paddingRight: "0.5vw" }}>
                    FAR:{" "}
                  </div>
                  {this.renderPagination()}
                </div>
              </div>
            </div>
            <div className="right-side">
              <div className="table-container">
                <div className="table-container-id">
                  <div id="box-urlErrorFalse" className="box">
                    <input
                      type="file"
                      name="Choose a file"
                      accept="image/*"
                      ref={this.inputRef}
                      style={{ display: "none" }}
                      onChange={this.handleFileChange}
                    />
                    {previewImg ? (
                      <img
                        src={previewImg}
                        alt="Preview"
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <div className="icon">
                        <FaImage
                          style={{
                            color: "#7ac0d8",
                            fontSize: "5vh",
                            paddingTop: "19vh",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="container-camera">
                    <div className="leftSide-tableId">
                      <div className="subcontainID-img">
                        <div>
                          <FaFolder
                            style={{
                              color: "#7ac0d8",
                              fontSize: "4vh",
                              paddingRight: "2vw",
                              cursor: "pointer",
                            }}
                            onClick={this.handleClickToChooseFile}
                          ></FaFolder>
                        </div>
                        {checkError && urlError ? (
                          <div
                            className="text"
                            onClick={() => {
                              this.handleClickToChooseFile();
                              this.handleClick();
                            }}
                          >
                            Forgot choosing a file{" "}
                            <span className="label">*</span>
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
                      {this.state.openCamera ? (
                        <div className="subcontainID-img">
                          <div>
                            <FaPauseCircle
                              style={{
                                color: "#7ac0d8",
                                fontSize: "4vh",
                                paddingRight: "2vw",
                                cursor: "pointer",
                              }}
                              onClick={this.stopCamera}
                            ></FaPauseCircle>
                          </div>
                          <div className="text" onClick={this.stopCamera}>
                            Stop camera
                          </div>
                        </div>
                      ) : (
                        <div className="subcontainID-img">
                          <div>
                            <FaPlayCircle
                              style={{
                                color: "#7ac0d8",
                                fontSize: "4vh",
                                paddingRight: "2vw",
                                cursor: "pointer",
                              }}
                              onClick={this.startCamera}
                            ></FaPlayCircle>
                          </div>
                          <div className="text" onClick={this.startCamera}>
                            Open camera
                          </div>
                        </div>
                      )}
                      <div className="subcontainID-img">
                        <div>
                          <FaRegImages
                            style={{
                              color: "#7ac0d8",
                              fontSize: "4vh",
                              paddingRight: "2vw",
                              cursor: "pointer",
                            }}
                            onClick={this.captureImage}
                          ></FaRegImages>
                        </div>
                        <div className="text" onClick={this.captureImage}>
                          Capture image
                        </div>
                      </div>
                    </div>
                    <div className="rightSide-tableId">
                      <div className="frame-container">
                        <video
                          ref={this.videoRef}
                          style={{ display: "none" }}
                        ></video>
                        <div ref={this.frameRef} className="frame">
                          <video
                            ref={this.videoFrameRef}
                            className="video-frame"
                            autoPlay
                            playsInline
                            style={{ width: "100%", height: "100%" }}
                          ></video>
                        </div>
                      </div>
                      <canvas
                        ref={this.canvasRef}
                        style={{ display: "none" }}
                      ></canvas>
                    </div>
                  </div>
                  <div id="identify" className="button-id">
                    <input
                      type="button"
                      value="IDENTIFY"
                      id="blue-add"
                      className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none blue-add"
                      style={{ marginTop: "0.5vh", cursor: "pointer" }}
                      onClick={() => {
                        if (!urlError) {
                          this.getIdentify();
                          this.sortData();
                        } else {
                          this.setState({
                            checkError: true,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {check === true && <SucessNotification></SucessNotification>}
        {check === false && <FailNotification></FailNotification>}
      </div>
    );
  }
}
