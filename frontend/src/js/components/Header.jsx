/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import React, { Component } from "react";
import { connect } from "react-redux";

import "../../css/header.css";
import { SearchField } from "./SearchField";

class HeaderComponent extends Component {
  render() {
    const { isFullScreen } = this.props;
    let className = isFullScreen ? "map--fullScreen" : "map--card";

    return (
      <header className={className}>
        <span>COVID-19 Australia Info Center</span>
        <SearchField />
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  const { isFullScreen } = state.map;
  return { isFullScreen };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
