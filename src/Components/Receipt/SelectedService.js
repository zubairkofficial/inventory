import { useEffect, useState,  useReducer } from "react";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import $ from 'jquery'
import AddSelectInput from "./AddSelectInput";
import { customerReducer } from "../../Reducers/CustomerReducer";
import Helpers from "../../Config/Helpers";

const SelectedService = ({ lastService, modalState, showModal, setSelectedServices, selectedServices, setLastSelectedService, calculateTotalServices, handleClose }) => {
    const [service, setService] = useState({});
    const [tireOptions, setTireOptions] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([])
    
  const [receiptRed, dispatch] = useReducer(customerReducer);
    // Errors
  const [errors, setErrors] = useState({});

    //Technician
    let [technicianOptions, setTechnicianOptions] = useState();
    let [selectedTechnician, setSelectedTechnician] = useState([]);
    const handleQty = e => {
        let inputValue = e.target.value;
        if(!isNaN(inputValue)){
            setService({...service, quantity: parseInt(inputValue), total_price: inputValue * service.price})
        }
    }
    
    const handleTechnicianChange = (e) => {
        setSelectedTechnician(e)
        let inputValue = e.label;
        if(inputValue){
            setService({...service, technicianName: inputValue})
        }
      };

    const handlePrice = e => {
        let inputValue = e.target.value;
        if(!isNaN(inputValue)){
            setService({...service, price: inputValue, total_price: service.quantity * inputValue})
        }
    }
    const handelSaveService = e => {
        e.preventDefault();
        if(service.technicianName){
            console.log("Service Options ",serviceOptions)
            console.log("Tire Options ",tireOptions)
            console.log("Current Service ",service)
            const serviceOption = serviceOptions.find((opt) => opt.value._id === service._id);
            const tireOption = tireOptions.find((opt) => opt.value._id === service._id);
            let stock;
            let quantity;
            if(tireOption){
                stock = tireOption.value.stock;
                quantity = service.quantity;
            }
            if(serviceOption){
                if(serviceOption.value.stock){
                    stock = serviceOption.value.stock;
                    quantity = service.quantity;
                }
            }
            if(stock){
                if(stock >= quantity){
                let total = (Math.round(service.price * 100)/100) * service.quantity ;
                setService({...service, total_price: total.toFixed(2)});
                selectedServices[selectedServices.length - 1].value = service;
                selectedServices[selectedServices.length - 1].label = `${service.name} ($${service.price})`;
                setLastSelectedService(null);
                setSelectedServices(selectedServices);
                calculateTotalServices();
                setService({});
                modalState(false);
                $('.modal-backdrop').hide();
            }else{
                Helpers.toast(
                    "error",
                    "This much quantity is not available"
                    )
                    return;
                }
            }else{
                let total = (Math.round(service.price * 100)/100) * service.quantity ;
                setService({...service, total_price: total.toFixed(2)});
                selectedServices[selectedServices.length - 1].value = service;
                selectedServices[selectedServices.length - 1].label = `${service.name} ($${service.price})`;
                setLastSelectedService(null);
                setSelectedServices(selectedServices);
                calculateTotalServices();
                setService({});
                modalState(false);
                $('.modal-backdrop').hide();
            }
                
        }else{
            setErrors({
                technicianName: "Please select the technician"
            })
        }
    }
    
    useEffect(() => {
        if(lastService){
            setService({ ...lastService.value, quantity: 1 });
        }
        
    dispatch({ type: "getTechnicians", states: { setTechnicianOptions } });
    dispatch({ type: "getTires", states: { setTireOptions } });
    dispatch({ type: "getAllServices", states: { setServiceOptions } });
    }, []);
    return (
        <Modal show={showModal} modalId={"ServiceModal"} modalTitle={service.name} showModalState={modalState} onClose={handleClose}>
            <form>
                <Input label={"Description"} value={service.description} placeholder={"Short Description (optional)"} onChange={e => {
                    setService({...service, description: e.target.value})
                }} />
                <Input label={"Quantity"} value={service.quantity} type="number" placeholder={"Quantity"} onChange={handleQty} />
                <Input label={"Price ($)"} value={service.price} type="number" placeholder={"Price"} onChange={handlePrice} />
                <AddSelectInput
                isMulti={false}
                label={"Select Technician"}
                options={technicianOptions}
                selected={selectedTechnician}
                error={selectedTechnician.length === 0 ? errors.technicianName : ""}
                onChange={handleTechnicianChange}
                targetModal={"addServiceModal"}
                hasBtn={false}
                />
                <table className="table">
                    <thead>
                        <tr className="text-center">
                            <th>Unit Price</th>
                            <th>Qty.</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-center">
                            <td>${ service.price }</td>
                            <td>{ service.quantity }</td>
                            <th>${ Math.round(service.total_price * 100) / 100 }</th>
                        </tr>
                    </tbody>
                </table>
                <Button color={"success"} text={"Save Service"} onClick={handelSaveService} />
            </form>
        </Modal>
    );
}
export default SelectedService;