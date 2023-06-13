import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'
import { immediateToast } from "izitoast-react";
import "izitoast-react/dist/iziToast.css";
import axios from 'axios';

class Helpers{
    static appName = "Inventory System";
    // static baseUrl = "//127.0.0.1:4000/";
    static publicPath = window.location.origin;
    static baseUrl = "http://3.80.216.93:3000/";
    static authUser = JSON.parse(localStorage.getItem('user'));
    
    static authParentId = this.authUser == null ? '' : parseInt(this.authUser.parent_id) === 0 ? this.authUser._id : this.authUser.parent_id;
    static headers = {
        headers:{
            'Content-Type': 'application/json',
            'x-access-token':localStorage.getItem('token'),
        }
    }

    static errors = err_array => {
        let errors = {};
        console.log("Error Array", err_array);
        for(let i = 0; i < err_array.length; i++){
            const key = err_array[i].param;
            errors[key] = err_array[i].msg;
            console.log("Error Added", errors);
        }
        return errors;
    }

    static toast = (type, message) => {
        const notyf = new Notyf();
        notyf.open({
            message: message,
            type:type,
            position:{x:'right', y:'top'},
            ripple:true,
            duration:2000,
        });
    }

    static validate = (name, value, isRequired = false, isPhone = false) => {
        let error = "";
        if(isRequired){
            if(value === "" || value === null){
                error = `${name} field is required`;
            }
        }else if(isPhone){
            if(!(typeof value == 'number' && !isNaN(value))){
                error = `${name} field must be a valid price value`;
            }
        }
        return error;
    }

    static error_response = error => {
        let errors = {};
        if(error.response.data.errors){
            Helpers.toast("error", "Fix the errors to continue");
            errors = this.errors(error.response.data.errors);
        }
        if(error.response.data.error){
            Helpers.toast("error", error.response.data.error);
        }
        return errors;
    }

    static unauthenticated = (error, navigator) => {
        if(error.response.data.error && error.response.data.error === "Unauthenticated"){
            Helpers.toast("error", error.response.data.error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.clear();
            navigator('/');
        }
    }

    static anyErrors = errObject => {
        return Object.keys(errObject).length === 0 ? true : false;
    }

    static confirmBox = (deleteLink, navigate, call) => {
        immediateToast("warning", {
            timeout: 20000,
            close: false,
            overlay: true,
            displayMode: "once",
            zindex: 9999,
            title: "",
            message: "Are you sure to delete this?",
            position: "center",
            buttons: [
              [
                "<button><b>YES</b></button>",
                function (instance, toast) {
                    axios.get(deleteLink,Helpers.headers).then((response) => {
                        call();
                        instance.hide({ transitionOut: "fadeOut" }, toast, "button");
                        Helpers.toast("success", "Deleted successfully");
                    })
                    .catch((error) => {
                        Helpers.unauthenticated(error, navigate);
                        instance.hide({ transitionOut: "fadeOut" }, toast, "button");
                    });
                },
                true,
              ],
              [
                "<button>NO</button>",
                function (instance, toast) {
                    instance.hide({ transitionOut: "fadeOut" }, toast, "button");
                },
              ],
            ],
        });
    }

    static search = (query, data, fields) => {
        if(query){
            // eslint-disable-next-line
            let filteredData = data.filter(row => {
                for(let i = 0; i < fields.length; i++){
                    let field = fields[i];
                    if(field.includes(".")){
                        let keyvalue = field.split(".");
                        let key = keyvalue[0];
                        let value = keyvalue[1];
                        if(isNaN(query) && isNaN(row[key][value])){
                            if(row[key][value].toLowerCase().includes(query.toLowerCase())){
                                return row;
                            }
                        }else if(!isNaN(query) && !isNaN(row[key][value])){
                            if(row[key][value].toString().includes(query)){
                                return row;
                            }
                        }
                    }else{
                        if(isNaN(query) && isNaN(row[field])){
                            if(row[field].toLowerCase().includes(query.toLowerCase())){
                                return row;
                            }
                        }else if(!isNaN(query) && !isNaN(row[field])){
                            if(row[field].toString().includes(query)){
                                return row;
                            }
                        }
                    }
                }
            });
            return filteredData;
        }else{
            return data;
        }
    }
}

export default Helpers;