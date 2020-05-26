import React, { Component } from "react";
import { connect } from "react-redux";
import { AutoComplete, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { updateSearchFieldExpansionStatus } from "../actions/search";
import { CollapseButton } from "./gadgets/CollapseButton";

class SearchFieldComponent extends Component {
  __handleSelect(value, option) {
    console.log("in handleSelect, value =", value);
    console.log("in handleSelect, option =", option);
  }

  __handleSearch(value) {
    // use throttling to send query to backend.
    console.log("in handleSearch, value =", value);
  }

  constructor(props) {
    super(props);
    this.__handleSelect = this.__handleSelect.bind(this);
    this.__handleSearch = this.__handleSearch.bind(this);
  }

  render() {
    const { showSearchInput, expandSearchField, hideSearchField } = this.props;
    if (!showSearchInput) {
      return (
        <SearchOutlined className={"clickable"} onClick={expandSearchField} />
      );
    }

    return (
      <section className={"collapsible-section"}>
        <CollapseButton onClickHandler={hideSearchField} />
        <AutoComplete
          dropdownMatchSelectWidth={300}
          style={{
            width: 500,
          }}
          onSelect={this.__handleSelect}
          onSearch={this.__handleSearch}
        >
          <Input.Search
            size="large"
            placeholder="Search the location, or tweet user here."
            enterButton
          />
        </AutoComplete>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  const { showSearchInput } = state.search;
  return { showSearchInput };
};

const mapDispatchToProps = (dispatch) => {
  return {
    expandSearchField: () => dispatch(updateSearchFieldExpansionStatus()),
    hideSearchField: () => dispatch(updateSearchFieldExpansionStatus(false)),
  };
};

const SearchField = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchFieldComponent);

export { SearchField };
