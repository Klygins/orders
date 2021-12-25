import React from 'react'

class BoosterTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 }
    }
    //props.timeLeft is time in sec
    componentDidMount() {
        if (this.props.isOrderOverdue) {
            let interval = setInterval(() => {
                this.setState({ count: this.state.count - 1 })
            }, 1000)
        } else {
            let interval = setInterval(() => {
                this.setState({ count: this.state.count + 1 })
            }, 1000)
        }
    }
    render() {
        let timeLeft = this.props.timeLeft - this.state.count
        let timer = <span>
            {Math.trunc(timeLeft / 3600)}:
            {Math.trunc(timeLeft / 60) % 60}:
            {Math.trunc(timeLeft % 60)}
        </span>
        return (<span>{timer}</span>)
    }
}


export default BoosterTimer