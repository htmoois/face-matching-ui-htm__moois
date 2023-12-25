import React, { Component } from "react";
import "../css/AddNewPerson.css";
class DetailPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closeDialog: false,
    };
  }

  handleClickClose = () => {
    this.setState({
      closeDialog: true,
    });
    this.props.close();
  };
  render() {
    const { closeDialog } = this.state;
    let item = this.props.item;
    let typeMatching = this.props.typeMatching;
    if (closeDialog) {
      return null;
    }
    return (
      <div>
        <div className="container-all" onClick={this.handleClickClose}>
          <div
            className="container-add"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="left">
              <div className="title-add">INFORMATION</div>
              <div className="box-add" id="border-blue">
                <div className="container">
                  <div className="box">Name: </div>
                  <div className="text">
                    {item.Name !== undefined ? item.Name.toUpperCase() : "Name"}
                  </div>
                </div>
              </div>
              <div className="box-add distance-add" id="border-blue">
                <div className="container">
                  <div className="box">Code: </div>
                  <div className="text">{item.Code}</div>
                </div>
              </div>
              <div className="box-add distance-add" id="border-blue">
                <div className="container">
                  <div className="box">Gender: </div>
                  <div className="text">{item.Gender}</div>
                </div>
              </div>
              <div className="box-add distance-add" id="border-blue">
                <div className="container">
                  <div className="box">Address: </div>
                  <div className="text sroll">Unknown</div>
                </div>
              </div>
              {typeMatching === "identify" ? (
                <div className="box-add distance-add" id="border-blue">
                  <div className="container">
                    <div className="box">Rate: </div>
                    {item.Score > 100 && (
                      <div className="text">{item.Score} - Absolute</div>
                    )}
                    {item.Score > 80 && (
                      <div className="text">{item.Score} - High Relative</div>
                    )}
                    {item.Score > 40 && (
                      <div className="text">{item.Score} - Low Relative</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="box-add distance-add" id="border-blue">
                  <div className="container">
                    <div className="box">Score: </div>
                    <div className="text">{item.Score}</div>
                  </div>
                </div>
              )}
              <div className="button-add distance-add">
                <input
                  type="button"
                  value="CLOSE"
                  id="red-add"
                  className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none red-add"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.handleClickClose();
                  }}
                />
              </div>
            </div>
            <div className="right">
              <div className="img">
                <img
                  src={"data:image/jpeg;base64," + item.Image}
                  alt="Person"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default DetailPerson;
