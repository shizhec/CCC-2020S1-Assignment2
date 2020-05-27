/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Popover, Row, Col } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";

import {
  AurinCard,
  TweetCard,
  SentimentCard,
  HashtagCard,
} from "./visualisation/";
import { getCityName, getStateName } from "../utils/googleMap";
import { extractMostRecentDataOfVicLGA } from "../utils/overviewDataExtraction";

class MapPopupComponent extends Component {
  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
  }

  render() {
    const {
      cityName,
      stateName,
      lastClickedInfo,
      aurin,
      tweetCount,
      coronaCount,
      sentiment,
      hashtagCount,
      hashtagOverview,
      mostRecentDate,
      data,
    } = this.props;

    return (
      <Popover
        visible={this.state.visible}
        placement={"bottom"}
        onVisibleChange={this.handleVisibleChange}
        title={
          <header>
            {cityName && (
              <span>
                {cityName} {stateName ? `, ${stateName}` : ""}
                {` (${data || 0} Confirmed${
                  mostRecentDate ? ` By ${mostRecentDate}` : ""
                })`}
              </span>
            )}
          </header>
        }
        content={
          <Row>
            {aurin && (
              <Col span={12}>
                <AurinCard />
              </Col>
            )}
            {tweetCount && coronaCount && (
              <Col span={12}>
                <TweetCard />
              </Col>
            )}
            {sentiment && (
              <Col span={12}>
                <SentimentCard />
              </Col>
            )}
            {hashtagCount && hashtagOverview && (
              <Col span={12}>
                <HashtagCard />
              </Col>
            )}
          </Row>
        }
      >
        <FontAwesomeIcon
          icon={faMapPin}
          style={{
            left: lastClickedInfo.x,
            top: lastClickedInfo.y,
            position: "absolute",
            color: "red",
          }}
        />
      </Popover>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    aurin,
    tweetCount,
    coronaCount,
    sentiment,
    hashtagCount,
    hashtagOverview,
    vicLGAOverviewData,
  } = state.xhr;
  const { lastClickedInfo } = state.map;

  let cityName = "";
  let cityShortName = "";
  let stateName = "";

  if (lastClickedInfo && lastClickedInfo.address) {
    const address = lastClickedInfo.address;

    cityName = getCityName(address);
    cityShortName = getCityName(address, false);
    stateName = getStateName(address);
  }

  const [extractedMapData, mostRecentDate] = extractMostRecentDataOfVicLGA(
    vicLGAOverviewData,
    true,
    state.filter.datesRange
  );

  const data = extractedMapData.get(cityShortName);

  return {
    aurin,
    tweetCount,
    coronaCount,
    sentiment,
    hashtagCount,
    hashtagOverview,
    cityName,
    stateName,
    lastClickedInfo,
    mostRecentDate,
    data,
  };
};

const MapPopup = connect(mapStateToProps)(MapPopupComponent);

export { MapPopup };
