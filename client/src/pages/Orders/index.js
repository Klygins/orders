import React, { useState, useEffect } from "react";
import { Header } from 'semantic-ui-react'

import Alert from '../../Components/Alert'
import * as api from '../../api/index.js'
import Order from './Order'
import useInterval from '../../resources/useInterval'
import { areEqual } from "../../resources/hashFunctions";
import newOrderSound from '../../sound/newOrder.mp3';

const Orders = () => {
    const audio = new Audio(newOrderSound);
    const [orders, setOrders] = useState([])
    useEffect(() => {
        getOrders()
    }, [])
    const getOrders = () => {
        const token = localStorage.getItem('token')
        if (token) {
            api.getOrders(token, (res, err) => {
                console.log('We got res from getOrders:', res, err);
                if (!areEqual(orders, res.data) && orders.length !== 0) {
                    audio.play()
                }
                if (res && res !== false) {
                    setOrders(res.data)
                } else {
                    console.log(err);
                }
            })
        }
    }
    useInterval(getOrders, 10 * 1000)
    const renderOrders = () => {
        const array = []
        orders.forEach((order) => {
            array.push(
                <Order from={order.mmrFrom} to={order.mmrTo} tokens={order.tokens}
                    payment={order.payment} lvl={order.trophyLvl} id={order._id} />
            )
        })
        return array
    }
    return (
        <div>
            <Alert />
            <div style={{ textAlign: 'center', marginTop: '20px' }}><Header>Active orders list</Header></div>
            {renderOrders()}
            {/* <Order from='0' to='2000' tokens='20' payment='5000' lvl='90' />
            <Order from='6000' to='6200' tokens='20' payment='2000' lvl='90' /> */}
        </div>
    )
}
export default Orders