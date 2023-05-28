import Select from "react-select";

const AddSelectInput = ({ label, options, selected, onChange, onInputChange, error, targetModal, onBtnClick, isMulti = false, hasBtn = true }) => {
    const handleButtonClick = e => {
        e.preventDefault();
        onBtnClick();
    }
    return (
        <div className="row">
            <div className="col-11">
                <div className="form-group mb-3">
                <label>{label}</label>
                <Select
                    isMulti={isMulti}
                    options={options}
                    isClearable="true"
                    value={selected}
                    onChange={onChange}
                    onInputChange={onInputChange}
                />
                <small className="text-danger">
                    {error? error: ""}
                </small>
                </div>
            </div>
            {
                hasBtn === true ? (
                    <div className="col-1">
                        <button
                            className="btn btn-light add-client-btn"
                            // data-bs-toggle="modal"
                            // data-bs-target={`#${targetModal}`}
                            onClick={handleButtonClick}
                            style={{ marginTop: 26 }}
                        >
                            <span className="la la-plus"></span>
                        </button>
                    </div> 
                ) : ("")
            }
        </div>
    );
}

export default AddSelectInput;