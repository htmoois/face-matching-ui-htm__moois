import React, { Component } from "react";
import "../css/Database.css";
import CallApi from "../API/CallAPI";
import {
  FaImage,
  FaFolder,
  FaPlayCircle,
  FaPauseCircle,
  FaRegImages,
} from "react-icons/fa";
import SucessNotification from "../Dialog/SucessNotification";
import FailNotification from "../Dialog/FailNotification";
import ChooseImage from "../Dialog/AlertChooseImage";
import "../css/Identify.css";
import DetailPerson from "../Dialog/DetailPerson";
import Loading from "../Dialog/Loading";

export default class Database extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectAllChecked: false,
      currentPage: 1,
      itemsPerPage: 50,
      inputPage: "",
      keyword: "",
      dataChecked: [],
      dataLength: "",
      previewImg: "",
      result: [],
      checkData: null,
      openDetailPerson: false,
      openResultDialog: false,
      checkStatus: null,
      urlError: null,
      loading: false,
      imageError: null,
      openCamera: false,
      itemPerson: [],
    };
    this.initialInputValue = "";
    this.inputRef = React.createRef(null);
    this.videoRef = React.createRef();
    this.frameRef = React.createRef();
    this.videoFrameRef = React.createRef();
    this.canvasRef = React.createRef();
    this.stream = null;
  }

  componentDidMount = () => {
    this.getDatabaseApi();
  };

  //Hàm Get API để lấy dữ liệu database
  getDatabaseApi = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        const { keyword, currentPage, itemsPerPage } = this.state;
        let link = `Person?pageSize=${itemsPerPage}&pageNumber=${currentPage}`;
        if (keyword !== "") {
          link = `${link}&keyword=${keyword}`;
        }
        CallApi(link, "GET", null)
          .then((response) => {
            if (response != null) {
              this.setState({
                data: response.Data.Result,
                dataLength: response.Data.Total,
              });
            } else {
              this.setState({
                data: [],
                dataLength: "",
              });
            }
          })
          .catch((error) => {
            console.log("Couldn't gat data from database because: ", error);
          })
          .finally(() => {
            this.setState({
              loading: false,
            });
          });
      }
    );
  };

  //Hàm thay đổi số lượng item hiển thị trên một trang
  handleItemsPerPageChange = (event) => {
    const itemsPerPage = parseInt(event.target.value);
    this.setState({ itemsPerPage, currentPage: 1 });
  };

  //Hàm nhập vào số thứ tự trang muốn chuyển đến
  handleInputPageChange = (event) => {
    this.setState({
      inputPage: event.target.value,
    });
  };

  //Nhấn Enter để đổi sang page mong muốn
  handleOnPressChange = (event) => {
    event.preventDefault();
    if (event.key === "Enter") {
      //13: Enter
      const { data, dataLength, itemsPerPage } = this.state;
      let { currentPage, inputPage } = this.state;
      const totalPages = Math.ceil(dataLength / itemsPerPage);
      const input = parseInt(inputPage);
      if (input > 0 && input < totalPages + 1) {
        currentPage = input;
      } else {
        inputPage = this.initialInputValue;
      }
      this.setState(() => {
        return {
          currentPage: currentPage,
          inputPage: inputPage,
        };
      });
      this.getDatabaseApi();
      const { dataChecked } = this.state;
      const check = data.every((item) => dataChecked.includes(item.PersonID));
      this.setState(() => {
        return {
          selectAllChecked: check,
          dataCheckedNotNull: true,
        };
      });
    }
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  //Click vào button Previous để lùi lại trước đó một trang
  handlePreviousClick = () => {
    const { data } = this.state;
    let { currentPage } = this.state;
    if (currentPage > 1) {
      currentPage = currentPage - 1;
    }
    this.setState(() => {
      return { currentPage: currentPage };
    });
    const { dataChecked } = this.state;
    const check = data.every((item) => dataChecked.includes(item.PersonID));
    this.setState(() => {
      return {
        selectAllChecked: check,
      };
    });
  };

  //Click vào button After để chuyển sang trang kế tiếp
  handleNextClick = () => {
    const { data, dataLength, itemsPerPage } = this.state;
    const totalPages = Math.ceil(dataLength / itemsPerPage);
    this.setState((prevState) => {
      if (prevState.currentPage < totalPages) {
        return {
          currentPage: prevState.currentPage + 1,
        };
      }
    });
    const { dataChecked } = this.state;
    const check = data.every((item) => dataChecked.includes(item.PersonID));
    this.setState(() => {
      return {
        selectAllChecked: check,
      };
    });
  };
  handleStartEllipsisClick = () => {
    const { data } = this.state;
    let { currentPage } = this.state;
    if (currentPage > 3) {
      currentPage = currentPage - 3;
    }
    this.setState(() => {
      return { currentPage: currentPage };
    });
    const { dataChecked } = this.state;
    if (dataChecked !== null) {
      const check = data.every((item) => dataChecked.includes(item.PersonID));
      this.setState(() => {
        return {
          selectAllChecked: check,
        };
      });
    }
  };
  handleEndEllipsisClick = () => {
    const { data, dataLength, itemsPerPage } = this.state;
    let { currentPage } = this.state;
    const totalPages = Math.ceil(dataLength / itemsPerPage);
    if (currentPage < totalPages - 2) {
      currentPage = currentPage + 3;
    }
    this.setState(() => {
      return { currentPage: currentPage };
    });
    const { dataChecked } = this.state;
    const check = data.every((item) => dataChecked.includes(item.PersonID));
    this.setState(() => {
      return {
        selectAllChecked: check,
      };
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
      this.setState({ previewImg: reader.result, urlError: false });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  handleInputKeyword = (event) => {
    this.setState({
      keyword: event.target.value,
    });
  };
  handleSearchInputPress = (event) => {
    if (event.key === "Enter") {
      this.setState({
        currentPage: 1,
      });
      this.getDatabaseApi();
    }
  };
  handleMouseEnter = (item, index) => {
    this.getPersonApi(item, index);
  };

  renderPagination() {
    const { currentPage, itemsPerPage, inputPage, dataLength } = this.state;
    const totalPages = Math.ceil(dataLength / itemsPerPage);
    const maxDisplayedPages = 4;
    const showEllipsisStart = currentPage > maxDisplayedPages - 1;
    const showEllipsisEnd = totalPages - currentPage > maxDisplayedPages - 1;

    const pageNumbers = [];
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxDisplayedPages) {
      const middlePage = Math.floor(maxDisplayedPages / 2);
      if (currentPage <= middlePage) {
        endPage = maxDisplayedPages;
      } else if (currentPage >= totalPages - middlePage) {
        startPage = totalPages - maxDisplayedPages + 1;
      } else {
        startPage = currentPage - middlePage;
        endPage = currentPage + middlePage;
      }
    }
    if (showEllipsisStart > 3) {
      pageNumbers.push(
        <li
          key="startEllipsis"
          className="ellipsis"
          onClick={() => {
            this.handleStartEllipsisClick();
            this.getDatabaseApi();
          }}
        >
          ...
        </li>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={i === currentPage ? "active" : ""}
          onClick={() => {
            this.handlePageChange(i);
            this.getDatabaseApi();
          }}
        >
          {i}
        </li>
      );
    }

    if (showEllipsisEnd) {
      pageNumbers.push(
        <li
          key="endEllipsis"
          className="ellipsis"
          onClick={() => {
            this.handleEndEllipsisClick();
            this.getDatabaseApi();
          }}
        >
          ...
        </li>
      );
    }

    return (
      <div className="pagination">
        <select
          value={itemsPerPage}
          onChange={this.handleItemsPerPageChange}
          onClick={() => {
            this.getDatabaseApi();
          }}
        >
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={150}>150</option>
          <option value={200}>200</option>
        </select>
        <ul className="page-list">{pageNumbers}</ul>
        <li>
          <div className="box">
            <input
              type="text"
              min={1}
              max={totalPages}
              value={inputPage}
              style={{ cursor: "pointer" }}
              onChange={this.handleInputPageChange}
              onKeyUp={this.handleOnPressChange}
            />
          </div>
        </li>
      </div>
    );
  }
  clickOnCheckBox = (item) => {
    const { dataChecked, data } = this.state;
    const updatedDataChecked = [...dataChecked];
    if (updatedDataChecked.includes(item.PersonID)) {
      updatedDataChecked.splice(updatedDataChecked.indexOf(item.PersonID), 1);
    } else {
      updatedDataChecked.push(item.PersonID);
    }
    const check = data.every((item) =>
      updatedDataChecked.includes(item.PersonID)
    );
    this.setState((prevState) => {
      return {
        dataChecked: updatedDataChecked,
        selectAllChecked: check,
        checkData: true,
      };
    });
  };

  updateCheckAllValue = () => {
    const { data, dataChecked } = this.state;
    const check = data.every((item) => dataChecked.includes(item.PersonID));

    this.setState({ selectAllChecked: check });
  };

  checkAll = () => {
    const { data, dataChecked, selectAllChecked } = this.state;
    const updatedDataChecked = [...dataChecked];
    if (selectAllChecked === false) {
      data.forEach((item) => {
        if (!updatedDataChecked.includes(item.PersonID)) {
          updatedDataChecked.push(item.PersonID);
        }
      });
    } else {
      data.forEach((item) => {
        const index = updatedDataChecked.indexOf(item.PersonID);
        if (index !== -1) {
          updatedDataChecked.splice(index, 1);
        }
      });
    }
    this.updateCheckAllValue();
    this.setState({
      dataChecked: updatedDataChecked,
      selectAllChecked: !selectAllChecked,
      checkData: true,
    });
  };
  handleClickVerify = () => {
    this.setState(
      (prevState) => {
        const { previewImg, dataChecked } = prevState;
        return { previewImg: previewImg, dataChecked: dataChecked };
      },
      () => {
        const { dataChecked, previewImg } = this.state;
        if (dataChecked.length !== 0 && previewImg.length !== 0) {
          let link = `Person/Verify?personId=`;
          let query = dataChecked.toString();
          let requestLink = link + query;
          let bodyRequest = { Image: previewImg.split(",")[1] };
          CallApi(requestLink, "POST", bodyRequest)
            .then((response) => {
              if (response != null) {
                if (response.Status === 0) {
                  this.setState({
                    checkStatus: true,
                    result: response.Data,
                  });
                  setTimeout(() => {
                    this.setState({ checkStatus: null });
                  }, 3000);
                } else {
                  this.setState({
                    result: [],
                    imgError: true,
                  });
                  setTimeout(() => {
                    this.setState({ imgError: null });
                  }, 3000);
                }
              } else {
                this.setState({
                  checkStatus: false,
                  result: [],
                });
                setTimeout(() => {
                  this.setState({ checkStatus: null });
                }, 3000);
              }
            })
            .catch((error) => {
              console.log("Couldn't verify because: ", error);
            });
        } else if (dataChecked.length === 0 && previewImg.length !== 0) {
          this.setState({
            checkData: false,
          });
        } else if (dataChecked.length !== 0 && previewImg.length === 0) {
          this.setState({
            urlError: true,
          });
        } else {
          this.setState({
            checkData: false,
            urlError: true,
          });
        }
      }
    );
  };
  handleClickItem = (item, index) => {
    this.setState(
      () => {
        this.getPersonApi(item, index);
      },
      () => {
        this.setState({
          openDetailPerson: true,
          itemPerson: item,
        });
      }
    );
  };
  handleClickUncheckAll = () => {
    this.setState({
      dataChecked: [],
      selectAllChecked: false,
      checkData: false,
      result: [],
    });
  };
  handleClickDeleteImg = () => {
    this.setState({
      previewImg: "",
    });
  };

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

  componentWillUnmount() {
    this.stopCamera();
  }
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
  renderShowData() {
    const { selectAllChecked, result } = this.state;

    return (
      <table id="data-list" className="table">
        <thead>
          <tr>
            <th onChange={this.checkAll}>
              <input
                type="checkbox"
                id="select-all"
                checked={selectAllChecked}
              ></input>
            </th>
            <th>No.</th>
            <th>Name</th>
            <th>Image</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map((item, index) => {
            const isSelected = this.state.dataChecked.includes(item.PersonID);
            return (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={this.state.dataChecked.includes(item.PersonID)}
                    onChange={() => this.clickOnCheckBox(item)}
                  />
                </td>
                <td
                  onClick={() => this.handleClickItem(item, index)}
                  onMouseEnter={
                    item.Image !== undefined && item.Image !== ""
                      ? () => {}
                      : () => this.handleMouseEnter(item, index)
                  }
                >
                  {index + 1}
                </td>
                <td
                  onClick={() => {
                    this.handleClickItem(item, index);
                  }}
                  onMouseEnter={
                    item.Image !== undefined && item.Image !== ""
                      ? () => {}
                      : () => this.handleMouseEnter(item, index)
                  }
                >
                  {item.Name}
                </td>
                <td
                  onClick={() => this.handleClickItem(item, index)}
                  onMouseEnter={
                    item.Image !== undefined && item.Image !== ""
                      ? () => {}
                      : () => this.handleMouseEnter(item, index)
                  }
                >
                  {item.Image !== undefined && item.Image !== "" ? (
                    <img
                      src={"data:image/jpeg;base64," + item.Image}
                      alt="Thumnail"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div className="icon ">
                      <FaImage
                        style={{
                          color: "#7ac0d8",
                          fontSize: "4vh",
                          padding: "10vh",
                        }}
                      />
                    </div>
                  )}
                </td>
                {isSelected && (
                  <td>
                    {result.length !== 0
                      ? result.find(
                          (resultItem) => resultItem.PersonID === item.PersonID
                        )?.Score
                      : null}
                  </td>
                )}
                {!isSelected && (
                  <td
                    onClick={() => this.handleClickItem(item, index)}
                    onMouseEnter={
                      item.Image !== undefined && item.Image !== ""
                        ? () => {}
                        : () => this.handleMouseEnter(item, index)
                    }
                  ></td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  getPersonApi = (item, index) => {
    let link = `Person/` + item.PersonID;
    this.setState(
      (prevState) => {},
      () => {
        CallApi(link, "GET", null)
          .then((response) => {
            if (response != null) {
              let rs = response.Data !== null ? response.Data : null;
              const { data } = this.state;
              const item = [...data];
              if (rs !== null) {
                item[index] = rs;
              }
              console.log(index);
              console.log(item[index]);
              this.setState({
                data: item,
              });
            } else {
              this.setState({
                statusResponse: false,
              });
            }
            setTimeout(() => {
              this.setState({ statusResponse: null });
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
  };
  render() {
    let {
      keyword,
      previewImg,
      checkStatus,
      openDetailPerson,
      checkData,
      urlError,
      loading,
      imgError,
      itemPerson,
    } = this.state;

    return (
      <div>
        {openDetailPerson && itemPerson !== undefined && (
          <DetailPerson
            item={itemPerson}
            close={() => this.setState({ openDetailPerson: false })}
            typeMatching={"verify"}
          ></DetailPerson>
        )}
        {loading && <Loading></Loading>}
        <div className="container">
          <div class="title">Verify</div>
          <div className="distance"></div>
          <div className="container-bar">
            <div class="button distance-ver">
              <input
                type="submit"
                value="SEARCH"
                id="blue"
                className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none blue"
                style={{ cursor: "pointer" }}
                onClick={() => this.getDatabaseApi()}
              />
            </div>
            <div className="search-bar">
              <input
                type="text"
                value={keyword}
                onChange={this.handleInputKeyword}
                onKeyUp={this.handleSearchInputPress}
                placeholder="Keyword"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="container">
              <div className="button">
                <input
                  type="button"
                  value="UNCHECK ALL"
                  id="blue"
                  className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none blue"
                  style={{
                    marginLeft: "-13vw",
                    paddingBottom: "1vh",
                    cursor: "pointer",
                  }}
                  onClick={() => this.handleClickUncheckAll()}
                />
              </div>
              <div className="button">
                <input
                  type="button"
                  value="DELETE IMAGE"
                  id="red"
                  className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none red"
                  style={{ marginLeft: "12.2vw", cursor: "pointer" }}
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
                <div className="only-table">{this.renderShowData()}</div>
                <div className="pagination-container">
                  <div className="text">Total items: </div>
                  <div className="text">{" " + this.state.dataLength}</div>
                  <div className="pagination">
                    <li>
                      <div className="button">
                        <input
                          type="button"
                          value="Previous"
                          id="blue"
                          className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none blue"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            this.handlePreviousClick();
                            this.getDatabaseApi();
                          }}
                        />
                      </div>
                    </li>
                    <li>
                      <div>{this.renderPagination()}</div>
                    </li>
                    <div className="button">
                      <input
                        type="button"
                        value="After"
                        id="blue"
                        className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none blue"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          this.handleNextClick();
                          this.getDatabaseApi();
                        }}
                      />
                    </div>
                    <div className="text">Total pages: </div>
                    <div className="text">
                      {" "}
                      {Math.ceil(
                        this.state.dataLength / this.state.itemsPerPage
                      )}{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="right-side">
              <div className="table-container">
                <div className="table-container-id">
                  <div
                    id={urlError ? "box-urlErrorTrue" : "box-urlErrorFalse"}
                    className="box"
                  >
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
                            color: urlError ? "#e68484" : "#7ac0d8",
                            fontSize: "4vh",
                            paddingTop: "18vh",
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
                        <div
                          className="text"
                          onClick={this.handleClickToChooseFile}
                        >
                          Choose a file <span className="label">*</span>
                        </div>
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
                  {checkData === false && (
                    <div className="text"> Choose any item</div>
                  )}
                  <div className="button-id">
                    <input
                      type="button"
                      value="VERIFY"
                      id="blue-add"
                      className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none blue-add"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.handleClickVerify();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {checkStatus === true && <SucessNotification></SucessNotification>}
        {checkStatus === false && <FailNotification></FailNotification>}
        {imgError === true && <ChooseImage></ChooseImage>}
      </div>
    );
  }
}
