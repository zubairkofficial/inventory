import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Input from "../../Components/Input";
import Helpers from "../../Config/Helpers";
import Button from "../../Components/Button";
import axios from "axios";
import ReactSelect from "../../Components/ReactSelect";

const AddVehicle = forwardRef(({ getVehicles, setShowForm }, ref) => {

    let vehicleInit = {
        date: Helpers.currentDate(),
        company: "",
        name: "",
        model: "",
        customer: '',
        vin_number:'',
        year:'',
        user_id:Helpers.authParentId,
    };
    const [vehicle, setVehicle] = useState(vehicleInit);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let [selectedCustomer, setSelectedCustomer] = useState();
    let [customerOptions, setCustomersOptions] = useState([]);

    const handleSaveVehicle = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const addOrUpdate = isEditing ? "update" : "add";
        axios.post(`${Helpers.baseUrl}vehicles/${addOrUpdate}`, vehicle, Helpers.headers).then((response) => {
            getVehicles();
            setVehicle(vehicleInit);
            setSelectedCustomer('');
            setIsEditing(false);
            Helpers.toast("success", "Vehicle saved successfully");
            setIsLoading(false);
            setShowForm(false);
        }).catch((error) => {
            setErrors(Helpers.error_response(error));
            setIsLoading(false);
        });
    };

      const getCustomers = () => {
        axios
          .get(`${Helpers.baseUrl}customers/all/${Helpers.authParentId}`, Helpers.headers)
          .then((response) => {
            let customerArray = [];
            for (let index = 0; index < response.data.length; index++) {
              const object = {
                label: response.data[index].name +" ("+ response.data[index].phone +")",
                value: response.data[index],
              };
              customerArray.push(object);
            }
            setCustomersOptions(customerArray);
          });
      };
      
    useImperativeHandle(ref, () => ({
        handleEdit(vehicleToEdit){
            setIsEditing(true);
            setSelectedCustomer({
                label: vehicleToEdit.customer.name,
                value: vehicleToEdit.customer,
            });
            setVehicle(vehicleToEdit);
        }
    }));

    const cancelSaving = e => {
        e.preventDefault();
        if(setShowForm){
            setShowForm(false);
        }
        setIsEditing(false);
        setSelectedCustomer({});
        setVehicle(vehicleInit);
    }

    const handleSelectCustomer = (selectedCustomer) =>{
        setSelectedCustomer(selectedCustomer);
        setVehicle({...vehicle, customer:selectedCustomer.value});
    };

    useEffect(() => {
        getCustomers();
    }, []);

    return (
        <div className="card">
            <div className="card-header">
                <h5>
                    {isEditing
                    ? `Updating "${vehicle.name}-${vehicle.model}"`
                    : "Add New Vehicle"}
                </h5>
            </div>
            <div className="card-body border-bottom">
                <ReactSelect label={"Select Customer"} error={errors.customer} options={customerOptions} value={selectedCustomer} onChange={handleSelectCustomer} />
                <Input label={"VIN Number"} value={vehicle.vin_number} placeholder={"VIN Number"} error={errors.vin_number} onChange={e => {
                    setVehicle({ ...vehicle, vin_number: e.target.value })
                }} />
                <Input label={"Year"} value={vehicle.year} placeholder={"Year"} error={errors.year} onChange={e => {
                    setVehicle({ ...vehicle, year: e.target.value })
                }} />
                <Input label={"Make"} value={vehicle.name} placeholder={"Make"} error={errors.name} onChange={e => {
                    setVehicle({ ...vehicle, name: e.target.value })
                }} />
                <Input label={"Model"} value={vehicle.model} placeholder={"Model"} error={errors.model} onChange={e => {
                    setVehicle({ ...vehicle, model: e.target.value })
                }} />
                <div className="row">
                    <div className="col-6">
                        <Button text={"Save Vehicle"} color={"success"} onClick={handleSaveVehicle} fullWidth={true} isLoading={isLoading} />
                    </div>
                    {<div className="col-6">
                        <Button text={"Cancel"} color={"danger"} onClick={cancelSaving} fullWidth={true} />
                    </div>}
                </div>
            </div>
        </div>
    );
})

export default AddVehicle;