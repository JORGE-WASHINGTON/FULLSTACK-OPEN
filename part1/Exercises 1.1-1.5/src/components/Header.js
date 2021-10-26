const Header = ({ course }) => {
    console.log(course)
    return (
        <header>
            <h1>{course.name}</h1>
        </header>
    )
}

export default Header
