const StatisticLine = ({ text, count }) => {

    return (
        <table style={{ tableLayout: 'fixed', width: '100%' }}>
            <tbody>
                <tr>
                    <td style={{ width: '7%' }}>{text}</td>
                    <td>{count}</td>
                </tr>
            </tbody>
        </table>


    )
}

export default StatisticLine