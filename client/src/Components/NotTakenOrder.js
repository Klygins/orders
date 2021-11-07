import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Button, Divider, Grid, Header, Input, Segment } from 'semantic-ui-react'

import config from "../config";
import { setAlert } from '../slices/alertSlice'
import { useHistory } from "react-router-dom";
import * as api from '../api'


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

    let history = useHistory();

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
                        else
                            displayAlert(true, 'Order deleted succesfully', config.alertTimeout.normal)

                        setTimeout(() => {
                            history.push(config.pages.personalSpace)
                        }, 500)
                    })
                }}
            >Delete order</Button></div>
        </Segment.Group>
    )
}

export default NotTakenOrder