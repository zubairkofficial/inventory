import axios from "axios";
import Helpers from "../Config/Helpers";
export const customerReducer = (state, action) => {
    const servicesOptions = [];
    const getServices = (withOilOptions = false) => {
        axios.get(`${Helpers.baseUrl}services/all/${Helpers.authParentId}`, Helpers.headers).then((response) => {
            let resData = response.data.reverse();
            for (let index = 0; index < resData.length; index++) {
                const service = {
                    _id: resData[index]._id,
                    name: resData[index].service_name,
                    price: resData[index].price,
                    description: resData[index].description,
                    quantity: 1,
                    total_price: resData[index].price,
                    tax: resData[index].tax,
                    type: "service",
                };
                const serviceOption = {
                  label: resData[index].service_name + " ($" + resData[index].price + ")",
                  value: service,
                };
                servicesOptions.push(serviceOption);
            }
            if(withOilOptions){
                getOils();
            }
        });
    }
    const tireOptions = [];
    const getTires = () => {
        axios.get(`${Helpers.baseUrl}tires/all/${Helpers.authParentId}`, Helpers.headers).then((response) => {
            let resData = response.data.reverse();
            for (let index = 0; index < resData.length; index++) {
                const service = {
                    _id: resData[index]._id,
                    name: resData[index].brand + resData[index].size + " (" + resData[index].quality + ")",
                    price: resData[index].price,
                    description: "",
                    quantity: resData[index].quantity,
                    stock: resData[index].quantity,
                    total_price: resData[index].price,
                    tax: "Taxable",
                    type: "tire_service",
                };
                let tireOption = {};
                if(service.stock <= 0){
                    tireOption = {
                        label: response.data[index].brand + " " + response.data[index].size + " (" + response.data[index].quality + ") ($" + response.data[index].price + ") (Out of Stock)",
                        value: service,
                        isDisabled: true,
                    };
                }else{
                    tireOption = {
                        label: response.data[index].brand + " " + response.data[index].size + " (" + response.data[index].quality + ") ($" + response.data[index].price + ")",
                        value: service,
                        isDisabled: false,
                    };
                }
                tireOptions.push(tireOption);
            }
        });
        // return options;
    }
    const getOils = () => {
        axios.get(`${Helpers.baseUrl}oils/all/${Helpers.authParentId}`, Helpers.headers).then((response) => {
            let resData = response.data.reverse();
            console.log(response.data[0].quantity);
            for (let index = 0; index < resData.length; index++) {
                const service = {
                    _id: response.data[index]._id,
                    name: response.data[index].brand + " " + response.data[index].name + " (" + response.data[index].type + ")",
                    price: response.data[index].pricePerVehicle,
                    extra_price: response.data[index].pricePerQuartz,
                    description: "",
                    stock: response.data[index].quantity,
                    total_price: response.data[index].pricePerVehicle,
                    tax: "Taxable",
                    type: "oil_service",
                };
                const oilOption = {
                    label: response.data[index].brand + " " + response.data[index].name + " (" + response.data[index].type + ") ( $" + response.data[index].pricePerVehicle + " )",
                    value: service,
                };
                servicesOptions.push(oilOption);
            }
        });
    }
    switch(action.type){
        case 'getCustomers':
            axios.get(`${Helpers.baseUrl}customers/all/${Helpers.authParentId}`,Helpers.headers).then((response) => {
                let customerArray = [];
                let resData = response.data.reverse();
                for (let index = 0; index < resData.length; index++) {
                  const object = {
                    label: resData[index].name + " (" + resData[index].phone + ")",
                    value: resData[index],
                  };
                  customerArray.push(object);
                }
                action.states.setCustomersOptions(customerArray);
            });
            break;
        case 'getCustomerVehicles':
            axios.get(`${Helpers.baseUrl}vehicles/customer/${action.data.customerId}`, Helpers.headers).then((response) => {
                let vehiclesArray = [];
                let resData = response.data.reverse();
                for (let index = 0; index < resData.length; index++) {
                const object = {
                    label:
                    resData[index].name + " " + resData[index].model + "",
                    value: resData[index],
                };
                vehiclesArray.push(object);
                }
                action.states.setVehiclesOptions(vehiclesArray);
            });
            break;
        case 'getAllServices':
            getServices(true)
            action.states.setServiceOptions(servicesOptions)
            break;
        case 'getTax':
            axios.get(`${Helpers.baseUrl}customers/get-tax/${Helpers.authParentId}`,Helpers.headers).then((response) => {
                action.states.setTaxValue(response.data);
            });
            break;
        case 'getTires':
            getTires();
            action.states.setTireOptions(tireOptions);
            break;
        case 'getTechnicians':
            axios.get(`${Helpers.baseUrl}employees/all/${Helpers.authParentId}`,Helpers.headers).then((response) => {
                let techniciansArray = [];
                let resData = response.data.reverse();
                for (let index = 0; index < resData.length; index++) {
                const object = {
                    label:
                    resData[index].name,
                    value: resData[index],
                };
                techniciansArray.push(object);
                }
                action.states.setTechnicianOptions(techniciansArray);
            });
            break;
        default:
            return state;
    }
}