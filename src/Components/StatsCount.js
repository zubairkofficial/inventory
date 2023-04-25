export default function StatsCount({ value, title }){
    return (
        <div className="card card-animate">
            <div className="card-body text-center">
                <div className="d-flex mb-3">
                  <div className="flex-grow-1">
                  </div>
                </div>
                <h3 className="mb-2">{value}</h3>
                <h6 className="text-muted mb-0">{title}</h6>
            </div>
        </div>
    )
}