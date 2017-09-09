import React from 'react';
import { createHashHistory } from 'history';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Test from './pages/carousel.js'
import Demo from './pages/demo.js'
export default (
    <Router history={hashHistory}>
        <Route path='/test' component={Test} />
        <Route path='/demo' component={Demo} />
    </Router>
)
