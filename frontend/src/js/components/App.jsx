/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import React, { Component } from "react";
import { connect } from "react-redux";

import { getRenderingData } from "../actions/xhr";

import { Spinner } from "./Spinner";
import { Map } from "./Map";
import { Dashboard } from "./Dashboard";
import { Header } from "./Header";
import { ComparisonBoard } from "./comparison/ComparisonBoard";
import { TweetUserBoard } from "./TweetUserBoard";

class AppComponent extends Component {
  componentDidMount() {
    this.props.getRenderingData();
  }

  render() {
    const { boardVisible, tweetUserBoardIsOpen } = this.props;

    return (
      <>
        <Spinner />
        <Header />
        <Map />
        <Dashboard />
        {boardVisible && <ComparisonBoard />}
        {tweetUserBoardIsOpen && <TweetUserBoard />}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { isFullScreen } = state.map;
  const { boardVisible } = state.comparison;
  const { tweetUserBoardIsOpen } = state.search;

  return { isFullScreen, boardVisible, tweetUserBoardIsOpen };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRenderingData: () => getRenderingData()(dispatch),
  };
};

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export { App };
