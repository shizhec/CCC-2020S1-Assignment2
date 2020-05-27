/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import React from "react";
import { connect } from "react-redux";

import "../../css/spinner.css";

/**
 * Acknowledgement: this spinner is borrowed from [this website](https://tobiasahlin.com/spinkit/).
 *
 * @returns
 */
function SpinnerComponent({ isLoading }) {
  const containerClass = "spinner-container" + (isLoading ? "" : " hidden");
  return (
    <section className={containerClass}>
      <div className="sk-chase">
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
      </div>
    </section>
  );
}

const mapStateToProps = (state) => {
  const { isLoading } = state.loading;
  return { isLoading };
};

const Spinner = connect(mapStateToProps)(SpinnerComponent);

export { Spinner };
