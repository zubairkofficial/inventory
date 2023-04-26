export default function IconButton({ text, icon, color, onClick, isLoading = false, fullWidth = true, topMartgin = true }){
    return (
        <div className={`${topMartgin && 'mt-4'}`}>
            <button className={`btn btn-${color} ${fullWidth ? 'w-100' : '' }`} onClick={onClick} disabled={isLoading}>
                {isLoading ? "Please wait..." : 
                    <span>
                        <ion-icon name={icon} style={{ marginBottom: -6, height: 22 }}></ion-icon>
                        {text && " " + text}
                    </span>
                }
            </button>
        </div>
    )
}