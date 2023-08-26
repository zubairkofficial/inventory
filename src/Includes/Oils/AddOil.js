import { useState, forwardRef, useImperativeHandle } from "react";
import Input from "../../Components/Input";
import Helpers from "../../Config/Helpers";
import Button from "../../Components/Button";
import axios from "axios";
import SelectInput from "../../Components/SelectInput";

const AddOil = forwardRef(({ getOils, setShowForm }, ref) => {
    let oilInit = {
        date: Helpers.currentDate(),
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
    const oilTypeOption =  [
      {label:"Choose Oil Type", value:'', is_disabled: true},
      {label:"Conventional Oil", value:'Conventional Oil', is_disabled: false},
      {label:"Senthetic Oil", value:'Senthetic Oil', is_disabled: false},
    ];

    const handleSaveOil = (e) => {
          e.preventDefault();
          setIsLoading(true);
          setErrors({});
          const addOrUpdate = isEditing ? "update" : "add";
          axios.post(`${Helpers.baseUrl}oils/${addOrUpdate}`, oil, Helpers.headers).then((response) => {
              getOils();
              setOil(oilInit);
              setIsEditing(false);
              setIsLoading(false);
              Helpers.toast("success", "Oil saved successfully");
              setShowForm(false);
          }).catch((error) => {
              setErrors(Helpers.error_response(error));
              setIsLoading(false);
          });
      };
      useImperativeHandle(ref, () => ({
        handleEdit(oilToEdit){
            setIsEditing(true);
            setOil(oilToEdit);
        }
    }));
      const cancelSaving = e => {
        e.preventDefault();
        setShowForm(false);
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
                  <Input label={"Oil Name"} value={oil.name} placeholder={"Oil Name"} error={errors.name} onChange={e => {
                    setOil({ ...oil, name: e.target.value })
                  }} />
                  <Input label={"Brand"} value={oil.brand} placeholder={"Brand Name"} error={errors.brand} onChange={e => {
                    setOil({ ...oil, brand: e.target.value })
                  }} />
                  <SelectInput label={"Oil Type"} options={oilTypeOption} onChange={e => {
                    setOil({ ...oil, type: e.target.value })
                  }} value={oil.type} error={errors.type} />
                  <Input label={"Quantity (Quartz)"} value={oil.quantity} placeholder={"Quantity (Quartz)"} error={errors.quantity} onChange={e => {
                    setOil({ ...oil, quantity: e.target.value })
                  }} />
                  <Input label={"Price Per Quartz ($)"} placeholder={"Price Per Quartz ($)"} value={oil.pricePerQuartz} error={errors.pricePerQuartz} onChange={e => {
                    setOil({ ...oil, pricePerQuartz: e.target.value })
                  }} />
                  <Input label={"Price Per Vehicle ($)"} placeholder={"Price Per Quartz ($)"} value={oil.pricePerVehicle} error={errors.pricePerVehicle} onChange={e => {
                    setOil({ ...oil, pricePerVehicle: e.target.value })
                  }} />
                  <div className="row">
                      <div className="col-6">
                          <Button text={"Save Oil"} color={"success"} onClick={handleSaveOil} fullWidth={true} isLoading={isLoading} />
                      </div>
                      {<div className="col-6">
                          <Button text={"Cancel"} color={"danger"} onClick={cancelSaving} fullWidth={true} />
                      </div>}
                  </div>
              </form>
            </div>
          </div> 

    );
})

export default AddOil;