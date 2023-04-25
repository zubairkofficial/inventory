function DataTable({children, columns}){
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    {columns.map(column => {
                        return <th>{ column }</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    );
}

export default DataTable;