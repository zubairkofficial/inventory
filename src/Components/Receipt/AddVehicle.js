import { useState, useReducer } from "react";
import Helpers from "../../Config/Helpers";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import { customerReducer } from "../../Reducers/CustomerReducer";
import axios from "axios";
import $ from 'jquery'

const AddVehicleReceipt = ({ showModal = false, modalState, customer, handleVehicleChange, setVehiclesOptions }) => {
    let vehicleInit = {
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
    const [isLoading, setIsLoading] = useState(false);

    const [reucerCustomer, dispatch] = useReducer(customerReducer, vehicleInit);

    const handleSaveVehicle = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const addOrUpdate = "add";
        vehicle.customer = customer.value;
        axios.post(`${Helpers.baseUrl}vehicles/${addOrUpdate}`, vehicle, Helpers.headers).then((response) => {
            console.log("Added Vehilce", response.data);
            const selectedVehicle = {
                label: response.data.name + " " + response.data.model + "",
                value: response.data,
            };
            handleVehicleChange(selectedVehicle);
            setVehicle(vehicleInit);
            dispatch({ type: 'getCustomerVehicles', states: { setVehiclesOptions }, data: { customerId: response.data.customer._id } })
            modalState(false);
            $('.modal-backdrop').hide();
            Helpers.toast("success", "Vehicle saved successfully");
            setIsLoading(false);
        }).catch((error) => {
            setErrors(Helpers.error_response(error));
            setIsLoading(false);
        });
    };
    return (
        <Modal show={showModal} showModalState={modalState} modalId={"addVehicleModal"} modalTitle={`Add New Vehicle for ${customer && customer.value.name}`} >
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
            <Button text={"Save"} isLoading={isLoading} color={"success"} onClick={handleSaveVehicle} fullWidth={true} />
        </Modal>
    )
}

export default AddVehicleReceipt;