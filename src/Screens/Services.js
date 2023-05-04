import { useState, useEffect ,useRef} from "react";
import axios from "axios";
import Helpers from "../Config/Helpers";
import { useNavigate, useLocation } from "react-router-dom";
import DataTable from "../Components/Datatable";
import "izitoast-react/dist/iziToast.css";
import PageTitle from "../Components/PageTitle";
import CardHeader from "../Components/CardHeader";
import ActionButton from "../Components/ActionButton";
import { usePermissions } from "../Hooks/usePermissions";
import AddService from "../Includes/Service/AddService";

function Services() {
    const addServiceRef = useRef(null);
    const permissions = usePermissions();
  const [services, setServices] = useState([]);
  const [data, setData] = useState([]);
  const [perms, setPerms] = useState([]);

  let navigate = useNavigate();
  const getServices = () => {
    axios
      .get(`${Helpers.baseUrl}services/all/${Helpers.authParentId}`, Helpers.headers)
      .then((response) => {
        setServices(response.data.reverse());
        setData(response.data);
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };

  const hanldeEdit = (serviceToEdit) => {
    addServiceRef.current.handleEdit(serviceToEdit);
  };

  const handleDelete = (serviceId) => {
    Helpers.confirmBox(`${Helpers.baseUrl}services/delete/${serviceId}`, navigate, getServices);
  };

  useEffect(() => {
    getServices();
    setPerms(permissions);
  }, []);

  return (
    <div className="page-content">
      <div className="container-fluid">
      <PageTitle title={"Services"} />
        <div className="row">
          <div className="col-8">
            <div className="card">
              <div className="card-body border-bottom">
              <CardHeader setState={setServices} title={"All Services"} data={data} fields={["service_name", "description", "price"]} />
                <DataTable
                  columns={[
                    "Sr. #",
                    "Service Name",
                    "Description",
                    "Price",
                    "Actions",
                  ]}
                >
                  {services.map((service, index) => {
                    return (
                      <tr key={service._id}>
                        <td>{index + 1}</td>
                        <td>{service.service_name}</td>
                        <td>{service.description}</td>
                        <td>$ {service.price}</td>
                        <td>
                          {
                            (Helpers.authUser.user_role == null || perms.can_update == 1) &&
                            <ActionButton color={"success"} icon={"create-outline"} onClick={() => hanldeEdit(service)} />
                          }
                          {
                            perms.can_update == 1 || Helpers.authUser.user_role == null &&
                            <ActionButton color={"danger"} icon={"trash-outline"} onClick={() => handleDelete(service._id)} />
                          }
                        </td>
                      </tr>
                    );
                  })}
                </DataTable>
                {services.length === 0 ?<div className="text-center">
                  No data available to display
                </div> : null}
              </div>
            </div>
          </div>
          <div className="col-4">
             {
              (perms.can_create == 1 || Helpers.authUser.user_role == null || perms.can_update == 1) &&
              <AddService getServices={getServices} ref={addServiceRef} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
