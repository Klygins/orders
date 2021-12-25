import react from "react";
import { useSelector } from 'react-redux';

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