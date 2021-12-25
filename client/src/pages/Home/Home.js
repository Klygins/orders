import react from "react"
import { Button, Divider, Header, Input } from "semantic-ui-react";
import config from '../../config'

const Home = ({username, setUsername, password, setPassword, login}) => {
    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <Divider hidden />
                <Header>Rules</Header>
                <div style={{ width: '50%', marginLeft: '25%' }}>Deadline is 150 mmr per day, once you log in account
                 turn on invisible mode and only then open dota, after that you should send start screen(mmr).
                </div>
                <div style={{ width: '50%', marginLeft: '25%' }}>
                    Every 150 mmr screenshot with mmr must be sent, when you want to billout write me in discord:
                     <strong>{config.myDiscord}</strong></div>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <Input placeholder='username' id='username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <Divider hidden />
                <Input placeholder='password' type='password' id='password' value={password} 
                onChange={(e) => setPassword(e.target.value)} />
                <Divider hidden />
                <Button positive onClick={login} content={'Log in'} />
            </div>
        </div>
    )
}

export default Home