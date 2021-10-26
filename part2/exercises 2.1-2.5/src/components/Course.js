import Content from "./Content"

const Course = (props) => {
    const { courses } = props
    console.log(courses)
    return (
        <div>
            {courses.map(course =>
                <Content key={course.id} course={course} />
            )}
        </div>

    )
}

export default Course
