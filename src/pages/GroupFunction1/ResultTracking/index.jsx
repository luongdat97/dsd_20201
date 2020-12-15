import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import ProblemReport from "./ProblemReport";
import ResultTrack from "./ResultTrack";

export default function Topics() {
    let match = useRouteMatch();
  
    return (
      <div>
        <Switch>
          <Route path={`${match.path}/tree-problem-report`}>
            <ProblemReport />
          </Route>
          <Route exact path={match.path}>
            <ResultTrack />
          </Route>
        </Switch>
      </div>
    );
  }
  
  