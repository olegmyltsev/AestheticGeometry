

export default function Toolbar(props) {
    return (
        <div className="Toolbar">
            <button className="Toolbar__btn Toolbar__btn_full-screen" onClick={fullScreenToggle}>
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                    <path d="M9.00002 3.99998H4.00004L4 9M20 8.99999V4L15 3.99997M15 20H20L20 15M4 15L4 20L9.00002 20" stroke="#ffffffff" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>
        </div>
    )
}