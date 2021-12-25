import './index.css'
import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import HomePage from './pages/Home/'
import Orders from './pages/Orders'
import NewOrder from './pages/NewOrder/'
import Header from './Components/Header'
import PersonalSpace from './pages/PersonalSpace/PersonalSpace'
import * as api from './api/index'
import { setRole } from './slices/roleSlice'
import config from './config';

function App() {
    const role = useSelector(state => state.role.role)
    const dispatch = useDispatch()
    useEffect(() => {
        api.getRole(localStorage.getItem('token'), (res, err) => {
            if (err) console.log(err);
            if (res.data) {
                dispatch(setRole(res.data))
            }
        })
    }, [])
    //0 == unauth 1== booster 2== giveOrders

    return (
        <Router>
            <Header role={role} />
            <Switch>
                <Route exact path={config.pages.home} component={HomePage} />
                <Route path={config.pages.orders} component={Orders} />
                <Route path={config.pages.newOrder} component={NewOrder} />
                <Route path={config.pages.personalSpace} component={PersonalSpace} />
            </Switch>
        </Router>
    );
}

export default App;
