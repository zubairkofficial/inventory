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
import Pagination from "../Components/Pagination";

function Services() {
    const addServiceRef = useRef(null);
    const permissions = usePermissions();
  const [services, setServices] = useState([]);
  const [paginated, setPaginated] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [data, setData] = useState([]);
  const [perms, setPerms] = useState([]);
  const [showForm, setShowForm] = useState(false);

  let navigate = useNavigate();
  const getServices = () => {
    axios
      .get(`${Helpers.baseUrl}services/all/${Helpers.authParentId}`, Helpers.headers)
      .then((response) => {
        let data = response.data.reverse();
        setServices(data);
        setData(data);
        setPaginated(Helpers.paginate(data));
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };

  const hanldeEdit = (serviceToEdit) => {
    setShowForm(true);
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
      <PageTitle title={`Services - ${ data.length }`}>
        <button onClick={() => setShowForm(true)} className="btn btn-success">Add New Service</button>
      </PageTitle>
        <div className="row">
          <div className={showForm ? "col-8" : "col-12"}>
            <div className="card">
              <div className="card-body border-bottom">
              <CardHeader setState={setPaginated} paginate={true} setPageNo={setPageNo} title={"All Services"} data={data} fields={["service_name", "description", "price"]} />
                <DataTable
                  columns={[
                    "Sr. #",
                    "Service Name",
                    showForm ? "" : "Description",
                    "Price",
                    "Actions",
                  ]}
                >
                  {paginated.length > 0 && paginated[pageNo].map((service, index) => {
                    return (
                      <tr key={service._id}>
                        <td>{ (pageNo * 10) + (index + 1) }</td>
                        <td>{service.service_name}</td>
                        <td>{!showForm && service.description}</td>
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
                <Pagination paginated={paginated} pageNo={pageNo} setPageNo={setPageNo} />
                {services.length === 0 ?<div className="text-center">
                  No data available to display
                </div> : null}
              </div>
            </div>
          </div>
          <div className="col-4" style={{ display: `${ showForm ? 'block' : 'none' }` }}>
             {
              (perms.can_create == 1 || Helpers.authUser.user_role == null || perms.can_update == 1) &&
              <AddService setShowForm={setShowForm} getServices={getServices} ref={addServiceRef} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
