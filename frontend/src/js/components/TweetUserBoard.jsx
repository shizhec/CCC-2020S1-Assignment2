import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Row, Col } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

import { TweetCard, SentimentCard, HashtagCard } from "./visualisation/";
import { updateTweetUserModalStatus } from "../actions/search";

class TweetUserBoardComponent extends Component {
  render() {
    // console.log("In TweetUserBoard, this.props =", this.props);

    const {
      updateTweetUserBoardVisibility,
      userName,
      userSentiment,
      tweetUserBoardIsOpen,
    } = this.props;

    const {
      coronavirus_related,
      count,
      hashtags,
      hashtag_count,
      negative,
      neutral,
      positive,
    } = userSentiment;

    const sentiment = { negative, neutral, positive };

    return (
      <Modal
        centered
        footer={null}
        width={"98%"}
        style={{ marginTop: "4rem" }}
        className={"tweet-user-board"}
        title={
          <p>
            Tweet User (
            <FontAwesomeIcon icon={faTwitter} style={{ marginRight: "1px" }} />@
            {userName}) Board
          </p>
        }
        visible={tweetUserBoardIsOpen}
        onCancel={() => updateTweetUserBoardVisibility(!tweetUserBoardIsOpen)}
        onOk={() => updateTweetUserBoardVisibility(!tweetUserBoardIsOpen)}
      >
        <Row>
          {count && coronavirus_related && (
            <Col span={12}>
              <TweetCard tweetCount={count} coronaCount={coronavirus_related} />
            </Col>
          )}

          {hashtags && hashtag_count && (
            <Col span={12}>
              <HashtagCard
                hashtagOverview={hashtags}
                hashtagCount={hashtag_count}
              />
            </Col>
          )}

          {typeof negative !== "undefined" &&
            typeof positive !== "undefined" &&
            typeof neutral !== "undefined" && (
              <Col span={12}>
                <SentimentCard sentiment={sentiment} />
              </Col>
            )}
          {!userSentiment ||
            (Object.keys(userSentiment).length === 0 && (
              <p>Oops, user @{userName} is not found, or is not active...</p>
            ))}
        </Row>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { options, userSentiment, tweetUserBoardIsOpen } = state.search;

  let userName = "";
  if (options.length > 0) {
    [{ value: userName }] = options;
  }
  return { userName, userSentiment, tweetUserBoardIsOpen };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateTweetUserBoardVisibility: (boardVisible) => {
      dispatch(updateTweetUserModalStatus(boardVisible));
    },
  };
};

const TweetUserBoard = connect(
  mapStateToProps,
  mapDispatchToProps
)(TweetUserBoardComponent);

export { TweetUserBoard };
