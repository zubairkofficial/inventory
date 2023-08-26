import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Input from "../../Components/Input";
import Helpers from "../../Config/Helpers";
import Button from "../../Components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SelectInput from "../../Components/SelectInput";

// const options =  ['New', 'Used'];
const options =  [
  {label:"Choose Tire Condition", value:'', is_disabled: true},
  {label:"New", value:'New', is_disabled: false},
  {label:"Used", value:'Used', is_disabled: false},
];
const AddTire = forwardRef(({ getTires, setShowForm }, ref) => {
    let navigate = useNavigate();
    let tireInit = {
        date: Helpers.currentDate(),
        brand_name: "",
        size: "",
        quantity: "",
        price: "",
        quality: "",
        user_id:Helpers.authParentId,
    };
    const [tire, setTire] = useState(tireInit);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let [selectedCustomer, setSelectedCustomer] = useState();

    const handleSaveTire = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const addOrUpdate = isEditing ? "update" : "add";
        axios
          .post(
            `${Helpers.baseUrl}tires/${addOrUpdate}`,
            tire,
            Helpers.headers
          )
          .then((response) => {
            getTires();
            setTire(tireInit);
            setSelectedCustomer('');
            setIsEditing(false);
            Helpers.toast("success", "Service saved successfully");
            setIsLoading(false);
            setShowForm(false);
          })
          .catch((error) => {
            setErrors(Helpers.error_response(error));
            setIsLoading(false);
          });
      };
 
    useImperativeHandle(ref, () => ({
        handleEdit(tireToEdit){
            setIsEditing(true);
            setTire(tireToEdit);
        }
    }));

    const cancelSaving = e => {
      e.preventDefault();
        if(setShowForm){
          setShowForm();
        }
        setIsEditing(false);
        setSelectedCustomer({});
        setTire(tireInit);
    }

    return (
      <div className="card">
        <div className="card-header">
          <h5>
            {isEditing
              ? `Updating "${tire.brand}"`
              : "Add New Tire"}
          </h5>
        </div>
        <div className="card-body border-bottom">
          <form>
            <div className="form-group mb-3">
              <Input label={"Brand Name"} value={tire.brand} placeholder={"Brand Name"} error={errors.brand} onChange={e => {
                    setTire({ ...tire, brand: e.target.value })
                }} />
            </div>
            <div className="form-group mb-3">
           
               <Input label={"Size"} value={tire.size} placeholder={"Size"} error={errors.size} onChange={e => {
                    setTire({ ...tire, size: e.target.value })
                }} />
            </div>
            <div className="form-group mb-3">
              <Input label={"Quantity"} value={tire.quantity} placeholder={"Quantity"} error={errors.quantity} onChange={e => {
                    setTire({ ...tire, quantity: e.target.value })
                }} />
            </div>
            <div className="form-group mb-3">
              <Input label={"Price"} value={tire.price} placeholder={"Price"} error={errors.price} onChange={e => {
                    setTire({ ...tire, price: e.target.value })
                }} />
            </div>
            <div className="form-group mb-3">
                     <SelectInput label={"Tire Condition"} value={tire.quality} error={errors.quality} options={options} onChange={e => {
                    setTire({ ...tire, quality: e.target.value });
                }} />
              </div>
              <div className="row">
                    <div className="col-6">
                        <Button text={"Save Tire"} color={"success"} onClick={handleSaveTire} fullWidth={true} isLoading={isLoading} />
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

export default AddTire;