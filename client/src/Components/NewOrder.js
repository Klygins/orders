import React from "react";
import { Button, Grid, Input, Transition } from 'semantic-ui-react'
import { useDispatch } from "react-redux";

import Alert from './Alert'
import { setAlert } from "../slices/alertSlice";
import * as api from '../api/index.js'

const NewOrder = () => {
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
        <div style={{ marginLeft: '20%', width: '60%' }}>
            <Alert />
            <h3 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '30px' }}>Create new order</h3>
            <Grid columns={3} divided>
                <Grid.Row>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='from' id='mmr-from'></Input>
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='to' id='mmr-to'></Input>
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='price' id='price'></Input>
                        </div>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='tokens' id='tokens'></Input>
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='account lvl' id='lvl'></Input>
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        {/* <div style={{ textAlign: 'center' }}>
                            <Input placeholder='price' id='price'></Input>
                        </div> */}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <div style={{ textAlign: 'center', marginTop: "40px" }}>
                <Button positive onClick={() => {
                    api.createOrder(localStorage.getItem('token'), {
                        "mmrFrom": document.getElementById('mmr-from').value,
                        "mmrTo": document.getElementById('mmr-to').value,
                        "tokens": document.getElementById('tokens').value,
                        "trophyLvl": document.getElementById('lvl').value,
                        "payment": document.getElementById('price').value
                    }, (res, err) => {
                        if (res && res !== false && res.status == 200) {
                            displayAlert(true, 'Order created succesfully', 3500)
                        } else {
                            console.log(err);
                            displayAlert(false, 'Error', 3500)
                        }
                    })
                }}>Create</Button>
            </div>
        </div>
    )
}

export default NewOrder