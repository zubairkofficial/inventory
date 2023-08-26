const Pagination = ({ paginated, setPageNo, pageNo }) => {
    return (
        <div className="row">
            <div className="col-md-12 text-right">
                Page: {paginated.map((page, index) => <button onClick={() => setPageNo(index)} className={`btn btn-${ index == pageNo ? 'success' : 'default' } ml-5`}>{ index + 1 }</button>)}
            </div>
        </div>
    );
}

export default Pagination;