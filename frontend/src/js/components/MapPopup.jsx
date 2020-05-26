import React from "react";
import { connect } from "react-redux";
import { Popover } from "antd";

import { AurinCard } from "./visualisation/AurinCard";
import { getCityName, getStateName } from "../utils/googleMap";

function MapPopupComponent({ cityName, stateName, lastClickedInfo, aurin }) {
  return (
    <Popover
      title={
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
      }
      visible={true}
      content={"HELLO WORLD"}
    >
      <span
        style={{
          left: lastClickedInfo.x,
          top: lastClickedInfo.y,
          position: "absolute",
          width: "1rem",
          height: "1rem",
          visibility: "hidden",
        }}
      ></span>
      {aurin && <AurinCard />}
    </Popover>
  );
}

const mapStateToProps = (state, ownProps) => {
  const { aurin } = state.xhr;
  const { lastClickedInfo } = state.map;

  let cityName = "";
  let stateName = "";

  if (lastClickedInfo && lastClickedInfo.address) {
    cityName = getCityName(lastClickedInfo.address);
    stateName = getStateName(lastClickedInfo.address);
  }

  return { aurin, cityName, stateName, lastClickedInfo };
};

const MapPopup = connect(mapStateToProps)(MapPopupComponent);

export { MapPopup };
