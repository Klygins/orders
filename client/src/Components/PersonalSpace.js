import React, { useState, useEffect } from "react";
import { Button, Divider, Grid, Header, Input, Segment } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux';

import Alert from './Alert'
import { setOrders } from '../slices/orderSlice'
import { setAlert } from '../slices/alertSlice'
import * as api from '../api/index'
import config from "../config";
import { useHistory } from "react-router-dom";

import BoosterPS from './BoosterPS'
import OGPS from './OGPS'


const PersonalSpace = () => {

    const role = useSelector(state => state.role.role)

    return (
        <div>
            {
                role == 1
                    ? <BoosterPS />
                    : <OGPS />
            }
        </div>
    )
}

export default PersonalSpace