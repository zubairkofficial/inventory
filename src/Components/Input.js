export default function Input({ label, value, onChange, placeholder, error, type = "text" }){
    return (
        <div className="mb-3">
            <label htmlFor={label} className="form-label">{label}</label>
            <input
                type={type}
                className="form-control"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            <small className="text-danger">{ error ? error : '' }</small>
        </div>
    )
}