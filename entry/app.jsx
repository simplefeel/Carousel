import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import routers from '../app/routes';
import _ from 'lodash'

ReactDom.render(
    <Router routes={routers} history={hashHistory}></Router>, document.getElementById('container'));
