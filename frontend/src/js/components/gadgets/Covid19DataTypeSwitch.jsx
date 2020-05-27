/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import React from "react";
import { Switch } from "antd";
import { connect } from "react-redux";
import { updateVisualisationDataType } from "../../actions/filter";

function Covid19DataTypeSwitchComponent({ handleChange, visualisationName }) {
  return (
    <section className={"data-type-switch"}>
      <span>
        <b>Data Type:</b>
      </span>
      <Switch
        defaultChecked
        checkedChildren="Absolute"
        unCheckedChildren="Relative"
        onChange={handleChange}
      />
    </section>
  );
}

const mapStateToProps = (state, { visualisationName }) => {
  const value = state.filter.dataTypesByVisualisationNames[visualisationName];

  return { value };
};

const mapDispatchToProps = (dispatch, { visualisationName }) => {
  return {
    handleChange: (dataCategory) =>
      dispatch(updateVisualisationDataType(visualisationName, dataCategory)),
  };
};

const Covid19DataTypeSwitch = connect(
  mapStateToProps,
  mapDispatchToProps
)(Covid19DataTypeSwitchComponent);

export { Covid19DataTypeSwitch };
