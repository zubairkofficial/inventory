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
import AddTire from "../Includes/Tire/AddTire";
import Pagination from "../Components/Pagination";

function Tires() {
    const addTireRef = useRef(null);
    const permissions = usePermissions();
    const [tires, setTires] = useState([]);
    const [paginated, setPaginated] = useState([]);
    const [pageNo, setPageNo] = useState(0);
  const [data, setData] = useState([]);
  const [perms, setPerms] = useState([]);
  const [showForm, setShowForm] = useState(false);

  let navigate = useNavigate();
  const getTires = () => {
    axios
      .get(`${Helpers.baseUrl}tires/all/${Helpers.authParentId}`, Helpers.headers)
      .then((response) => {
        let data = response.data.reverse();
        setTires(data);
        setData(data);
        setPaginated(Helpers.paginate(data));
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };
 const hanldeEdit = (serviceToEdit) => {
    setShowForm(true)
    addTireRef.current.handleEdit(serviceToEdit);
  };
  const handleDelete = (tireId) => {
    Helpers.confirmBox(`${Helpers.baseUrl}tires/delete/${tireId}`, navigate, getTires);
  };

 useEffect(() => {
    getTires();
    setPerms(permissions);
  }, []);

  return (
    <div className="page-content">
      <div className="container-fluid">
      <PageTitle title={`Tires - ${data.length}`}>
        <button onClick={() => setShowForm(true)} className="btn btn-success">Add New Tire</button>
      </PageTitle>
        <div className="row">
          <div className={showForm ? "col-8" : "col-12"}>
            <div className="card">
              <div className="card-body border-bottom">
              <CardHeader setState={setPaginated} paginate={true} setPageNo={setPageNo} title={"All Tires"} data={data} fields={["brand","size","quantity","price","quality"]} />
                <DataTable
                  columns={[
                    "Sr. #",
                    "Brand Name",
                    "Size",
                    "Quantity",
                    "Price",
                    "Quality",
                    "Actions",
                  ]}
                >
                  {paginated.length > 0 && paginated[pageNo].map((tire, index) => {
                    return (
                      <tr key={tire._id}>
                        <td>{ (pageNo * 10) + (index + 1) }</td>
                        <td>{tire.brand}</td>
                        <td>{tire.size}</td>
                        <td>{tire.quantity}</td>
                        <td>${tire.price}</td>
                        <td>{tire.quality}</td>
                        <td>
                        {
                            (Helpers.authUser.user_role == null || perms.can_update == 1) &&
                            <ActionButton color={"success"} icon={"create-outline"} onClick={() => hanldeEdit(tire)} />
                          }
                          {
                            perms.can_update == 1 || Helpers.authUser.user_role == null &&
                            <ActionButton color={"danger"} icon={"trash-outline"} onClick={() => handleDelete(tire._id)} />
                          }
                        </td>
                      </tr>
                    );
                  })}
                </DataTable>
                <Pagination paginated={paginated} pageNo={pageNo} setPageNo={setPageNo} />
                {tires.length === 0 ? (
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
              <AddTire setShowForm={setShowForm} getTires={getTires} ref={addTireRef} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tires;
