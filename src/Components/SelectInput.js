export default function SelectInput({ label, value, onChange, placeholder, options, error }){
    return (
        <div className="form-group mb-3">
            <label>{label}</label>
            <select
                className="form-control"
                onChange={onChange}
                value={value}
            >
                <option value={""} disabled>{placeholder}</option>
                {options.map((option) => {
                    return <option key={option} value={option}>{option}</option>;
                })}
            </select>
            <small className="text-danger">
                {error ? error : ""}
            </small>
        </div>
    )
}