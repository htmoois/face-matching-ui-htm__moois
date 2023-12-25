import "./App.css";
import Menu from "./Components/Menu";
import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./Components/Route";

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Menu></Menu>
          <div>{this.show(routes)}</div>
        </div>
      </Router>
    );
  }
  show = (routes) => {
    var result = null;
    if (routes.length > 0) {
      result = routes.map((route, index) => {
        return (
          <Route key={index} path={route.path} element={<route.element />} />
        );
      });
    }
    return <Routes>{result}</Routes>;
  };
}
