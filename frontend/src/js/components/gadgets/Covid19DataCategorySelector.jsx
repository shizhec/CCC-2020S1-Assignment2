import React from "react";
import { Select } from "antd";
import { connect } from "react-redux";

import { COLOR_MAPPING } from "../../constants/covid19ColorMapping";
import { updateVisualisationDataCategory } from "../../actions/filter";

const { Option } = Select;

function Covid19DataCategorySelectorComponent({
  handleChange,
  value,
  visualisationName,
}) {
  return (
    <section className={"data-category-selector"}>
      <span>
        <b>Data Category:</b>
      </span>
      <Select
        defaultValue={value}
        style={{ width: 120 }}
        onChange={handleChange}
      >
        {[...COLOR_MAPPING.keys()].map((dataType, index) => (
          <Option key={`type-option-${index}`} value={dataType}>
            {dataType}
          </Option>
        ))}
      </Select>
    </section>
  );
}

const mapStateToProps = (state, { visualisationName }) => {
  const value =
    state.filter.dataCategoriesByVisualisationNames[visualisationName];

  return { value };
};

const mapDispatchToProps = (dispatch, { visualisationName }) => {
  return {
    handleChange: (dataCategory) =>
      dispatch(
        updateVisualisationDataCategory(visualisationName, dataCategory)
      ),
  };
};

const Covid19DataCategorySelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(Covid19DataCategorySelectorComponent);

export { Covid19DataCategorySelector };
