import React, { Component } from "react";
import "../css/Database.css";
import AddNewPerson from "../Dialog/AddNewPerson";
import CallApi from "../API/CallAPI";
import { FaImage, FaPen } from "react-icons/fa";
import SucessNotification from "../Dialog/SucessNotification";
import FailNotification from "../Dialog/FailNotification";
import AlertCancel from "../Dialog/AlertCancel";
import EditPerson from "../Dialog/EditPersonForm";
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
      openAddDialog: false,
      dataChecked: [],
      dataLength: "",
      previewImg: "",
      detailPerson: [],
      statusResponse: null,
      openAlertCancel: false,
      openEditForm: false,
      itemEdited: [],
      loading: false,
    };
    this.initialInputValue = "";
    this.divRef = React.createRef();
  }

  componentDidMount = () => {
    this.getDatabaseApi();
  };
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
            console.log("Couldn't get data from database because: ", error);
          })
          .finally(() => {
            this.setState({
              loading: false,
            });
          });
      }
    );
  };
  handleOpenAddDialog = () => {
    this.setState({
      openAddDialog: true,
    });
  };
  handleItemsPerPageChange = (event) => {
    const itemsPerPage = parseInt(event.target.value);
    this.setState({ itemsPerPage, currentPage: 1 });
  };
  handleInputPageChange = (event) => {
    this.setState({
      inputPage: event.target.value,
    });
  };
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

      this.setState((prevState) => {
        return {
          selectAllChecked: check,
        };
      });
    }
  };
  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

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
        inputPage: this.initialInputValue,
      };
    });
  };
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

  clickOnItem = (item) => {
    this.getPersonApi(item, "get");
  };
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
    });
  };
  handleClickOutSide = (event) => {
    event.preventDefault();
    this.setState({
      detailPerson: [],
    });
  };
  handleClickDelete = () => {
    this.setState({
      openAlertCancel: true,
    });
  };
  deleteAPI = () => {
    this.setState(
      (prevState) => {
        const { dataChecked } = prevState;
        return { dataChecked: dataChecked };
      },
      () => {
        let link = `Person?personId=`;
        const { dataChecked } = this.state;
        let query = dataChecked.toString();
        let requestLink = link + query;
        CallApi(requestLink, "DELETE", null)
          .then((response) => {
            if (response != null) {
              if (response.Status === 0) {
                this.setState({
                  statusResponse: true,
                  dataChecked: [],
                });
                this.getDatabaseApi();
                setTimeout(() => {
                  this.setState({ statusResponse: null });
                }, 3000);
              } else {
                this.setState({
                  statusResponse: false,
                });
                setTimeout(() => {
                  this.setState({ statusResponse: null });
                }, 3000);
              }
            } else {
              this.setState({
                statusResponse: null,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
  };
  renderShowData() {
    const { selectAllChecked, data } = this.state;
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
            <th>Gender</th>
            <th>Score</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td onChange={() => this.clickOnCheckBox(item)}>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={this.state.dataChecked.includes(item.PersonID)}
                  onClick={this.preventDefaultCheckboxEvent}
                ></input>
              </td>
              <td onClick={() => this.clickOnCheckBox(item)}>{index + 1}</td>
              <td onClick={() => this.clickOnItem(item)}>{item.Name}</td>
              <td onClick={() => this.clickOnItem(item)}>{item.Gender}</td>
              <td onClick={() => this.clickOnItem(item)}>{item.Score}</td>
              <td
                onClick={() => {
                  this.handleClickEditPen(item);
                }}
              >
                <FaPen className="icon-edit"></FaPen>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  getPersonApi = (item, type) => {
    let link = `Person/` + item.PersonID;
    this.setState(
      (prevState) => {
        return { itemEdited: [] };
      },
      () => {
        CallApi(link, "GET", null)
          .then((response) => {
            if (response != null) {
              if (type === "get") {
                this.setState({
                  detailPerson: response.Data.length !== 0 ? response.Data : [],
                });
              }
              if (type === "edit") {
                this.setState({
                  itemEdited: response.Data.length !== 0 ? response.Data : [],
                });
              }
            } else {
              this.setState({
                statusResponse: false,
                itemEdited: [],
                detailPerson: [],
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
  handleClickEditPen = (item) => {
    this.getPersonApi(item, "edit");
    this.setState({
      openEditForm: true,
    });
  };
  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }
  handleClickOutside = (event) => {
    if (this.divRef.current && !this.divRef.current.contains(event.target)) {
      this.setState({
        detailPerson: [],
      });
    }
  };

  render() {
    let {
      openAddDialog,
      keyword,
      detailPerson,
      statusResponse,
      openAlertCancel,
      openEditForm,
      itemEdited,
      loading,
    } = this.state;
    return (
      <div>
        {openAddDialog && (
          <AddNewPerson
            statusDialog={() => this.setState({ openAddDialog: false })}
          ></AddNewPerson>
        )}
        {openAlertCancel && (
          <AlertCancel
            Accept={async () => {
              this.deleteAPI();
              this.setState({ openAlertCancel: false });
            }}
            Refuse={() => this.setState({ openAlertCancel: false })}
          ></AlertCancel>
        )}
        {openEditForm && itemEdited.length !== 0 && (
          <EditPerson
            close={() => this.setState({ openEditForm: false })}
            item={itemEdited}
          ></EditPerson>
        )}
        {loading && <Loading></Loading>}
        <div className="container" ref={this.divRef}>
          <div class="title">Database</div>
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
            <div className="button-container">
              <div className="button">
                <input
                  type="button"
                  value="ADD NEW"
                  id="blue"
                  className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none blue"
                  style={{ marginLeft: "20px", cursor: "pointer" }}
                  onClick={() => this.handleOpenAddDialog()}
                />
              </div>
              <div className="button">
                <input
                  type="button"
                  value="DELETE"
                  id="red"
                  className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none red"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.handleClickDelete();
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
                <div className="boxImg">
                  <input
                    type="file"
                    accept="image/*"
                    ref={this.inputRef}
                    style={{ display: "none" }}
                  />
                  {detailPerson.Image ? (
                    <img
                      src={`data:image/png;base64, ${detailPerson.Image}`}
                      alt="Preview"
                      style={{
                        marginTop: "5vh",
                        width: "70%",
                        height: "70%",
                      }}
                    />
                  ) : (
                    <div className="icon">
                      <FaImage
                        style={{
                          color: "#7ac0d8",
                          fontSize: "7vh",
                          paddingTop: "20vh",
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="boxText">
                  <div className="sub">
                    <div className="default">Name: </div>
                    <span className="person">{detailPerson.Name}</span>
                  </div>
                  <div className="sub">
                    <div className="default">Code:</div>
                    <span className="person">{detailPerson.Code}</span>
                  </div>
                  <div className="sub">
                    <div className="default">Gender:</div>
                    <span className="person">{detailPerson.Gender}</span>
                  </div>
                  <div className="sub">
                    <div className="default">Age:</div>
                    <span className="person">{detailPerson.Age}</span>
                  </div>
                </div>
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
