import react from "react"
import { Link } from "react-router-dom"
import { Button } from 'semantic-ui-react'
import { useHistory } from "react-router-dom";

import config from "../config"

const HomeButton = () =>
    <Link to={config.pages.home} >
        <div style={{ marginTop: '16px' }}>
            <Button inverted color='black'>
                Home
            </Button>
        </div>
    </Link>

const OrdersButton = () =>
    <Link to={config.pages.orders}>
        <div style={{ marginLeft: '20px', marginTop: '16px' }}>
            <Button inverted color='black'>
                Orders
            </Button>
        </div>
    </Link>

const CreateNewOrderButton = () =>
    <Link to={config.pages.newOrder} >
        <div style={{ marginLeft: '20px', marginTop: '16px' }}>
            <Button inverted color='black'>
                Create Order
            </Button>
        </div>
    </Link>

const PersonalSpace = () =>
    <Link to={config.pages.personalSpace} >
        <div style={{ marginLeft: '20px', marginTop: '16px' }}>
            <Button inverted color='black'>
                Personal Space
            </Button>
        </div>
    </Link>

const LogoutButton = (logout) =>
    <div style={{ marginLeft: '20px', marginTop: '16px' }}>
        <Button inverted color='black'
            onClick={logout} >
            Logout
        </Button>
    </div>

const SwitchButtons = ({ role, logout }) => {
    switch (role) {
        case 0:
            return (
                <div style={{ marginLeft: '70px', width: '100%' }}>
                    <Button.Group >
                        {HomeButton()}
                    </Button.Group>
                </div>
            )
        case 1:
            return (
                <div style={{ marginLeft: '70px', width: '100%' }}>
                    <Button.Group >
                        {HomeButton()}
                        {OrdersButton()}
                        {PersonalSpace()}
                        {LogoutButton(logout)}
                    </Button.Group>
                </div>
            )
        case 2:
            return (
                <div className="header-div" >
                    <Button.Group >
                        {HomeButton()}
                        {CreateNewOrderButton()}
                        {PersonalSpace()}
                        {LogoutButton(logout)}
                    </Button.Group>
                </div>
            )
        default:
            return (
                <div>net</div>
            )
    }
}

const Header = ({ role }) => {
    let history = useHistory();

    const logout = () => {
        localStorage.removeItem("token");
        history.push(config.pages.home)
        history.go(config.pages.home)
    }

    return (
        <div className='top-bar'>
            <SwitchButtons role={role} logout={logout} />
            <div style={{ position: 'absolute', right: '2vw', fontSize: '2.5em', color: '#6386FF', textAlign: 'right', top: '35%' }}>
            </div>
        </div>
    )
}

export default Header