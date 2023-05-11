import { useEffect, useState } from "react";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import $ from 'jquery'

const SelectedService = ({ lastService, modalState, showModal, setSelectedServices, selectedServices, setLastSelectedService }) => {
    const [service, setService] = useState({});
    const handleQty = e => {
        let inputValue = e.target.value;
        if(!isNaN(inputValue)){
            setService({...service, quantity: parseInt(inputValue), total_price: inputValue * service.price})
        }
    }
    
    const handlePrice = e => {
        let inputValue = e.target.value;
        if(!isNaN(inputValue)){
            setService({...service, price: inputValue, total_price: service.quantity * inputValue})
        }
    }
    const handelSaveService = e => {
        e.preventDefault();
        let total = service.price * service.quantity;
        setService({...service, total_price: total});
        selectedServices[selectedServices.length - 1].value = service;
        selectedServices[selectedServices.length - 1].label = `${service.name} ($${service.price})`;
        setLastSelectedService(null);
        setSelectedServices(selectedServices);
        setService({});
        modalState(false);
        $('.modal-backdrop').hide();
    }
    useEffect(() => {
        if(lastService){
            setService(lastService.value);
        }
        console.log(lastService);
    }, []);
    return (
        <Modal show={showModal} modalId={"ServiceModal"} modalTitle={service.name} showModalState={modalState}>
            <form>
                <Input label={"Description"} value={service.description} placeholder={"Short Description (optional)"} onChange={e => {
                    setService({...service, description: e.target.value})
                }} />
                <Input label={"Quantity"} value={service.quantity} type="number" placeholder={"Quantity"} onChange={handleQty} />
                <Input label={"Price ($)"} value={service.price} type="number" placeholder={"Price"} onChange={handlePrice} />
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