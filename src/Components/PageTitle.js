export default function PageTitle({ title, children }){
    return (
        <div className="row">
            <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                    <h4 className="mb-sm-0">{title}</h4>
                    {children}
                </div>
            </div>
        </div>
    )
}