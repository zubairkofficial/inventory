export default function Input({ label, value, onChange, placeholder, error, type = "text", readOnly = false }){
    return (
        <div className="mb-2">
            {label && <label htmlFor={label} className="form-label">{label}</label>}
            <input
                type={type}
                className="form-control"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={readOnly}
            />
            <small className="text-danger">{ error ? error : '' }</small>
        </div>
    )
}