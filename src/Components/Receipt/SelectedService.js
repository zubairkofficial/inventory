import { useEffect, useState,  useReducer } from "react";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import $ from 'jquery'
import AddSelectInput from "./AddSelectInput";
import { customerReducer } from "../../Reducers/CustomerReducer";

const SelectedService = ({ lastService, modalState, showModal, setSelectedServices, selectedServices, setLastSelectedService, calculateTotalServices }) => {
    const [service, setService] = useState({});
    
    
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

            let total = service.price * service.quantity;
            setService({...service, total_price: total});
            selectedServices[selectedServices.length - 1].value = service;
            selectedServices[selectedServices.length - 1].label = `${service.name} ($${service.price})`;
            setLastSelectedService(null);
            setSelectedServices(selectedServices);
            calculateTotalServices();
            setService({});
            modalState(false);
            $('.modal-backdrop').hide();
        }else{
            setErrors({
                technicianName: "Please select the technician"
            })
        }
    }
    useEffect(() => {
        if(lastService){
            setService({ ...lastService.value, quantity: 5});
        }
        
    dispatch({ type: "getTechnicians", states: { setTechnicianOptions } });
        // console.log(lastService);
    }, []);
    return (
        <Modal show={showModal} modalId={"ServiceModal"} modalTitle={service.name} showModalState={modalState}>
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
                            <th>${ service.total_price }</th>
                        </tr>
                    </tbody>
                </table>
                <Button color={"success"} text={"Save Service"} onClick={handelSaveService} />
            </form>
        </Modal>
    );
}
export default SelectedService;