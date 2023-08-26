export default function SelectInput({ label, value, onChange, options, error }){
    return (
        <div className="form-group mb-2">
            <label>{label}</label>
            <select
                className="form-control"
                onChange={onChange}
                value={value}
            >
                {options.map((option, index) => {
                    return <option key={index} value={option.value} disabled={option.is_disabled}>{option.label}</option>;
                })}
            </select>
            <small className="text-danger">
                {error ? error : ""}
            </small>
        </div>
    )
}