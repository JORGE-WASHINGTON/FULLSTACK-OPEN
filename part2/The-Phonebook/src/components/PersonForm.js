const PersonForm = ({ onSubmit, onNameChange, onNumberChange, nameValue, numberValue }) => {
    return (

        <form onSubmit={onSubmit}>
            <div>
                <label>
                    Name:
          <input name='name' value={nameValue} onChange={onNameChange} />
                </label>
            </div>
            <div>
                <label>
                    Number:
          <input name='number' type='number' value={numberValue} onChange={onNumberChange} />
                </label>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>

    )
}

export default PersonForm
