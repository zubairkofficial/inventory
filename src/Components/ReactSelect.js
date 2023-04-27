import Select from "react-select";

export default function ReactSelect({ label, options, value, error, onChange }){
    return (
        <div className="form-group mb-3">
            <label>{ label }</label>
            <Select
                options={options}
                isClearable="true"
                value={value}
                onChange={onChange}
            />
            <small className="text-danger">
                {error ? error : ""}
            </small>
        </div>
    );
}