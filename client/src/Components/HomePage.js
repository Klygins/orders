import React from "react";
import { useDispatch } from "react-redux";
import { Button, Divider, Header, Input, Transition } from "semantic-ui-react";

import Alert from './Alert'
import { setRole } from '../slices/roleSlice'
import { setAlert } from "../slices/alertSlice";
import * as api from '../api/index'

const HomePage = () => {
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
        <div>
            <Alert />
            <div style={{ textAlign: 'center' }}>
                <Divider hidden />
                <Header>Rules</Header>
                <div style={{ width: '50%', marginLeft: '25%' }}>deadline is 150 mmr per day, once you log in account turn on invisible mode and only then open dota, after that you should send start screen(mmr).
                    Every 150 mmr screenshot with mmr must be sent, when you want to billout write me in discord</div>
                <div style={{ marginTop: '40px' }}>
                    <Input placeholder='username' id='username'></Input>
                    <Divider hidden />
                    <Input placeholder='password' id='password'></Input>
                    <Divider hidden />
                    <Button positive
                        onClick={() => {
                            api.login({
                                username: document.getElementById('username').value,
                                password: document.getElementById('password').value
                            }, (res, err) => {
                                if (err) {
                                    console.log(err);
                                    displayAlert(false, 'error', 2000)
                                } else {
                                    displayAlert(true, 'succesfuly logged in', 2000)
                                    localStorage.setItem('token', res.data.token)
                                    api.getRole(localStorage.getItem('token'), (res, err) => {
                                        if (err) console.log(err);
                                        if (res.data) {
                                            dispatch(setRole(res.data))
                                        }
                                    })
                                }
                            })
                        }
                        }>Log in</Button>
                </div>
            </div >
        </div>
    )
}

export default HomePage