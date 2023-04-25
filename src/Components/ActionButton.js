export default function ActionButton({ onClick, icon, color }){
    return (
        <button
            onClick={onClick}
            type="button"
            className={`btn btn-${color} btn-sm m-1`}
        >
            <ion-icon name={icon}></ion-icon>
        </button>
    )
}