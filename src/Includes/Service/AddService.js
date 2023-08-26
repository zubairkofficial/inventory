import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Input from "../../Components/Input";
import Helpers from "../../Config/Helpers";
import Button from "../../Components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SelectInput from "../../Components/SelectInput";

const options =  [
  {label:"Choose Tax Option", value:'', is_disabled: true},
  {label:"Taxable", value:'Taxable', is_disabled: false},
  {label:"Non Taxable", value:'Non Taxable', is_disabled: false},
];
const AddService = forwardRef(({ getServices, setShowForm }, ref) => {
    let navigate = useNavigate();
    let serviceInit = {
        date: Helpers.currentDate(),
        service_name: "",
        description: "",
        price: "",
        tax:"",
        user_id:Helpers.authParentId,
    };
    const [service, setService] = useState(serviceInit);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let [selectedCustomer, setSelectedCustomer] = useState();

    const handleSaveService = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const addOrUpdate = isEditing ? "update" : "add";
        axios
          .post(
            `${Helpers.baseUrl}services/${addOrUpdate}`,
            service,
            Helpers.headers
          )
          .then((response) => {
            getServices();
            setService(serviceInit);
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
        handleEdit(serviceToEdit){
            setIsEditing(true);
            setService(serviceToEdit);
        }
    }));

    const cancelSaving = e => {
      e.preventDefault();
      if(setShowForm){
        setShowForm(false);
      }
        setIsEditing(false);
        setSelectedCustomer({});
        setService(serviceInit);
    }

    return (
        <div className="card">
        <div className="card-header">
          <h5>
            {isEditing
              ? `Updating "${service.service_name}"`
              : "Add New Service"}
          </h5>
        </div>
        <div className="card-body border-bottom">
          <form>
            <div className="form-group mb-2">
              <Input label={"Service Name"} value={service.service_name}  error={errors.service_name} onChange={e => {
                    setService({ ...service, service_name: e.target.value })
                }} />
            </div>
            <div className="form-group mb-2">
           
               <Input label={"Service Description"} value={service.description}  error={errors.description} onChange={e => {
                    setService({ ...service, description: e.target.value })
                }} />
            </div>
            <div className="form-group mb-2">
              <Input label={"Price"} value={service.price}  error={errors.price} onChange={e => {
                    setService({ ...service, price: e.target.value })
                }} />
            </div>
            <div className="form-group mb-2">
                     <SelectInput label={"Tax Status"} value={service.tax} placeholder={"Choose Tax Option"} error={errors.tax} options={options} onChange={e => {
                    setService({ ...service, tax: e.target.value });
                }} />
              </div>
              <div className="row">
                  <div className="col-6">
                      <Button text={"Save Service"} color={"success"} onClick={handleSaveService} fullWidth={true} isLoading={isLoading} />
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

export default AddService;