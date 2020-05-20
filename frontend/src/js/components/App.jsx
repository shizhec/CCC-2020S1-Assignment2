import React, { Component } from "react";
import { connect } from "react-redux";

import { getOverviewData } from "../actions/xhr";

import { Spinner } from "./Spinner";
import { Map } from "./Map";
import { Dashboard } from "./Dashboard";
import { Header } from "./Header";

class AppComponent extends Component {
  componentDidMount() {
    this.props.getOverviewData();
  }

  render() {
    const { isFullScreen } = this.props;

    return (
      <>
        <Spinner />
        <Header />
        <Map />
        <Dashboard />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { isFullScreen } = state.map;
  return { isFullScreen };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOverviewData: () => getOverviewData()(dispatch),
  };
};

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export { App };
