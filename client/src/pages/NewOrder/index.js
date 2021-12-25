import React, { useState } from "react";
import { Button, Grid, Input } from 'semantic-ui-react'
import { useDispatch } from "react-redux";

import Alert from '../../Components/Alert'
import { setAlert } from "../../slices/alertSlice";
import * as api from '../../api/index.js'

import config from "../../config";

const NewOrder = () => {
    const dispatch = useDispatch()

    const [mmrFrom, setmmrFrom] = useState("")
    const [mmrTo, setmmrTo] = useState("")
    const [tokens, settokens] = useState("")
    const [trophyLvl, settrophyLvl] = useState("")
    const [payment, setpayment] = useState("")

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

    const createOrder = () => {
        const newObject = {
            mmrFrom,
            mmrTo,
            tokens,
            trophyLvl,
            payment: payment
        }
        api.createOrder(localStorage.getItem('token'), newObject, (res, err) => {
            if (res && res !== false && res.status == 200) {
                displayAlert(true, 'Order created succesfully', config.alertTimeout.normal)
            } else {
                console.log('err.response:', err.response);

                displayAlert(false, err.response.statusText, config.alertTimeout.normal)
            }//
            setmmrFrom("")
            setmmrTo("")
            settokens("")
            settrophyLvl("")
            settrophyLvl("")
            setpayment("")
        })
    }

    return (
        <div style={{ marginLeft: '20%', width: '60%' }}>
            <Alert />
            <h3 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '30px' }}>Create new order</h3>
            <Grid columns={3} divided>
                <Grid.Row>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='From' id='mmr-from' value={mmrFrom} onChange={(e) => setmmrFrom(e.target.value)} />
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='to' id='mmr-to' value={mmrTo} onChange={(e) => setmmrTo(e.target.value)} />
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='payment' id='payment' value={payment} onChange={(e) => setpayment(e.target.value)} />
                        </div>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='tokens' id='tokens' value={tokens} onChange={(e) => settokens(e.target.value)} />
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='account lvl' id='lvl' value={trophyLvl} onChange={(e) => settrophyLvl(e.target.value)} />
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <div style={{ textAlign: 'center', marginTop: "40px" }}>
                <Button positive onClick={createOrder}>Create</Button>
            </div>
        </div>
    )
}

export default NewOrder