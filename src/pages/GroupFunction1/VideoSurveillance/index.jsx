import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useLocation
} from "react-router-dom";
import DroneList from "./DroneList";
import DronePath from "./DronePath";
import AreaMonitor from './AreaMonitor';
import ZoneMonitor from './ZoneMonitor';
export default function Topics() {
    let match = useRouteMatch();
    let query = new URLSearchParams(useLocation().search);
  
    return (
      <div>
        <Switch>
          <Route path={`${match.path}/drone-path`}>
            <DronePath />
          </Route>
          <Route path={`${match.path}/drone-list`}>
            <DroneList />
          </Route>
          <Route path={`${match.path}/zone-monitor`}>
            <ZoneMonitor selectedAreaId={query.get("selectedAreaId")} />
          </Route>
          <Route exact path={match.path}>
            <AreaMonitor />
          </Route>
        </Switch>
      </div>
    );
  }
  
  