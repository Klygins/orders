import React, { useState, useEffect } from "react";
import { Button, Divider, Grid, Header, Input, Segment } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux';
import Alert from '../../Components/Alert'
import { setOrders } from '../../slices/orderSlice'
import { setAlert } from '../../slices/alertSlice'
import * as api from '../../api/index'
import config from "../../config";
import { useHistory } from "react-router-dom";
import ActiveOrder from './ActiveOrder.js'
import OrderCard from './OrderCard'
import NotTakenOrder from './NotTakenOrder'
import useInterval from "../../resources/useInterval";

/**
 * Component for Order Giver on Personal Space
 */
const OGPS = () => {
    const [orders, setLocalOrders] = useState([])

    useEffect(() => {
        requestOrders()
    }, [])

    const requestOrders = () => {
        api.getProfile(localStorage.getItem('token'), (res, err) => {
            if (err) console.log(err);
            // const profile = res.data
            // const orders = profile.orders
            // dispatch(setOrders(res.data))
            setLocalOrders(res.data)
        })
    }

    useInterval(requestOrders, 10 * 1000)

    // const orders = useSelector(state => state.orders.orders)
    // console.log('orders from state:', orders);

    const returnNotTakenOrders = () => {
        const notTakenOrders = []
        for (let index = 0; index < orders.length; index++) {
            const order = orders[index]
            if (!order.isOrderInProgress && order.booster == 'n/a') {
                notTakenOrders.push(
                    <NotTakenOrder from={order.mmrFrom} to={order.mmrTo}
                        payment={order.payment} steamGuardCodes={order.steamGuardCodes}
                        login={order.steamLogin} password={order.steamPassword}
                        tokens={order.tokens} lvl={order.trophyLvl} _id={order._id} />
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
            const order = orders[index]
            if (order.isOrderInProgress) {
                activeOrders.push(
                    <ActiveOrder dateTaken={order.dateTaken} from={order.mmrFrom} to={order.mmrTo}
                        payment={order.payment} steamGuardCodes={order.steamGuardCodes}
                        login={order.steamLogin} password={order.steamPassword} boosterId={order.boosterId}
                        tokens={order.tokens} lvl={order.trophyLvl} _id={order._id} boosterLoggedIn={order.boosterLoggedIn}
                        nowMmr={order.nowMmr} />
                )
            }
        }
        return (
            <div style={{ width: '80%', marginLeft: '10%' }}>
                {activeOrders}
            </div>
        )
    }
    console.log(orders);

    const returnDoneOrders = () => {
        const doneOrders = []

        for (let index = 0; index < orders.length; index++) {
            const order = orders[index]
            if (!order.isOrderInProgress && order.dateTaken) {
                doneOrders.push(
                    <OrderCard dateTaken={new Date(order.dateTaken)} dateDone={new Date(order.dateDone)} from={order.mmrFrom} to={order.mmrTo}
                        payment={order.payment} notShowDone={true} />
                )
            }
        }

        return (
            <div style={{ width: '80%', marginLeft: '10%' }}>
                {doneOrders}
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
            <Header textAlign='center'>Done orders</Header>
            <Divider hidden />
            {returnDoneOrders()}
            <Divider hidden />
        </div>
    )

}

export default OGPS