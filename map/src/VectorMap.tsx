import * as React from "react";
import { Map } from "maplibre-gl";

class VectorMap extends React.Component<{}, {}> {
  componentDidMount() {
    new Map({
      container: "map",
      style: `${process.env.REACT_APP_TILESERVER_ENDPOINT}/styles/basic/style.json`,
      center: [24.9, 60.15],
      zoom: 10,
      minZoom: 0,
      maxZoom: 14,
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

export default VectorMap;
