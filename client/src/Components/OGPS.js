import React, { useState, useEffect } from "react";
import { Button, Divider, Grid, Header, Input, Segment } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux';

import Alert from './Alert'
import { setOrders } from '../slices/orderSlice'
import { setAlert } from '../slices/alertSlice'
import * as api from '../api/index'
import config from "../config";
import { useHistory } from "react-router-dom";

import ActiveOrder from './ActiveOrder.js'
import OrderCard from './OrderCard'
import NotTakenOrder from './NotTakenOrder'

/**
 * Component for Order Giver on Personal Space
 */
const OGPS = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        api.getProfile(localStorage.getItem('token'), (res, err) => {
            if (err) console.log(err);
            dispatch(setOrders(res.data))
        })
    }, [])
    const orders = useSelector(state => state.orders.orders)
    console.log('orders from state:', orders);
    const returnNotTakenOrders = () => {
        const notTakenOrders = []
        for (let index = 0; index < orders.length; index++) {
            if (!orders[index].isOrderInProgress && orders[index].booster == 'n/a') {
                notTakenOrders.push(
                    <NotTakenOrder from={orders[index].mmrFrom} to={orders[index].mmrTo}
                        price={orders[index].payment} steamGuardCodes={orders[index].steamGuardCodes}
                        login={orders[index].steamLogin} password={orders[index].steamPassword}
                        tokens={orders[index].tokens} lvl={orders[index].trophyLvl} _id={orders[index]._id} />
                )
            }
        }
        return (
            <div style={{ width: '80%', marginLeft: '10%' }}>
                {notTakenOrders}
            </div>
        )
    }

    const returnActiveOrders = () => {
        const activeOrders = []
        for (let index = 0; index < orders.length; index++) {
            if (orders[index].isOrderInProgress) {
                activeOrders.push(
                    <ActiveOrder dateTaken={orders[index].dateTaken} from={orders[index].mmrFrom} to={orders[index].mmrTo}
                        price={orders[index].payment} steamGuardCodes={orders[index].steamGuardCodes}
                        login={orders[index].steamLogin} password={orders[index].steamPassword} boosterId={orders[index].boosterId}
                        tokens={orders[index].tokens} lvl={orders[index].trophyLvl} _id={orders[index]._id} />
                )
            }
        }
        return (
            <div style={{ width: '80%', marginLeft: '10%' }}>
                {activeOrders}
            </div>
        )
    }

    const returnDoneOrders = () => {
        const doneOrders = []

        for (let index = 0; index < orders.length; index++) {
            if (!orders[index].isOrderInProgress) {
                doneOrders.push(
                    <OrderCard dateTaken={new Date(orders[index].dateTaken)} from={orders[index].mmrFrom} to={orders[index].mmrTo}
                        price={orders[index].payment} />
                )
                console.log(orders[index]);
            }
        }

        return (
            <div style={{ width: '80%', marginLeft: '10%' }}>
                {/* {doneOrders} */}
            </div>
        )
    }
    return (
        <div>
            <Alert />
            <Divider hidden />
            <Header textAlign='center'>Active orders</Header>
            {returnActiveOrders()}
            <Divider hidden />
            <Header textAlign='center'>Not taken orders</Header>
            <Divider hidden />
            {returnNotTakenOrders()}
            {/* <Header textAlign='center'>Done orders</Header>
            <Divider hidden />
            {returnDoneOrders()} */}
        </div>
    )

}

export default OGPS