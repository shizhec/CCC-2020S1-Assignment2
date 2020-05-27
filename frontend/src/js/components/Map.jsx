/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card } from "antd";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import GoogleMapReact from "google-map-react";
import debounce from "lodash.debounce";

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
import { ComparisonPanel } from "./comparison/ComparisonPanel";
import { DataSourceSwitch } from "./DataSourceSwitch";
import mapStyle from "../utils/mapStyle";
import { gradient, getStateShortName } from "../utils/googleMap";
import {
  extractMostRecentDataOfVicLGA,
  extractStartAndEndDateFromArray,
} from "../utils/overviewDataExtraction";
import { capitalizeString } from "../utils/string";
import { MapPopup } from "./MapPopup";

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.getLocationInfo = debounce(this.getLocationInfo.bind(this), 500);
  }

  getLocationInfo = (clickedLocationInfo) => {
    const {
      getTheLocationInfo,
      currentComparingTargetIndex,
      parsedDateRange,
    } = this.props;
    getTheLocationInfo(
      clickedLocationInfo,
      currentComparingTargetIndex,
      parsedDateRange
    );
  };

  handleMapApiLoad = (map, maps) => {
    this.map = map;
    this.maps = maps;
    this.initDataLayer();
    this.setDataStyle();
  };

  initDataLayer() {
    console.log("this.map =", this.map);
    console.log("this.maps =", this.maps);

    if (this.maps) {
      this.dataLayer = new this.maps.Data({ map: this.map });
      this.dataLayer.loadGeoJson(
        "https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json"
      );
    }
  }

  setDataStyle = () => {
    if (this.dataLayer) {
      this.dataLayer.setStyle((feature) => {
        const { minValue, maxValue, extractedMapData } = this.props;
        const name = capitalizeString(feature.getProperty("vic_lga__3"));

        // console.log("in setDataStyle, name =", name);
        let colors = gradient("#be9283", "#621b47", 7);

        const valueOfThisLGA = extractedMapData.get(name);
        // console.log("valueOfThisLGA =", valueOfThisLGA);

        const step = (maxValue - minValue) / 7;
        let i = 0;
        for (i = 0; i <= 6; i++) {
          if (
            valueOfThisLGA >= minValue + i * step &&
            valueOfThisLGA <= minValue + (i + 1) * step
          ) {
            break;
          }
        }

        // let fillColor = colors[i];

        let fillColor = valueOfThisLGA === undefined ? "#c7b79e" : colors[i];

        // console.log(
        //   `valueOfThisLGA =${valueOfThisLGA}, LGA = ${name}, color = ${fillColor} colors = ${colors}, i = ${i}`
        // );

        return {
          fillColor: fillColor,
          strokeWeight: 0.25,
          strokeColor: "#ffffff",
          zIndex: 0,
          fillOpacity: 0.7,
        };
      });
    }
  };

  render() {
    console.log("Map, this.props = ", this.props);

    const {
      isFullScreen,
      enterFullScreen,
      exitFullScreen,
      updateMapCenterAndZoom,
      hideComparisonPanel,
      extractedMapData,
      lastClickedInfo,
      showPopup,
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
          {extractedMapData && (
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
          )}
        </div>

        <SwitchComponent
          className={"clickable map-full-screen-switch"}
          onClick={() => {
            switchClickHandler();
          }}
        />

        {showPopup && <MapPopup />}

        {isFullScreen && (
          <>
            <ComparisonPanel />
            {/* <DataSourceSwitch /> */}
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
  const { overviewData, vicLGAOverviewData } = state.xhr;
  const { currentComparingTargetIndex } = state.comparison;

  const { dataSource, datesRange } = state.filter;

  const renderingData =
    dataSource === "vicLGAOverviewData" ? vicLGAOverviewData : overviewData;

  // console.log("vicLGAOverviewData =", vicLGAOverviewData);
  const [
    extractedMapData,
    mostRecentDate,
    maxValue,
    minValue,
  ] = extractMostRecentDataOfVicLGA(vicLGAOverviewData, true, datesRange);

  const parsedDateRange = extractStartAndEndDateFromArray(datesRange);

  const showPopup =
    lastClickedInfo &&
    isFullScreen &&
    getStateShortName(lastClickedInfo.address) === "VIC";

  return {
    isFullScreen,
    center,
    zoom,
    overviewData,
    vicLGAOverviewData,
    currentComparingTargetIndex,
    renderingData,
    dataSource,
    extractedMapData,
    mostRecentDate,
    maxValue,
    minValue,
    parsedDateRange,
    lastClickedInfo,
    showPopup,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    enterFullScreen: () => dispatch(updateMapFullScreenStatus(true)),
    exitFullScreen: () => dispatch(updateMapFullScreenStatus(false)),
    updateMapCenterAndZoom: (center, zoom) =>
      dispatch(updateMapCenterAndZoom(center, zoom)),
    getTheLocationInfo: (
      clickedLocationInfo,
      currentComparingTargetIndex,
      parsedDateRange
    ) =>
      reverseGeocoding(
        clickedLocationInfo,
        currentComparingTargetIndex,
        parsedDateRange
      )(dispatch),
    hideComparisonPanel: () => dispatch(updateComparisonPanelVisibility(false)),
  };
};

const Map = connect(mapStateToProps, mapDispatchToProps)(MapComponent);

export { Map };
