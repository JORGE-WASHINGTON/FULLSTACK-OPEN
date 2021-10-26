import Part from "./Part"

const Content = ({ parts }) => {
    return (
        <>
            <Part content={parts[0].name} exercise={parts[0].exercises} />
            <Part content={parts[1].name} exercise={parts[1].exercises} />
            <Part content={parts[2].name} exercise={parts[2].exercises} />
        </>
    )
}

export default Content
