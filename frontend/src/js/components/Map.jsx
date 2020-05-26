import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Popover } from "antd";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
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
import { updateComparisonPanelVisibility } from "../actions/comparison";
import { Filter } from "./Filter";
import { GOOGLE_MAP_API_KEY } from "../constants/credentials";
import mapStyle from "../utils/mapStyle";
import { ComparisonPanel } from "./comparison/ComparisonPanel";
import { DataSourceSwitch } from "./DataSourceSwitch";

class MapComponent extends Component {
  getLocationInfo = (clickedLocationInfo) => {
    const { getTheLocationInfo, currentComparingTargetIndex } = this.props;
    getTheLocationInfo(clickedLocationInfo, currentComparingTargetIndex);
  };

  constructor(props) {
    super(props);
    this.getLocationInfo = debounce(this.getLocationInfo.bind(this), 500);
  }

  handleMapApiLoad = (map, maps) => {
    this.map = map;
    this.maps = maps;
    this.initDataLayer();
    this.setDataStyle();
  };

  initDataLayer() {
    this.dataLayer = new this.maps.Data({ map: this.map });
    this.dataLayer.loadGeoJson(
      "https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json"
    );
  }

  setDataStyle = () => {
    this.dataLayer.setStyle((feature) => {
      const name = feature.getProperty("vic_lga__3");

      let colors = this.gradient("#ffffff", "#be2026", 7);

      let color = "#000000";
      // if (total > 0) color = colors[0];
      // if (total > 1000) color = colors[1];
      // if (total > 2000) color = colors[2];
      // if (total > 3000) color = colors[3];
      // if (total > 4000) color = colors[4];
      // if (total > 5000) color = colors[5];
      // if (total > 6000) color = colors[6];

      return {
        strokeWeight: 0.5,
        strokeColor: "#ffffff",
        zIndex: 1,
        fillOpacity: 0.75,
        fillColor: colors[6],
      };
    });
  };

  rgbToHex(r, g, b) {
    const hex = ((r << 16) | (g << 8) | b).toString(16);
    return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
  }

  hexToRgb(hex) {
    const rgb = [];
    for (let i = 1; i < 7; i += 2) {
      rgb.push(parseInt("0x" + hex.slice(i, i + 2)));
    }
    return rgb;
  }

  gradient(startColor, endColor, step) {
    const sColor = this.hexToRgb(startColor),
      eColor = this.hexToRgb(endColor);
    const rStep = (eColor[0] - sColor[0]) / step,
      gStep = (eColor[1] - sColor[1]) / step,
      bStep = (eColor[2] - sColor[2]) / step;
    const gradientColorArr = [];
    for (let i = 0; i < step; i++) {
      gradientColorArr.push(
        this.rgbToHex(
          parseInt(rStep * i + sColor[0]),
          parseInt(gStep * i + sColor[1]),
          parseInt(bStep * i + sColor[2])
        )
      );
    }
    return gradientColorArr;
  }

  render() {
    console.log("Map, this.props = ", this.props);

    const {
      isFullScreen,
      enterFullScreen,
      exitFullScreen,
      updateMapCenterAndZoom,
      panelVisible,
      hideComparisonPanel,
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
            yesIWantToUseGoogleMapApiInternals
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
              if (hideComparisonPanel) {
                hideComparisonPanel();
              }
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

        {isFullScreen && (
          <>
            <ComparisonPanel />
            <DataSourceSwitch />
            <Filter />
          </>
        )}
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
  const { panelVisible, currentComparingTargetIndex } = state.comparison;

  return {
    isFullScreen,
    center,
    zoom,
    overviewData,
    lastClickedInfo,
    currentComparingTargetIndex,
    panelVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    enterFullScreen: () => dispatch(updateMapFullScreenStatus(true)),
    exitFullScreen: () => dispatch(updateMapFullScreenStatus(false)),
    updateMapCenterAndZoom: (center, zoom) =>
      dispatch(updateMapCenterAndZoom(center, zoom)),
    getTheLocationInfo: (clickedLocationInfo, currentComparingTargetIndex) =>
      reverseGeocoding(
        clickedLocationInfo,
        currentComparingTargetIndex
      )(dispatch),
    hideComparisonPanel: () => dispatch(updateComparisonPanelVisibility(false)),
  };
};

const Map = connect(mapStateToProps, mapDispatchToProps)(MapComponent);

export { Map };
