
import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import VectorMap from "./VectorMap";
import RasterMap from "./RasterMap";

import './App.css';

interface AppProps {}

class App extends React.Component<{}, AppProps> {
  render() {
    return (
      <Router>
        <main>
          <Switch>
            <Route exact path="/">
              <VectorMap />
            </Route>
            <Route path="/raster">
              <RasterMap />
            </Route>
          </Switch>
        </main>
      </Router>
    );
  }
}

export default App;
