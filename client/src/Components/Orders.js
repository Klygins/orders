import React, { useState, useEffect } from "react";
import { Header } from 'semantic-ui-react'
import Alert from './Alert'

import * as api from '../api/index.js'
import Order from './Order'

const Orders = () => {
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            api.getOrders(token, (res, err) => {
                console.log('We got res from getOrders:', res, err);
                if (res && res !== false) {
                    setOrders(res.data)
                } else {
                    console.log(err);
                }
            })
        }
    }, [])

    const [orders, setOrders] = useState([])

    const renderOrders = () => {
        const array = []
        for (let index = 0; index < orders.length; index++) {
            array.push(
                <Order from={orders[index].mmrFrom} to={orders[index].mmrTo} tokens={orders[index].tokens}
                    payment={orders[index].payment} lvl={orders[index].trophyLvl} id={orders[index]._id} />
            )
        }
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