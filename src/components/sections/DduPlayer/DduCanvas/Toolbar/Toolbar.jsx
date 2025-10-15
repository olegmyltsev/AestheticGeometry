import { useContext, useEffect, useRef, useState } from 'react'
import './Toolbar.sass'
import { IsPlayingContext } from '../../DduPlayer'



export default function Toolbar({ isActive, fullScreen, centering, pause, cleanCanvas}) {
    const isPlaying = useContext(IsPlayingContext)
    const Toolbar = useRef(null)
    const [isHover, setIsHover] = useState(false)

    useEffect(() => {
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement !== null) {
                Toolbar.current.style = 'position: fixed;'
            } else {
                Toolbar.current.style = ''
            }
        })
    }, [])
    
    useEffect(() => {
        if (document.fullscreenElement == null) return
        !isActive && !isHover ? Toolbar.current.style.transform = 'translateY(100%)' : Toolbar.current.style.transform = ''
    }, [isActive, isHover])


    return (
        <div className="Toolbar" ref={Toolbar} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <button className="Toolbar__btn" onClick={fullScreen}>
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                    <path d="M9.00002 3.99998H4.00004L4 9M20 8.99999V4L15 3.99997M15 20H20L20 15M4 15L4 20L9.00002 20" stroke="#ffffffff" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>
            <button className="Toolbar__btn Toolbar__btn-pause" onClick={pause}>
                {isPlaying ? <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                    <rect x="8" y="6" width="3" height="12" rx="0.5" stroke="#71ff69ff" />
                    <rect x="13" y="6" width="3" height="12" rx="0.5" stroke="#71ff69ff" />
                </svg> : <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5V19L19 12L8 5Z" stroke="#71ff69ff" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                </svg>
                }
            </button>
            <button className="Toolbar__btn" onClick={centering}>
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8L12 4M12 8L10 6M12 8L14 6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 16L12 20M12 16L10 18M12 16L14 18" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 12L4 12M8 12L6 10M8 12L6 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M16 12L20 12M16 12L18 10M16 12L18 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
                </svg>
            </button>
            <button className="Toolbar__btn" onClick={cleanCanvas}>
                <svg width="25px" height="25px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <path d="M24,29H8.05a1,1,0,0,1-1-.95l-1-20a1.06,1.06,0,0,1,.27-.74A1,1,0,0,1,7,7H25a1,1,0,0,1,.73.31,1.06,1.06,0,0,1,.27.74L25,28.05A1,1,0,0,1,24,29ZM9,27H23L24,9H8.05Z" fill="white" />
                        <rect x="3" y="7" width="26" height="2" fill="white" />
                        <path d="M21,8.24l-.62-2.48a1,1,0,0,0-1-.76H12.56a1,1,0,0,0-1,.76L11,8.24,9,7.76l.62-2.49A3,3,0,0,1,12.56,3h6.88a3,3,0,0,1,2.91,2.27L23,7.76Z" fill="white" />
                        <line x1="12" y1="13" x2="20" y2="21" stroke="white" strokeWidth="2" />
                        <line x1="20" y1="13" x2="12" y2="21" stroke="white" strokeWidth="2" />
                    </g>
                </svg>
            </button>
        </div>
    )
}