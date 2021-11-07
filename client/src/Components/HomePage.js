import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Divider, Header, Input, Transition } from "semantic-ui-react";

import Alert from './Alert'
import { setRole } from '../slices/roleSlice'
import { setAlert } from "../slices/alertSlice";
import * as api from '../api/index'
import { useHistory } from "react-router-dom";
import config from '../config'

const HomePage = () => {

    const [isLoaded, setIsLoaded] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

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

    useEffect(() => {
        getRole()
    }, [])

    const login = () => {
        api.login({ username, password }, (res, err) => {
            setIsLoaded(true)
            if (err) {
                displayAlert(false, err, config.alertTimeout.long)
            } else {
                displayAlert(true, 'Succesfuly logged in', config.alertTimeout.short)
                localStorage.setItem('token', res.data.token)
                getRole()
            }
        })
    }

    const getRole = () => {
        api.getRole(localStorage.getItem('token'), (res, err) => {
            setIsLoaded(true)
            if (err) console.log(err);
            if (res.data) {

                dispatch(setRole(res.data))

                switch (res.data) {
                    case 1:
                        // Boosters
                        history.push(config.pages.personalSpace)
                        break;
                    case 2:
                        // Order giver
                        history.push(config.pages.newOrder)
                        break;

                    default:
                        displayAlert(false, 'Please contact admin! Wrong role!!!', config.alertTimeout.long)
                        console.log('ERROR! Received bad code from /get-role')
                        break;
                }
            }
        })
    }

    return (
        <div>
            <Alert />
            {
                !isLoaded
                    ? (<div>
                        <h1>Loading...</h1>
                    </div>)
                    : (
                        <div>
                            <div style={{ textAlign: 'center' }}>
                                <Divider hidden />
                                <Header>Rules</Header>
                                <div style={{ width: '50%', marginLeft: '25%' }}>Deadline is 150 mmr per day, once you log in account turn on invisible mode and only then open dota, after that you should send start screen(mmr).
                                </div>
                                <div style={{ width: '50%', marginLeft: '25%' }}>
                                    Every 150 mmr screenshot with mmr must be sent, when you want to billout write me in discord: <strong>{config.myDiscord}</strong></div>
                            </div>

                            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                                <Input placeholder='username' id='username' value={username} onChange={(e) => setUsername(e.target.value)} />
                                <Divider hidden />
                                <Input placeholder='password' type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Divider hidden />
                                <Button positive onClick={login} content={'Log in'} />
                            </div>
                        </div>
                    )

            }
        </div >
    )
}

export default HomePage