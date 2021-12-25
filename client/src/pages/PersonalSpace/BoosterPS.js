import React, { useState, useEffect } from "react";
import { Button, Divider, Grid, Header, Input, Segment, Checkbox } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux';
import Alert from '../../Components/Alert'
import { setOrders } from '../../slices/orderSlice'
import { setAlert } from '../../slices/alertSlice'
import * as api from '../../api/index'
import config from "../../config";
import { useHistory } from "react-router-dom";
import BoosterTimer from './BoosterTimer'
import OrderCard from "./OrderCard";
import useInterval from "../../resources/useInterval";
import { areEqual } from "../../resources/hashFunctions";


/**
 * Component for Booster on Personal Space
 */
const BoosterPS = () => {
    const dispatch = useDispatch()

    const [nowMmr, setNowMmr] = useState("")
    const [boosterLoggedIn, setBoosterLoggedIn] = useState(false)
    const [haveChanged, setHaveChanged] = useState(true)
    const [activeOrder, setActiveOrder] = useState('blank')
    const [steamGuardCodes, setSteamGuardCodes] = useState([])
    const [allOrders, setAllOrders] = useState([])

    useEffect(() => {
        requestOrders()
    }, [])

    const requestOrders = () => {
        api.getProfile(localStorage.getItem('token'), (res, err) => {
            if (err) console.log(err);
            if (res)
                sortAndSetOrders(res)
        })
    }

    const displayAlert = (isBlue = true, text = 'placeholder', timeOutMS = 4000) => {
        dispatch(setAlert({
            alertVisiable: true, isAlertColorBlue: isBlue,
            alertMessage: text
        }))
        setTimeout(() => {
            dispatch(setAlert({
                alertVisiable: false, isAlertColorBlue: isBlue,
                alertMessage: text
            }))
        }, timeOutMS)
    }

    useInterval(requestOrders, 10 * 1000)

    const sortAndSetOrders = (res) => {
        const array = []
        for (let index = 0; index < res.data.length; index++) {
            const order = res.data[index]
            array.push({
                from: order.mmrFrom, to: order.mmrTo, payment: order.payment,
                dateTaken: new Date(order.dateTaken), login: order.steamLogin,
                password: order.steamPassword, steamGuardCodes: order.steamGuardCodes,
                isActive: order.isOrderInProgress, dateDone: new Date(order.dateDone)
            })
        }

        if (!areEqual(allOrders, array) && allOrders.length !== 0)
            displayAlert(true, 'New order data', 4000)

        setAllOrders(array)
        let bool1 = true
        for (let index = 0; index < res.data.length; index++) {
            const order = res.data[index]
            if (order.isOrderInProgress && !order.dateDone) {
                bool1 = false
                setActiveOrder({
                    login: order.steamLogin, password: order.steamPassword, orderId: order._id,
                    dateTaken: new Date(order.dateTaken), to: order.mmrTo, from: order.mmrFrom
                })
                setSteamGuardCodes(order.steamGuardCodes)
            }
        }
        if (bool1) setActiveOrder('blank')
    }

    const renderSteamGuardCodes = () => {
        if (steamGuardCodes.length == 0) {
            return <div style={{ textAlign: 'center' }}>wait for them</div>
        }
        const array = []
        for (let index = 0; index < steamGuardCodes.length / 6; index++) {
            let localArray = []
            first: for (let j = 0; j < 6; j++) {
                if (j + index * 6 >= steamGuardCodes.length) {
                    break first
                }
                localArray.push(
                    <Grid.Column textAlign='center'>{j + 1 + index * 6}: {steamGuardCodes[j + index * 6]}</Grid.Column>
                )
            }
            array.push(
                <Grid.Row>
                    {localArray}
                </Grid.Row>
            )
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

    const sendDataToOG = () => {
        if (haveChanged && nowMmr != '') {
            api.sendDataToOG(localStorage.getItem('token'), {
                boosterLoggedIn,
                nowMmr,
                orderId: activeOrder.orderId
            }, (res, err) => {
                console.log(err, res?.data)
                if (err)
                    displayAlert(false, err?.response?.statusText, config.alertTimeout.normal)
                else
                displayAlert(true, 'Data send succesfully', config.alertTimeout.short)
            }
            )
            // setHaveChanged(false)
        } else { console.log('net') }
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
                <Divider hidden />

                <Grid columns={3}>
                    <Grid.Row textAlign='center'>
                        <Grid.Column>
                            <Checkbox label='I have logged in account' checked={boosterLoggedIn}
                                onChange={(e) => setBoosterLoggedIn(!boosterLoggedIn)} />
                        </Grid.Column>
                        <Grid.Column>
                            <Input placeholder='now mmr' value={nowMmr} onChange={(e) => setNowMmr(e.target.value)} />
                        </Grid.Column>
                        <Grid.Column>
                            <Button positive onClick={sendDataToOG}>
                                Send data to order giver
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Divider hidden />
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