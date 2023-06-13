export default function ReportIcon({ iconUrl, text, number }){
    return (
        <div className="col-xxl-3 col-md-6">
            <div className="card card-animate">
                <div className="card-body text-center">
                    <div className="d-flex mb-3">
                        <div className="flex-grow-1">
                            <lord-icon
                                src={iconUrl}
                                colors="primary:#405189,secondary:#0ab39c"
                                style={{ width: 55, height: 55 }}
                            ></lord-icon>
                        </div>
                    </div>
                    <h3 className="mb-2">{number}</h3>
                    <h6 className="text-muted mb-0">{text}</h6>
                </div>
            </div>
        </div>
    );
}