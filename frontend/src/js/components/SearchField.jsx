/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { AutoComplete, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import debounce from "lodash.debounce";

import {
  updateSearchFieldExpansionStatus,
  updateTweetUserModalStatus,
} from "../actions/search";
import { CollapseButton } from "./gadgets/CollapseButton";
import { getUserSentiment } from "../actions/xhr";
import { extractStartAndEndDateFromArray } from "../utils/overviewDataExtraction";

class SearchFieldComponent extends Component {
  handleSelect(value, option) {
    this.props.showTweetUserBoard();
  }

  handleSearch(value) {
    // console.log("in handleSearch, value =", value);
    const [startDate, endDate] = extractStartAndEndDateFromArray(
      this.props.datesRange,
      true
    );
    this.props.searchTweetUser(
      value,
      startDate || "2020-01-01",
      endDate || "2020-01-02"
    );
  }

  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.handleSearch = debounce(this.handleSearch.bind(this), 500);
  }

  render() {
    console.log("In searching field, this.props =", this.props);

    const {
      showSearchInput,
      expandSearchField,
      hideSearchField,
      options,
      isSearching,
    } = this.props;
    if (!showSearchInput) {
      return (
        <SearchOutlined className={"clickable"} onClick={expandSearchField} />
      );
    }

    return (
      <section className={"collapsible-section"}>
        <CollapseButton onClickHandler={hideSearchField} />
        <AutoComplete
          defaultOpen={true}
          dropdownMatchSelectWidth={300}
          style={{
            width: 500,
          }}
          onSelect={this.handleSelect}
          onSearch={this.handleSearch}
          options={options}
        >
          <Input.Search
            size="large"
            placeholder="Search the tweet user here."
            enterButton
            loading={isSearching}
          />
        </AutoComplete>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  const { showSearchInput, options, isSearching } = state.search;
  const { datesRange } = state.filter;

  return { showSearchInput, options, isSearching, datesRange };
};

const mapDispatchToProps = (dispatch) => {
  return {
    expandSearchField: () => dispatch(updateSearchFieldExpansionStatus()),
    hideSearchField: () => dispatch(updateSearchFieldExpansionStatus(false)),
    searchTweetUser: (userName, startDate, endDate) =>
      dispatch(getUserSentiment(userName, startDate, endDate)),
    showTweetUserBoard: () => dispatch(updateTweetUserModalStatus(true)),
  };
};

const SearchField = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchFieldComponent);

export { SearchField };
