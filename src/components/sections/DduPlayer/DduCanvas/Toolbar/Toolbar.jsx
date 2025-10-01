import { useContext, useEffect, useRef, useState } from 'react'
import './Toolbar.sass'
import { IsPlayingContext } from '../../DduPlayer'



export default function Toolbar({ isActive, fullScreen, centering, pause }) {
    const isPlaying = useContext(IsPlayingContext)
    const Toolbar = useRef(null)
    const [isHover, setIsHover] = useState(false)

    useEffect(() => {
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement == null) {
                Toolbar.current.style = ''
            }
        }
        )
    }, [])



    useEffect(() => {
        if (document.fullscreenElement == null) return
        !isActive && !isHover ? Toolbar.current.style.transform = 'translateY(100%)' : Toolbar.current.style = ''
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
        </div>
    )
}