import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card } from "antd";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import GoogleMapReact from "google-map-react";

import "../../css/map.css";
import { FULL_SCREEN_MAP, CARD_MAP } from "../constants/map";
import {
  updateMapFullScreenStatus,
  updateMapCenterAndZoom,
} from "../actions/map";
import { Filter } from "./Filter";

const GOOGLE_MAP_API_KEY = "AIzaSyDPvEDDdrknvPKqdpl3lfTv547o2mPltuw";

class MapComponent extends Component {
  render() {
    console.log("Map, this.props = ", this.props);

    const {
      isFullScreen,
      enterFullScreen,
      exitFullScreen,
      updateMapCenterAndZoom,
    } = this.props;

    let SwitchComponent = FullscreenExitOutlined;
    let switchClickHandler = exitFullScreen;
    let mapZoomConstant = FULL_SCREEN_MAP.ZOOM_BOUNDARY;
    let containerStyle = {
      height: "100vh",
      width: "100%",
    };

    if (!isFullScreen) {
      SwitchComponent = FullscreenOutlined;
      switchClickHandler = enterFullScreen;
      mapZoomConstant = CARD_MAP.ZOOM_BOUNDARY;
      containerStyle = {
        height: "100%",
        width: "100%",
      };
    }

    const renderedMapBox = (
      <>
        <div style={containerStyle}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY }}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
            options={{
              gestureHandling: isFullScreen ? "cooperative" : "greedy",
              zoomControl: false,
              fullscreenControl: false,
              maxZoom: mapZoomConstant.max,
              minZoom: mapZoomConstant.min,
            }}
            onChange={({ zoom, center }) =>
              updateMapCenterAndZoom(center, zoom)
            }
            onClick={(value) =>
              console.log("onClick trigerred, value =", value)
            }
          ></GoogleMapReact>
        </div>

        <SwitchComponent
          className={"clickable map-full-screen-switch"}
          onClick={() => {
            switchClickHandler();
          }}
        />
        {isFullScreen && <Filter />}
      </>
    );

    if (isFullScreen) {
      return renderedMapBox;
    }

    return (
      <Row id={"map-container"}>
        <Col span={12}>
          <Card hoverable className="col-6">
            {renderedMapBox}
          </Card>
        </Col>
        <Filter />
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  const { isFullScreen, center, zoom } = state.map;
  const { overviewData } = state.xhr;
  return { isFullScreen, center, zoom, overviewData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    enterFullScreen: () => dispatch(updateMapFullScreenStatus(true)),
    exitFullScreen: () => dispatch(updateMapFullScreenStatus(false)),
    updateMapCenterAndZoom: (center, zoom) =>
      dispatch(updateMapCenterAndZoom(center, zoom)),
  };
};

const Map = connect(mapStateToProps, mapDispatchToProps)(MapComponent);

export { Map };
