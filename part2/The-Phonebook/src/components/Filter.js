const Filter = ({ onChange }) => {
  return (
    <div>
      <label>Filter shown with:
          <input name='Filter shown with' onChange={onChange} />
      </label>
    </div>
  )
}

export default Filter
