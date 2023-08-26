function DataTable({children, columns, style}){
    return (
        <table className="table table-striped" style={style}>
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