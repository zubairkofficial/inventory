import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Input from "../../Components/Input";
import Helpers from "../../Config/Helpers";
import Button from "../../Components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddOil = forwardRef(({ getOils }, ref) => {
    let navigate = useNavigate();
    let oilInit = {
        name:"",
        brand: "",
        type: "",
        quantity: "",
        pricePerQuartz: "",
        pricePerVehicle: "",
        user_id:Helpers.authParentId,
      };
    const [oil, setOil] = useState(oilInit);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let [selectedCustomer, setSelectedCustomer] = useState();
    let [customerOptions, setCustomersOptions] = useState([]);
  const [oilType, setOilType] = useState({});


    let oilTypeOption = [{label: 'Conventional Oil', value:'Conventional Oil'}, {label: 'Senthetic Oil', value:'Senthetic Oil'}];

    const handleSaveOil = (e) => {
        e.preventDefault();
        setErrors({});
        const addOrUpdate = isEditing ? "update" : "add";
        axios
          .post(`${Helpers.baseUrl}oils/${addOrUpdate}`, oil, Helpers.headers)
          .then((response) => {
            getOils();
            setOil(oilInit);
            setOilType([]);
            setIsEditing(false);
            Helpers.toast("success", "Oil saved successfully");
          })
          .catch((error) => {
            setErrors(Helpers.error_response(error));
          });
      };
      useImperativeHandle(ref, () => ({
        handleEdit(oilToEdit){
            setIsEditing(true);
            setOil(oilToEdit);
        }
    }));
      const handleSelectType = selectedType => {
        setOilType(selectedType);
        setOil({...oil, type: selectedType.value})
      }
      const cancelSaving = () => {
        setIsEditing(false);
        setOil(oilInit);
    }
    return (
    
          <div className="card">
            <div className="card-header">
              <h5>
                {isEditing
                  ? `Updating "${oil.name}"`
                  : "Add New Oil"}
              </h5>
            </div>
            <div className="card-body border-bottom">
              <form>
                <div className="form-group mb-3">
                     <Input label={"Oil Name"} value={oil.name} error={errors.name} onChange={e => {
                    setOil({ ...oil, name: e.target.value })
                }} />
                </div>
                <div className="form-group mb-3">
                     <Input label={"Brand"} value={oil.brand} error={errors.brand} onChange={e => {
                    setOil({ ...oil, brand: e.target.value })
                }} />
                </div>
                <div className="form-group mb-3">
                  <label>Type</label>
                  
                  <Select options={oilTypeOption} value={oilType} isClearable="true" onChange={handleSelectType} />
                  <small className="text-danger">
                    {errors.type ? errors.type : ""}
                  </small>
                </div>
                <div className="form-group mb-3">
                     <Input label={"Quantity (Quartz)"} value={oil.quantity} error={errors.quantity} onChange={e => {
                    setOil({ ...oil, quantity: e.target.value })
                }} />
                </div>
                <div className="form-group mb-3">
                     <Input label={"Price Per Quartz ($)"} value={oil.pricePerQuartz} error={errors.pricePerQuartz} onChange={e => {
                    setOil({ ...oil, pricePerQuartz: e.target.value })
                }} />
                </div>
                  <div className="form-group mb-3">
                     <Input label={"Price Per Vehicle ($)"} value={oil.pricePerVehicle} error={errors.pricePerVehicle} onChange={e => {
                    setOil({ ...oil, pricePerVehicle: e.target.value })
                }} />
                </div>
                <div className="row">
                    <div className="col-6">
                        <Button text={"Save Oil"} color={"success"} onClick={handleSaveOil} fullWidth={true} isLoading={isLoading} />
                    </div>
                    {isEditing && <div className="col-6">
                        <Button text={"Cancel"} color={"danger"} onClick={cancelSaving} fullWidth={true} />
                    </div>}
                </div>
              </form>
            </div>
          </div> 

    );
})

export default AddOil;