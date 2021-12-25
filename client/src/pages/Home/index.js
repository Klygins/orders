import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import Alert from '../../Components/Alert'
import { setRole } from '../../slices/roleSlice'
import { setAlert } from "../../slices/alertSlice";
import * as api from '../../api/index'
import { useHistory } from "react-router-dom";
import config from '../../config'
import Home from "./Home";

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
                        <Home username={username} setUsername={setUsername} 
                        password={password} setPassword={setPassword} login={login} />
                    )

            }
        </div >
    )
}

export default HomePage