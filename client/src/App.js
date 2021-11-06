import './index.css'
import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import HomePage from './Components/HomePage'
import Orders from './Components/Orders'
import NewOrder from './Components/NewOrder'
import Header from './Components/Header'
import PersonalSpace from './Components/PersonalSpace'
import * as api from './api/index'
import {setRole} from './slices/roleSlice'

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
                <Route exact path='/'>
                    <HomePage />
                </Route>
                <Route path='/orders'>
                    <Orders />
                </Route>
                <Route path='/new-order'>
                    <NewOrder />
                </Route>
                <Route path='/personal-space'>
                    <PersonalSpace role={role} />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
