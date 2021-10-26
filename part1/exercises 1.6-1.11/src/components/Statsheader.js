import StatisticLine from './StatisticLine'

const Statsheader = ({ all, good, neutral, bad, average, percentage }) => {
    if (all === 0) {
        return (
            <div>
                <h2>Statistics</h2>
                <p>No feedBack given</p>
            </div>
        )
    }

    return (
        <div>
            <h2>Statistics</h2>
            <StatisticLine text='good' count={good} />
            <StatisticLine text='neutral' count={neutral} />
            <StatisticLine text='bad' count={bad} />
            <StatisticLine text='all' count={good + bad + neutral} />
            <StatisticLine text='average' count={average} />
            <StatisticLine text='positive' count={`${percentage}%`} />
        </div>
    )
}

export default Statsheader
