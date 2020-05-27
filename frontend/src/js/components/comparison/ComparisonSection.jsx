/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import React from "react";
import { connect } from "react-redux";

import { PieChart } from "../visualisation/PieChart";
import { LineChart } from "../visualisation/LineChart";
import { VerticalBarChart } from "../visualisation/VerticalBarChart";
import {
  getCityName,
  getStateName,
  getStateShortName,
} from "../../utils/googleMap";

function ComparisonSectionComponent({
  currentComparisonTarget,
  cityName,
  stateName,
  stateShortName,
}) {
  if (currentComparisonTarget) {
    return (
      <section className={"comparison-section"}>
        <header>
          {cityName && (
            <span>
              <b>City: </b> {cityName}
            </span>
          )}
          {stateName && (
            <span>
              <b>State: </b> {stateName}
            </span>
          )}
        </header>
        <hr />

        <VerticalBarChart targetState={stateShortName} />

        <PieChart targetState={stateShortName} />

        <LineChart
          targetState={stateShortName}
          visualisationName={`${stateShortName}`}
        />
      </section>
    );
  }
}

const mapStateToProps = (state, { comparisonIndex }) => {
  const { comparisonTargets } = state.comparison;

  const currentComparisonTarget = comparisonTargets[comparisonIndex];
  let cityName = "";
  let stateName = "";
  let stateShortName = "";

  if (currentComparisonTarget) {
    cityName = getCityName(currentComparisonTarget);
    stateName = getStateName(currentComparisonTarget);
    stateShortName = getStateShortName(currentComparisonTarget);
  }

  return { currentComparisonTarget, cityName, stateName, stateShortName };
};

const mapDispatchToProps = (dispatch, { comparisonIndex }) => {
  return {};
};

const ComparisonSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComparisonSectionComponent);

export { ComparisonSection };
