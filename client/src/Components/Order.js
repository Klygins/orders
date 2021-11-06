import React from "react";
import { Segment, Modal, Button, Transition } from 'semantic-ui-react'
import { useDispatch, useSelector } from "react-redux";

import { setAlert } from "../slices/alertSlice";
import * as api from '../api/index'

const Order = (props) => {
    const dispatch = useDispatch()
    console.log(props.dateDone);

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

    const [open, setOpen] = React.useState(false)
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
                        <Button size='small'
                            positive>
                            take order
                        </Button>
                    </div>}>
                    <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>confirm</h2>
                    <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '110%' }}>
                        {props.from}-{props.to} deadline:
                        {(props.to - props.from) < 300 ?
                            <span>{Math.trunc(((props.to - props.from) / 150) * 24)}hours</span>
                            :
                            <span>{Math.trunc((props.to - props.from) / 150)} days</span>
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
                                            displayAlert(true, 'order taken succesfully', 3000)
                                            console.log(res.data);
                                            break
                                        default:
                                            setOpen(false)
                                            displayAlert(false, 'you alredy have an order', 3000)
                                            break
                                    }
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