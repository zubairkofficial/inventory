import DataTable from "../../Components/Datatable";

export default function TodayCustomers({ customers }){
    return (
        <div className="card" id="contactList">
          <div className="card-header">
            <div className="row align-items-center g-3">
              <div className="col-md-3">
                <h5 className="card-title mb-0">Today Customers</h5>
              </div>
            </div>
          </div>

          <div className="card-body">
          <DataTable
                  columns={[
                    "Sr. #",
                    "Customer Name",
                    "Email",
                    "Phone",
                    "Address",
                  ]}
                >
                  {customers.map((customer, index) => {
                    return (
                      <tr key={customer._id}>
                        <td>{index + 1}</td>
                        <td>{customer.name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>{customer.address}</td>
                      </tr>
                    );
                  })}
                </DataTable>
                {customers.length === 0 ?<div className="text-center">
                  No data available to display
                </div> : null}
          </div>
        </div>
    );
}