import React, { useState } from "react";
import { Segment, Modal, Button, Transition } from 'semantic-ui-react'
import { useDispatch } from "react-redux";

import { setAlert } from "../slices/alertSlice";
import * as api from '../api/index'
import { useHistory } from "react-router-dom";

import config from '../config'

const Order = (props) => {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)

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
        <div className='order'>
            <Segment.Group horizontal>
                <Segment>from: {props.from}</Segment>
                <Segment>to: {props.to}</Segment>
                <Segment>tokens: {props.tokens}</Segment>
                <Segment>payment: {props.payment}</Segment>
                <Segment>trophy lvl: {props.lvl}</Segment>
                <Modal
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                    open={open}
                    trigger={<div style={{ paddingTop: '0.5em', paddingRight: '1em' }}>
                        <Button size='small' positive content='Take Order' />
                    </div>}>
                    <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>{"Confirm"}</h2>
                    <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '110%' }}>
                        {props.from} - {props.to}. Deadline:
                        {(props.to - props.from) < 300 ?
                            <span> {Math.trunc(((props.to - props.from) / 150) * 24)} hours</span>
                            :
                            <span> {Math.trunc((props.to - props.from) / 150)} days</span>
                        }
                    </div>
                    <div style={{ marginLeft: '43.6%', marginBottom: '10px' }}>
                        <Button positive onClick={() => {
                            api.takeOrder(localStorage.getItem('token'), props.id, (res, err) => {
                                if (err) { console.log(err) }
                                else {
                                    console.log(props.id);
                                    switch (res.status) {
                                        case 200:
                                            setOpen(false)
                                            displayAlert(true, 'Order taken succesfully', config.alertTimeout.short)
                                            console.log(res.data);
                                            break
                                        default:
                                            setOpen(false)
                                            displayAlert(false, 'You alredy have an order', config.alertTimeout.normal)
                                            break
                                    }
                                    history.push(config.pages.personalSpace)
                                }
                            })
                        }}
                        >Take Order</Button>
                    </div>
                </Modal>
            </Segment.Group>
        </div>
    )
}

export default Order