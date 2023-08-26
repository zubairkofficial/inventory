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
import Pagination from "../Components/Pagination";

function Oils() {
  const permissions = usePermissions();
  const [oils, setOils] = useState([]);
  const [perms, setPerms] = useState([]);
  const [data, setData] = useState([]);
  const [paginated, setPaginated] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const addOilRef = useRef(null);

  let navigate = useNavigate();
  const getOils = () => {
    axios
      .get(`${Helpers.baseUrl}oils/all/${Helpers.authParentId}`, Helpers.headers)
      .then((response) => {
        let data = response.data.reverse();
        setOils(data);
        setData(data);
        setPaginated(Helpers.paginate(data));
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };

  const hanldeEdit = (serviceToEdit) => {
    setShowForm(true);
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
      <PageTitle title={`Oils - ${data.length}`}>
        <button onClick={() => setShowForm(true)} className="btn btn-success">Add New Oil</button>
      </PageTitle>
        <div className="row">
          <div className={showForm ? "col-8" : "col-12"}>
            <div className="card">
              <div className="card-body border-bottom">
              <CardHeader setState={setPaginated} paginate={true} setPageNo={setPageNo} title={"All Oils"} data={data} fields={["name", "brand", "type","pricePerVehicle"]} />
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
                  {paginated.length > 0 && paginated[pageNo].map((oil, index) => {
                    return (
                      <tr key={oil._id}>
                        <td>{index + 1}</td>
                        <td>{oil.name}</td>
                        <td>{oil.brand}</td>
                        <td>{oil.type}</td>
                        <td>{oil.quantity}</td>
                        <td>${oil.pricePerQuartz}</td>
                        <td>${oil.pricePerVehicle}</td>
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
                <Pagination paginated={paginated} pageNo={pageNo} setPageNo={setPageNo} />
                {oils.length === 0 ? (
                  <div className="text-center">
                    No data available to display
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="col-4" style={{ display: `${ showForm ? 'block' : 'none' }` }}>
            {
              (perms.can_create == 1 || Helpers.authUser.user_role == null || perms.can_update == 1) &&
              <AddOil setShowForm={setShowForm} getOils={getOils} ref={addOilRef} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Oils;
