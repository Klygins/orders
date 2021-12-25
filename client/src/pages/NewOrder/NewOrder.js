import react from "react";
import Alert from '../../Components/Alert'
import { Button, Grid, Input } from 'semantic-ui-react'

const NewOrder = ({ createOrder, mmrFrom, setmmrFrom, mmrTo, setmmrTo,
    payment, setpayment, tokens, settokens, trophyLvl, settrophyLvl }) => {
    return (
        <div style={{ marginLeft: '20%', width: '60%' }}>
            <Alert />
            <h3 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '30px' }}>
                Create new order
            </h3>
            <Grid columns={3} divided>

                <Grid.Row>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='From' value={mmrFrom} onChange={(e) => setmmrFrom(e.target.value)} />
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='to' value={mmrTo} onChange={(e) => setmmrTo(e.target.value)} />
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='payment' value={payment} onChange={(e) => setpayment(e.target.value)} />
                        </div>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='tokens' value={tokens} onChange={(e) => settokens(e.target.value)} />
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div style={{ textAlign: 'center' }}>
                            <Input placeholder='account lvl' value={trophyLvl} onChange={(e) => settrophyLvl(e.target.value)} />
                        </div>
                    </Grid.Column>
                </Grid.Row>

            </Grid>
            <div style={{ textAlign: 'center', marginTop: "40px" }}>
                <Button positive onClick={createOrder}>Create</Button>
            </div>
        </div>
    )
}

export default NewOrder