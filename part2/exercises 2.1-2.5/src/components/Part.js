const Parts = (props) => {
    const { part } = props
    console.log(part)
    return (
        <li key={part.id}>{part.name} {part.exercises}</li>

    )
}

export default Parts
