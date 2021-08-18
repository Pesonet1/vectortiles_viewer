import * as React from "react"
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import XYZ from 'ol/source/XYZ';
import View from "ol/View";

import "ol/ol.css";

class RasterMap extends React.Component<{}, {}> {
  componentDidMount() {
    new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `${process.env.REACT_APP_TILESERVER_ENDPOINT}/styles/basic/{z}/{x}/{y}.png`,
          }),
        })
      ],
      target: "map",
      view: new View({
        projection: "EPSG:3857",
        center: [2774006.69, 8433035.52],
        zoom: 10,
        minZoom: 0,
        maxZoom: 14
      }),
    });
  }

  render() {
    return (
      <div className="container">
        <div id="map" className="map" />
      </div>
    );
  }
};

export default RasterMap;
