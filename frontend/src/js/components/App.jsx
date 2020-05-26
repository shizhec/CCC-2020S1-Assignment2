import React, { Component } from "react";
import { connect } from "react-redux";

import { getOverviewData } from "../actions/xhr";

import { Spinner } from "./Spinner";
import { Map } from "./Map";
import { Dashboard } from "./Dashboard";
import { Header } from "./Header";
import { ComparisonBoard } from "./comparison/ComparisonBoard";

class AppComponent extends Component {
  componentDidMount() {
    this.props.getOverviewData();
  }

  render() {
    const { boardVisible } = this.props;

    return (
      <>
        <Spinner />
        <Header />
        <Map />
        <Dashboard />
        {boardVisible && <ComparisonBoard />}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { isFullScreen } = state.map;
  const { boardVisible } = state.comparison;
  return { isFullScreen, boardVisible };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOverviewData: () => getOverviewData()(dispatch),
  };
};

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export { App };
