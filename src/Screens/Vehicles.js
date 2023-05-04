import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Helpers from "../Config/Helpers";
import { useNavigate } from "react-router-dom";
import DataTable from "../Components/Datatable";
import PageTitle from "../Components/PageTitle";
import CardHeader from "../Components/CardHeader";
import ActionButton from "../Components/ActionButton";
import AddVehicle from "../Includes/Vehicle/AddVehicle";
import { usePermissions } from "../Hooks/usePermissions";

function Vehicles() {
  
    const addVehicleRef = useRef(null);
    const permissions = usePermissions();
  const [vehicles, setVehicles] = useState([]);
  const [data, setData] = useState([]);
  const [perms, setPerms] = useState([]);

  let navigate = useNavigate();
  const getVehicles = () => {
    axios
      .get(`${Helpers.baseUrl}vehicles/all/${Helpers.authParentId}`, Helpers.headers)
      .then((response) => {
        setVehicles(response.data.reverse());
        setData(response.data);
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };


  const hanldeEdit = (serviceToEdit) => {
    addVehicleRef.current.handleEdit(serviceToEdit);
  };

  const handleDelete = (vehicleId) => {
    Helpers.confirmBox(`${Helpers.baseUrl}vehicles/delete/${vehicleId}`, navigate, getVehicles);
  };

  useEffect(() => {
    getVehicles();
    setPerms(permissions);
  }, []);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle title={"Vehicles"} />
        <div className="row">
          <div className="col-8">
            <div className="card">
              <div className="card-body border-bottom">
                <CardHeader setState={setVehicles} title={"All Vehicles"} data={data} fields={["name", "model", "vin_number", "year"]} />
                <DataTable
                  columns={[
                    "Sr. #",
                    "Make",
                    "Model",
                    "Vin Number",
                    "Year",
                    "Customer",
                    "Actions",
                  ]}
                >
                  {vehicles.map((vehicle, index) => {
                    return (
                      <tr key={vehicle._id}>
                        <td>{index + 1}</td>
                        <td>{vehicle.name}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.vin_number}</td>
                        <td>{vehicle.year}</td>
                        <td>{vehicle.customer ? vehicle.customer.name : ''}</td>
                        <td>
                          {
                            (Helpers.authUser.user_role == null || perms.can_update == 1) &&
                            <ActionButton color={"success"} icon={"create-outline"} onClick={() => hanldeEdit(vehicle)} />

                          }
                          {
                            (perms.can_delete == 1 || Helpers.authUser.user_role == null) && 
                            <ActionButton color={"danger"} icon={"trash-outline"} onClick={() => handleDelete(vehicle._id)} />
                          }
                        </td>
                      </tr>
                    );
                  })}
                </DataTable>
                {vehicles.length === 0 ?<div className="text-center">
                  No data available to display
                </div> : null}
              </div>
            </div>
          </div>
          <div className="col-4">
            {
              (perms.can_create == 1 || Helpers.authUser.user_role == null || perms.can_update == 1) &&
              <AddVehicle getVehicles={getVehicles} ref={addVehicleRef} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vehicles;