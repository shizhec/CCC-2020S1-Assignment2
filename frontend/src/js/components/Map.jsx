import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Popover } from "antd";
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  FlagFilled,
} from "@ant-design/icons";
import GoogleMapReact from "google-map-react";
import debounce from "lodash.debounce";
// import { Map } from "google-maps-react";

import "../../css/map.css";
import { FULL_SCREEN_MAP, CARD_MAP } from "../constants/map";
import {
  updateMapFullScreenStatus,
  updateMapCenterAndZoom,
  reverseGeocoding,
} from "../actions/map";
import { Filter } from "./Filter";
import { GOOGLE_MAP_API_KEY } from "../constants/credentials";
import mapStyle from "../utils/mapStyle";

class MapComponent extends Component {
  getLocationInfo = (clickedLocationInfo) => {
    this.props.getTheLocationInfo(clickedLocationInfo);
  };

  barDataLabel = [];
  barData = [];

  constructor(props) {
    super(props);
    this.getLocationInfo = debounce(this.getLocationInfo.bind(this), 500);
  }

  handleMapApiLoad = (map, maps) => {
    this.map = map;
    this.maps = maps;
    this.initDataLayer();
    // this.setDataStyle();
  };

  initDataLayer() {
    this.dataLayer = new this.maps.Data({ map: this.map });
    this.dataLayer.loadGeoJson(
      "https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json"
    );
  }

  // setDataStyle = () => {
  //   this.barDataLabel.length = 0;
  //   this.barData.length = 0;
  //   this.dataLayer.setStyle((feature) => {
  //     const low = [5, 69, 54];
  //     const high = [151, 83, 34];
  //     const color = [];
  //     for (let i = 0; i < 3; i++) {
  //       color[i] = (high[i] - low[i]) * Math.random() + low[i];
  //     }
  //
  //     let outlineWeight = 0.5,
  //       zIndex = 1;
  //
  //     return {
  //       strokeWeight: outlineWeight,
  //       strokeColor: "#fff",
  //       zIndex: zIndex,
  //       fillColor: "hsl(" + color[0] + "," + color[1] + "%," + color[2] + "%)",
  //       fillOpacity: 0.75,
  //     };
  //   });
  // };

  render() {
    console.log("Map, this.props = ", this.props);

    const {
      isFullScreen,
      enterFullScreen,
      exitFullScreen,
      updateMapCenterAndZoom,
      lastClickedInfo,
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
              styles: mapStyle,
            }}
            onChange={({ zoom, center }) =>
              updateMapCenterAndZoom(center, zoom)
            }
            onClick={(value) => {
              console.log("onClick trigerred, value =", value);
              this.getLocationInfo(value);
            }}
            onGoogleApiLoaded={({ map, maps }) =>
              this.handleMapApiLoad(map, maps)
            }
          ></GoogleMapReact>
        </div>

        {/* {lastClickedInfo && (
          <Popover
            title={"hello world"}
            content={"HELLO WORLD"}
            visible={true}
            
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
          </Popover>
        )} */}

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
  const { isFullScreen, center, zoom, lastClickedInfo } = state.map;
  const { overviewData } = state.xhr;
  return { isFullScreen, center, zoom, overviewData, lastClickedInfo };
};

const mapDispatchToProps = (dispatch) => {
  return {
    enterFullScreen: () => dispatch(updateMapFullScreenStatus(true)),
    exitFullScreen: () => dispatch(updateMapFullScreenStatus(false)),
    updateMapCenterAndZoom: (center, zoom) =>
      dispatch(updateMapCenterAndZoom(center, zoom)),
    getTheLocationInfo: (clickedLocationInfo) =>
      reverseGeocoding(clickedLocationInfo)(dispatch),
  };
};

const Map = connect(mapStateToProps, mapDispatchToProps)(MapComponent);

export { Map };
