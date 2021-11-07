import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import * as api from '../api/index'
import { setAlert } from '../slices/alertSlice'
import { useHistory } from "react-router-dom";
import { Button, Divider, Grid, Header, Input, Segment } from 'semantic-ui-react'
import config from '../config';


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

    let history = useHistory();

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
                    if (document.getElementById(logId).value
                        && document.getElementById(pasId).value
                        && document.getElementById(sgcId).value) {
                        api.updateOrderData(localStorage.getItem('token'), {
                            steamLogin: document.getElementById(logId).value,
                            steamPassword: document.getElementById(pasId).value,
                            steamGuardCodes: returnSGCToSend(document.getElementById(sgcId).value),
                            _id: props._id, boosterId: props.boosterId
                        }, (res, err) => {
                            if (err) console.log(err);
                            else displayAlert(true, 'Data just send to booster', config.alertTimeout.normal)
                            history.push(config.pages.personalSpace)
                        })
                    } else
                        displayAlert(false, 'Not all data provided', config.alertTimeout.normal)
                }}>Send data to booster</Button>
                {/* TODO: Make controlled */}
                <span style={{ marginRight: '3em', marginLeft: '3em' }}></span>
                <Button size='small' onClick={() => {
                    api.markOrderAsDone(localStorage.getItem('token'), props._id, (res, err) => {
                        if (res) {
                            displayAlert(true, 'Marked as done', config.alertTimeout.normal)
                        }
                    })
                    history.push(config.pages.personalSpace)
                }}>Mark order as done</Button>
                {/* TODO: Add modal screen */}
            </div>
            <div style={{ paddingBottom: '0.55em' }} />
        </Segment.Group>
    )
}

export default ActiveOrder