import Part from './Part'

const Content = (props) => {
    const { course } = props
    console.log(course)


    const total = course.parts.reduce((s, p) => {
        return s + p.exercises
    }, 0);
    console.log(total)

    return (
        <>
            <h2>{course.name}</h2>
            <ul>
                {course.parts.map(part =>
                    <Part key={part.id} part={part} />
                )}
            </ul>
            <p style={{ fontWeight: 'bold' }}> Total number of Exercises: {total}</p>
        </>

    )
}

export default Content
