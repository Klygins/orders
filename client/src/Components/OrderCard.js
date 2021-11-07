import React, { useState, useEffect } from "react";
import { Button, Divider, Grid, Header, Input, Segment } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux';

import Alert from './Alert'
import { setOrders } from '../slices/orderSlice'
import { setAlert } from '../slices/alertSlice'
import * as api from '../api/index'
import config from "../config";
import { useHistory } from "react-router-dom";


const OrderCard = (props) => {
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

export default OrderCard