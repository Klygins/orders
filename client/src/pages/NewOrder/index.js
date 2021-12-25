import React, { useState } from "react";
import { useDispatch } from "react-redux";

import NewOrderComponent from './NewOrder'
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
            payment
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
        <NewOrderComponent createOrder={createOrder} mmrFrom={mmrFrom} setmmrFrom={setmmrFrom}
        mmrTo={mmrTo} setmmrTo={setmmrTo} payment={payment} setpayment={setpayment} tokens={tokens}
        settokens={settokens} trophyLvl={trophyLvl} settrophyLvl={settrophyLvl} />
    )
}

export default NewOrder