import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "antd";

import { ComparisonSection } from "./ComparisonSection";
import { updateComparisonBoardVisibility } from "../../actions/comparison";

class ComparisonBoardComponent extends Component {
  render() {
    const { boardVisible, updateComparisonBoardVisibility } = this.props;
    return (
      <Modal
        centered
        footer={null}
        width={"90%"}
        className={"comparison-board"}
        title={"Comparison Board"}
        visible={boardVisible}
        onCancel={() => updateComparisonBoardVisibility(!boardVisible)}
        onOk={() => updateComparisonBoardVisibility(!boardVisible)}
      >
        <ComparisonSection comparisonIndex={0} />
        <ComparisonSection comparisonIndex={1} />
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { boardVisible } = state.comparison;

  return { boardVisible };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateComparisonBoardVisibility: (boardVisible) => {
      dispatch(updateComparisonBoardVisibility(boardVisible));
    },
  };
};

const ComparisonBoard = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComparisonBoardComponent);

export { ComparisonBoard };
