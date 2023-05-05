import { useState, useEffect,useRef } from "react";
import axios from "axios";
import Helpers from "../Config/Helpers";
import { useNavigate, useLocation } from "react-router-dom";
import DataTable from "../Components/Datatable";
import "izitoast-react/dist/iziToast.css";
import PageTitle from "../Components/PageTitle";
import CardHeader from "../Components/CardHeader";
import AddOil from "../Includes/Oils/AddOil";
import { usePermissions } from "../Hooks/usePermissions";

function Oils() {
  const permissions = usePermissions();
  const [oils, setOils] = useState([]);
  const [perms, setPerms] = useState([]);
  const [data, setData] = useState([]);
  const addOilRef = useRef(null);

  let navigate = useNavigate();
  const getOils = () => {
    axios
      .get(`${Helpers.baseUrl}oils/all/${Helpers.authParentId}`, Helpers.headers)
      .then((response) => {
        setOils(response.data.reverse());
        setData(response.data);
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };

  const hanldeEdit = (serviceToEdit) => {
    addOilRef.current.handleEdit(serviceToEdit);
  };

  const handleDelete = (oilId) => {
    Helpers.confirmBox(`${Helpers.baseUrl}oils/delete/${oilId}`, navigate, getOils);
  };
  useEffect(() => {
    getOils();
    setPerms(permissions);
  }, []);

  return (
    <div className="page-content">
      <div className="container-fluid">
      <PageTitle title={"Oils"} />
        <div className="row">
          <div className="col-8">
            <div className="card">
              <div className="card-body border-bottom">
              <CardHeader setState={setOils} title={"All Oils"} data={data} fields={["name", "brand", "type","pricePerVehicle"]} />
                <DataTable
                  columns={[
                    "Sr. #",
                    "Oil Name",
                    "Brand",
                    "type",
                    "Quantity",
                    "Price Per Quartz",
                    "Perice Per Vehicle",
                    "Actions",
                  ]}
                >
                  {oils.map((oil, index) => {
                    return (
                      <tr key={oil._id}>
                        <td>{index + 1}</td>
                        <td>{oil.name}</td>
                        <td>{oil.brand}</td>
                        <td>{oil.type}</td>
                        <td>{oil.quantity}</td>
                        <td>$ {oil.pricePerQuartz}</td>
                        <td>$ {oil.pricePerVehicle}</td>
                        <td>
                          {
                            perms.can_update == 1 || Helpers.authUser.user_role == null ?
                            <button
                              onClick={() => hanldeEdit(oil)}
                              type="button"
                              className="btn btn-success btn-sm m-1"
                            >
                              <ion-icon name="create-outline"></ion-icon>
                            </button> : null
                          }
                          {
                            perms.can_delete == 1 || Helpers.authUser.user_role == null ?
                            <button
                              onClick={() => handleDelete(oil._id)}
                              type="button"
                              className="btn btn-danger btn-sm m-1"
                            >
                              <ion-icon name="trash-outline"></ion-icon>
                            </button> : null
                          }
                        </td>
                      </tr>
                    );
                  })}
                </DataTable>
                {oils.length === 0 ? (
                  <div className="text-center">
                    No data available to display
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="col-4">
            {
              (perms.can_create == 1 || Helpers.authUser.user_role == null || perms.can_update == 1) &&
              <AddOil getOils={getOils} ref={addOilRef} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Oils;
