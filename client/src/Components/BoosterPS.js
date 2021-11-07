import React, { useState, useEffect } from "react";
import { Button, Divider, Grid, Header, Input, Segment } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux';

import Alert from './Alert'
import { setOrders } from '../slices/orderSlice'
import { setAlert } from '../slices/alertSlice'
import * as api from '../api/index'
import config from "../config";
import { useHistory } from "react-router-dom";

import BoosterTimer from './BoosterTimer'
import OrderCard from "./OrderCard";

/**
 * Component for Booster on Personal Space
 */
const BoosterPS = () => {

    useEffect(() => {
        api.getProfile(localStorage.getItem('token'), (res, err) => {
            if (err) console.log(err);
            if (res) {
                console.log(res.data)
                const array = []
                for (let index = 0; index < res.data.length; index++) {
                    array.push({
                        from: res.data[index].mmrFrom, to: res.data[index].mmrTo, payment: res.data[index].payment,
                        dateTaken: new Date(res.data[index].dateTaken), login: res.data[index].steamLogin,
                        password: res.data[index].steamPassword, steamGuardCodes: res.data[index].steamGuardCodes,
                        isActive: res.data[index].isOrderInProgress, dateDone: new Date(res.data[index].dateDone)
                    })
                }
                setAllOrders(array)
                for (let index = 0; index < res.data.length; index++) {
                    if (res.data[index].isOrderInProgress && !res.data[index].dateDone) {
                        setActiveOrder({
                            login: res.data[index].steamLogin, password: res.data[index].steamPassword,
                            dateTaken: new Date(res.data[index].dateTaken), to: res.data[index].mmrTo, from: res.data[index].mmrFrom
                        })
                        setSteamGuardCodes(res.data[index].steamGuardCodes)
                    }
                }
            }
        })
    }, [])

    const [activeOrder, setActiveOrder] = useState('blank')
    const [steamGuardCodes, setSteamGuardCodes] = useState([])
    const [allOrders, setAllOrders] = useState([])

    const renderSteamGuardCodes = () => {
        if (steamGuardCodes.length == 0) {
            return <div style={{ textAlign: 'center' }}>wait for them</div>
        }
        const array = []
        for (let index = 0; index < steamGuardCodes.length / 6; index++) {
            console.log(`index: ${index}`);
            let localArray = []
            first: for (let j = 0; j < 6; j++) {
                console.log(`j: ${j}`);
                if (j + index * 6 >= steamGuardCodes.length) {
                    break first
                }
                localArray.push(
                    <Grid.Column textAlign='center'>{j + 1 + index * 6}: {steamGuardCodes[j + index * 6]}</Grid.Column>
                )
            }
            console.log(localArray);
            array.push(
                <Grid.Row>
                    {localArray}
                </Grid.Row>
            )
            console.log(array);
        }
        return (
            <Grid columns={6} divided>
                {array}
            </Grid>
        )
    }

    const renderAllOrders = () => {
        const array = []
        for (let index = 0; index < allOrders.length; index++) {
            array.push(
                <OrderCard from={allOrders[index].from} to={allOrders[index].to} payment={allOrders[index].payment}
                    active={allOrders[index].isActive}
                    dateTaken={allOrders[index].dateTaken} dateDone={allOrders[index].dateDone} />
            )
        }
        return array
    }

    const returnTime = () => {
        const timeleft = ((activeOrder.to - activeOrder.from) * 576) - Math.trunc((new Date() - activeOrder.dateTaken) / 1000) //*24/150/3600
        if (timeleft < 0) {
            return <span>Overdue for <BoosterTimer timeLeft={-timeleft} isOrderOverdue={true} /></span>
        }
        else {
            return <span>Time left: <BoosterTimer timeLeft={timeleft} isOrderOverdue={false} /></span>
        }
    }

    let haveActiveOrder = activeOrder == 'blank' ? false : true
    if (!haveActiveOrder) {
        return (
            <div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}><Header>My orders</Header></div>
                {renderAllOrders()}
            </div>
        )
    } else {
        return (
            <div style={{ fontSize: '1.1em' }}>
                <Alert />
                <Segment style={{ margin: '2em' }}>
                    <div style={{ marginTop: '30px', width: '80%', marginLeft: '10%' }}>
                        <Grid columns={3}>
                            <Grid.Row>
                                <Grid.Column textAlign='center'>Login: {activeOrder.login}</Grid.Column>
                                <Grid.Column textAlign='center'>{returnTime()}</Grid.Column>
                                <Grid.Column textAlign='center'>Password: {activeOrder.password}</Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                            Codes
                        </div>
                        {renderSteamGuardCodes()}
                    </div>
                </Segment>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Header>
                        My orders
                    </Header>
                </div>
                {renderAllOrders()}
            </div >
        )
    }

}

export default BoosterPS