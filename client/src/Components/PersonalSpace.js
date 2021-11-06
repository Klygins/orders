import React, { useState, useEffect } from "react";
import { Button, Divider, Grid, Header, Input, Segment } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux';

import Alert from './Alert'
import { setOrders } from '../slices/orderSlice'
import { setAlert } from '../slices/alertSlice'
import * as api from '../api/index'

const Order = (props) => {
    console.log(props);
    const status = props.active ? 'active' : 'done'
    let dateTaken
    if (props.dateTaken) {

        dateTaken = <span>{props.dateTaken.getDate()}.{props.dateTaken.getMonth()} {props.dateTaken.getHours()}:
            {props.dateTaken.getMinutes()} (GMT+7)</span>
    } else {
        dateTaken = <div>n/a</div>
    }
    const returnDateDone = () => {
        let dateDone
        if (!props.active && props.dateDone) {
            dateDone = <span>{props.dateDone.getDate()}.{props.dateDone.getMonth()} {props.dateDone.getHours()}:
                {props.dateDone.getMinutes()} (GMT+7)</span>
            return (
                <Segment>date done: {dateDone}</Segment>
            )
        } else {
            return null
        }
    }
    return (
        <div className='order'>
            <Segment.Group horizontal>
                <Segment>date taken: {dateTaken}</Segment>
                {returnDateDone()}
                <Segment>from: {props.from}</Segment>
                <Segment>to: {props.to}</Segment>
                <Segment>payment: {props.payment} rub</Segment>
                <Segment>Status: {status}</Segment>
            </Segment.Group>
        </div>
    )
}

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 }
    }
    //props.timeLeft is time in sec
    componentDidMount() {
        if (this.props.isOrderOverdue) {
            let interval = setInterval(() => {
                this.setState({ count: this.state.count - 1 })
            }, 1000)
        } else {
            let interval = setInterval(() => {
                this.setState({ count: this.state.count + 1 })
            }, 1000)
        }
    }
    render() {
        let timeLeft = this.props.timeLeft - this.state.count
        let timer = <span>
            {Math.trunc(timeLeft / 3600)}:
            {Math.trunc(timeLeft / 60) % 60}:
            {Math.trunc(timeLeft % 60)}
        </span>
        return (<span>{timer}</span>)
    }
}

const ActiveOrder = (props) => {
    const dispatch = useDispatch()
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
    let login, password
    const dateObj = new Date(props.dateTaken)
    const date =
        <span>
            {dateObj.getDate()}.{dateObj.getMonth()} {dateObj.getHours()}:{dateObj.getMinutes()} (GMT+7)
        </span>

    useEffect(() => {
        if (props.login == 'wait for it') {
            login = ''
        } else {
            login = props.login
        }
        if (props.password == 'wait for it') {
            password = ''
        } else {
            password = props.password
        }
    }, [])

    const logId = props._id + 'login'
    const pasId = props._id + 'password'
    const sgcId = props._id + 'steamGuardCodes'

    const returnSGCToSend = (codes) => {
        return codes.split(' ');
    }
    return (
        <Segment.Group>
            <Segment.Group horizontal>
                <Segment>Date taken: {date}</Segment>
                <Segment>From: {props.from}</Segment>
                <Segment>To: {props.to}</Segment>
                <Segment>Price: {props.price}</Segment>
                <Segment>Lvl: {props.lvl}</Segment>
                <Segment>Tokens: {props.tokens}</Segment>
            </Segment.Group>
            <Segment.Group horizontal>
                <Segment>
                    <Input fluid placeholder='Login' value={login} id={logId}></Input>
                </Segment>
                <Segment>
                    <Input fluid placeholder='Password' value={password} id={pasId}></Input>
                </Segment>
                <Segment>
                    <Input fluid placeholder='Steam Guard Codes' id={sgcId}></Input>
                </Segment>
            </Segment.Group>
            <div style={{ textAlign: 'center' }}>
                <Button size='small' positive onClick={() => {
                    api.updateOrderData(localStorage.getItem('token'), {
                        steamLogin: document.getElementById(logId).value,
                        steamPassword: document.getElementById(pasId).value,
                        steamGuardCodes: returnSGCToSend(document.getElementById(sgcId).value),
                        _id: props._id, boosterId: props.boosterId
                    }, (res, err) => {
                        if (err) console.log(err);
                        else displayAlert(true, 'data just send to booster', 3000)
                    })
                }}>send data to booster</Button>
                <span style={{ marginRight: '3em', marginLeft: '3em' }}></span>
                <Button size='small' positive onClick={() => {
                    api.markOrderAsDone(localStorage.getItem('token'), props._id, (res, err) => {
                        if (res) {
                            displayAlert(true, 'marked as done', 3000)
                        }
                    })
                }}>mark order as done</Button>
            </div>
        </Segment.Group>
    )
}

const NotTakenOrder = (props) => {
    const dispatch = useDispatch()
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

    return (
        <Segment.Group horizontal>
            <Segment><div style={{ verticalAlign: 'middle' }}>From: {props.from}</div></Segment>
            <Segment>To: {props.to}</Segment>
            <Segment>Price: {props.price}</Segment>
            <Segment>Lvl: {props.lvl}</Segment>
            <Segment>Tokens: {props.tokens}</Segment>
            <div style={{ paddingTop: '0.5em', paddingRight: '1em' }}><Button size='small' negative
                onClick={() => {
                    console.log(props._id);
                    api.deleteOrder(localStorage.getItem('token'), props._id, (res, err) => {
                        if (err) console.log(err);
                        else {
                            displayAlert(true, 'order deleted succesfully', 3000)
                        }
                    })
                }}
            >delete order</Button></div>
        </Segment.Group>
    )
}

const PersonalSpace = (props) => {
    const dispatch = useDispatch()
    if (props.role == 1) {
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
                    <Order from={allOrders[index].from} to={allOrders[index].to} payment={allOrders[index].payment}
                        active={allOrders[index].isActive}
                        dateTaken={allOrders[index].dateTaken} dateDone={allOrders[index].dateDone} />
                )
            }
            return array
        }

        const returnTime = () => {
            const timeleft = ((activeOrder.to - activeOrder.from) * 576) - Math.trunc((new Date() - activeOrder.dateTaken) / 1000) //*24/150/3600
            if (timeleft < 0) {
                return <span>order is overdue for <Timer timeLeft={-timeleft} isOrderOverdue={true} /></span>
            }
            else {
                return <span>time left: <Timer timeLeft={timeleft} isOrderOverdue={false} /></span>
            }
        }

        let haveActiveOrder = activeOrder == 'blank' ? false : true
        if (haveActiveOrder) {
            return (
                <div style={{ fontSize: '1.1em' }}>
                    <Alert />
                    <div style={{ marginTop: '30px', width: '80%', marginLeft: '10%' }}>
                        <Grid columns={3}>
                            <Grid.Row>
                                <Grid.Column textAlign='center'>login: {activeOrder.login}</Grid.Column>
                                <Grid.Column textAlign='center'>{returnTime()}</Grid.Column>
                                <Grid.Column textAlign='center'>password: {activeOrder.password}</Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Codes</div>
                        {renderSteamGuardCodes()}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}><Header>My orders</Header></div>
                    {renderAllOrders()}
                </div>
            )
        }
        else {
            return (
                <div>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}><Header>My orders</Header></div>
                    {renderAllOrders()}
                </div>
            )
        }
    }

    if (props.role == 2) {
        useEffect(() => {
            api.getProfile(localStorage.getItem('token'), (res, err) => {
                if (err) console.log(err);
                dispatch(setOrders(res.data))
            })
        }, [])
        const orders = useSelector(state => state.orders.orders)
        console.log('orders from state:',orders);
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

        const returnDoneOrders = () =>{
            const doneOrders = []

            for (let index = 0; index < orders.length; index++) {
                if (!orders[index].isOrderInProgress) {
                    doneOrders.push(
                        <Order dateTaken={new Date(orders[index].dateTaken)} from={orders[index].mmrFrom} to={orders[index].mmrTo}
                            price={orders[index].payment}  />
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
    else return null
}

export default PersonalSpace