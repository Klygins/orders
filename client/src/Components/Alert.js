import { useSelector } from "react-redux";
import { Transition } from 'semantic-ui-react'

const AlertToReturn = () => {
    const alert = useSelector(state => state.alert.alert)

    const renderAlert = () => {
        if (alert.isAlertColorBlue) {
            return (
                <Transition visible={alert.alertVisiable} animation='fade' duration={alert.alertVisiable ? 500 : 1000}>
                    <div>
                        <div className='message' id='message-blue'>
                            {alert.alertMessage}
                        </div>
                    </div>
                </Transition>
            )
        } else {
            return (
                <Transition visible={alert.alertVisiable} animation='fade' duration={alert.alertVisiable ? 500 : 1000}>
                    <div>
                        <div className='message' id='message-red'>
                            {alert.alertMessage}
                        </div>
                    </div>
                </Transition>
            )
        }

    }

    return (
        renderAlert()
    )
}

export default AlertToReturn