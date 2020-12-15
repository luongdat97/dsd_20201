import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import DroneList from "./DroneList";
import DronePath from "./DronePath";
import AreaMonitor  from './AreaMonitor';

export default function Topics() {
    let match = useRouteMatch();
  
    return (
      <div>
        <Switch>
          <Route path={`${match.path}/drone-path`}>
            <DronePath />
          </Route>
          <Route path={`${match.path}/drone-list`}>
            <DroneList />
          </Route>
          <Route exact path={match.path}>
            <AreaMonitor />
          </Route>
        </Switch>
      </div>
    );
  }
  
  