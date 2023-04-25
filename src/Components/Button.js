export default function Button({ text, color, onClick, isLoading = false, fullWidth = true }){
    return (
        <div className="mt-4">
            <button className={`btn btn-${color} ${fullWidth ? 'w-100' : '' }`} onClick={onClick} disabled={isLoading}>
                {isLoading ? "Please wait..." : text}
            </button>
        </div>
    )
}