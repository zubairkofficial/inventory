export default function TextInput({ label, value, onChange, placeholder, error, type = "text" }){
    return (
        <div className="mb-3">
            {label && <label htmlFor={label} className="form-label">{label}</label>}
            <textarea
                type={type}
                className="form-control"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            ></textarea>
            <small className="text-danger">{ error ? error : '' }</small>
        </div>
    )
}