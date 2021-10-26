const Notifications = ({ message }) => {
    if (message === null) {
        return null
    }
    else if (message.includes('server')) {
        return (
            <div className='error'>
                {message}
            </div>
        )
    }
    return (
        <div className='sucess'>
            {message}
        </div>
    )
}

export default Notifications
