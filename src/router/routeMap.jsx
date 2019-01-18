import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";

import Index from "../containers/index";

class RouteMap extends Component {
    render() {
        return (
           <Switch>
               <Route path="/" exact component={Index} />
           </Switch> 
        );
    }
}

export default RouteMap;