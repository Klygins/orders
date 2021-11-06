import { Link } from "react-router-dom"
import { Button } from 'semantic-ui-react'

const SwitchButtons = (props) => {
    switch (props.role) {
        case 0:
            console.log(props.role, 'qwe');
            return (
                <div style={{ marginLeft: '70px', width: '100%' }}>
                    <Button.Group >
                        <Link to='/'>
                            <div style={{ marginTop: '16px' }}>
                                <Button inverted color='black'>
                                    Home
                                </Button>
                            </div>
                        </Link>
                    </Button.Group>
                </div>
            )
        case 1:
            return (
                <div style={{ marginLeft: '70px', width: '100%' }}>
                    <Button.Group >
                        <Link to='/'>
                            <div style={{ marginTop: '16px' }}>
                                <Button inverted color='black'>
                                    Home
                                </Button>
                            </div>
                        </Link>
                        <Link to='/orders'>
                            <div style={{ marginLeft: '20px', marginTop: '16px' }}>
                                <Button inverted color='black'>Orders</Button>
                            </div>
                        </Link>
                        <Link to='/personal-space'>
                            <div style={{ marginLeft: '20px', marginTop: '16px' }}>
                                <Button inverted color='black'>
                                    Personal Space
                                </Button>
                            </div>
                        </Link>
                    </Button.Group>
                </div>
            )
        case 2:
            return (
                <div style={{ marginLeft: '70px', width: '100%' }}>
                    <Button.Group >
                        <Link to='/'>
                            <div style={{ marginTop: '16px' }}>
                                <Button inverted color='black'>
                                    Home
                                </Button>
                            </div>
                        </Link>
                        <Link to='/new-order'>
                            <div style={{ marginLeft: '20px', marginTop: '16px' }}>
                                <Button inverted color='black'>
                                    Create Order
                                </Button>
                            </div>
                        </Link>
                        <Link to='/personal-space'>
                            <div style={{ marginLeft: '20px', marginTop: '16px' }}>
                                <Button inverted color='black'>
                                    Personal Space
                                </Button>
                            </div>
                        </Link>
                    </Button.Group>
                </div>
            )
        default:
            return (
                <div>net</div>
            )
    }
}

const Header = (props) => {
    const role = props.role
    return (
        <div className='top-bar'>
            <SwitchButtons role={role} />
            <div style={{ position: 'absolute', right: '2vw', fontSize: '2.5em', color: '#6386FF', textAlign: 'right', top: '35%' }}>
            </div>
        </div>
    )
}

export default Header