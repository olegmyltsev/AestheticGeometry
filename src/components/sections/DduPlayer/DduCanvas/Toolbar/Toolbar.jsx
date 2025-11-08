import { useContext, useEffect, useRef, useState } from 'react'
import './Toolbar.sass'
import { IsPlayingContext } from '../../DduPlayer'

export default function Toolbar({ isActive, fullScreen, centering, pause, cleanCanvas, setCentering, isCentering, setShape, shape,  drawTrace, setDrawTrace }) {
    const isPlaying = useContext(IsPlayingContext)
    const Toolbar = useRef(null)
    const select = useRef(null) 
    const [isHover, setIsHover] = useState(false)

    useEffect(() => {
        !isActive && !isHover ?
            Toolbar.current.style.transform = 'translateY(100%)' :
            Toolbar.current.style.transform = ''

    }, [isActive, isHover])

    useEffect(() => {
        document.addEventListener('fullscreenchange', () => {
            document.fullscreenElement !== null ?
                Toolbar.current.style = 'position: fixed;' :
                Toolbar.current.style = ''

        })
    }, [])


    

    return (
        <div className="Toolbar" ref={Toolbar} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <select ref={select} className="Toolbar__btn" title='Выбрать форму' onChange={(e) => {
                setShape(e.target.value)
            }} value={shape}>
                <option value="CIRCLE">○</option>
                <option value="SQUARE">□</option>
                <option value="CROSS">+</option>
                <option value="VERTICAL_BAR">|</option>
                <option value="HORIZONTAL_BAR">—</option>
            </select>

            <button className="Toolbar__btn" title='Выбрать центр рисунка' onClick={() => { setCentering(!isCentering) }}>
                <svg viewBox="0 0 24 24">
                    <path d="M18.2848192,17.5777124 L20.8535534,20.1464466 C21.0488155,20.3417088 21.0488155,20.6582912 20.8535534,20.8535534 C20.6582912,21.0488155 20.3417088,21.0488155 20.1464466,20.8535534 L17.5777124,18.2848192 L15.9160251,20.7773501 C15.6899572,21.116452 15.1749357,21.0571624 15.0318354,20.6755617 L12.0318354,12.6755617 C11.8811067,12.2736185 12.2736185,11.8811067 12.6755617,12.0318354 L20.6755617,15.0318354 C21.0571624,15.1749357 21.116452,15.6899572 20.7773501,15.9160251 L18.2848192,17.5777124 Z M17.2312404,17.0782479 L19.4104716,15.6254271 L13.3544004,13.3544004 L15.6254271,19.4104716 L17.0782479,17.2312404 C17.0974475,17.2011742 17.1201804,17.1727128 17.1464466,17.1464466 C17.1727128,17.1201804 17.2011742,17.0974475 17.2312404,17.0782479 L17.2312404,17.0782479 Z M11.5,20 C11.7761424,20 12,20.2238576 12,20.5 C12,20.7761424 11.7761424,21 11.5,21 L5.5,21 C4.11928813,21 3,19.8807119 3,18.5 L3,5.48612181 C3,4.10540994 4.11928813,2.98612181 5.5,2.98612181 L18.5,2.98612181 C19.8807119,2.98612181 21,4.10540994 21,5.48612181 L21,11.5 C21,11.7761424 20.7761424,12 20.5,12 C20.2238576,12 20,11.7761424 20,11.5 L20,5.48612181 C20,4.65769469 19.3284271,3.98612181 18.5,3.98612181 L5.5,3.98612181 C4.67157288,3.98612181 4,4.65769469 4,5.48612181 L4,18.5 C4,19.3284271 4.67157288,20 5.5,20 L11.5,20 Z" fill='#fff' stroke={
                        isCentering ? '#fff' : 'none'
                    } />
                </svg>
            </button>
            <button title='На весь экран' className="Toolbar__btn" onClick={fullScreen}>
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                    <path d="M9.00002 3.99998H4.00004L4 9M20 8.99999V4L15 3.99997M15 20H20L20 15M4 15L4 20L9.00002 20" stroke="#ffffffff" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>
            <button title='Приостановить' className="Toolbar__btn Toolbar__btn-pause" onClick={pause}>
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                    {isPlaying ? <g> <rect x="8" y="6" width="3" height="12" rx="0.5" stroke="#71ff69ff" />
                        <rect x="13" y="6" width="3" height="12" rx="0.5" stroke="#71ff69ff" /> </g> :
                        <path d="M8 5V19L19 12L8 5Z" stroke="#71ff69ff" strokeWidth="1.5" fill="none" strokeLinejoin="round" />}
                </svg>
            </button>
            <button title='Перейти к центру' className="Toolbar__btn" onClick={centering}>
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8L12 4M12 8L10 6M12 8L14 6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 16L12 20M12 16L10 18M12 16L14 18" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 12L4 12M8 12L6 10M8 12L6 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M16 12L20 12M16 12L18 10M16 12L18 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
                </svg>
            </button>
            <button title='Очистить' className="Toolbar__btn Toolbar__btn-cross" onClick={cleanCanvas}>
                <svg viewBox="0 0 24 24" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
            <button title='Отображать след' className="Toolbar__btn" onClick={() => setDrawTrace(!drawTrace)}>
                <svg viewBox="0 0 24 24">
                    <g>
                        {/* <path stroke='#fff'  d="M0 0h24v24H0z" /> */}
                        <path stroke='#ffffffff' fill={drawTrace ? '#fff' : 'none'} d="M4 18h5.5v1.25a2.75 2.75 0 1 1-5.5 0V18zm4.058-4l.045-.132C8.87 11.762 9 11.37 9 11c0-.75-.203-1.643-.528-2.273C8.23 8.257 8.06 8.12 8 8.12 6.72 8.12 5.5 9.484 5.5 11c0 .959.075 1.773.227 2.758l.038.242h2.293zM8 6.12c2 0 3 2.88 3 4.88 0 1-.5 2-1 3.5L9.5 16H4c0-1-.5-2.5-.5-5S5.498 6.12 8 6.12zm12.054 7.978l-.217 1.231a2.75 2.75 0 0 1-5.417-.955l.218-1.23 5.416.954zm-1.05-4.246c.165-.5.301-.895.303-.9.202-.658.361-1.303.485-2.008.263-1.492-.702-3.047-1.962-3.27-.059-.01-.25.095-.57.515-.43.565-.784 1.41-.915 2.147-.058.33-.049.405.27 2.263.045.256.082.486.116.717l.02.138 2.254.398zm-.826-8.147c2.464.434 4.018 3.124 3.584 5.586-.434 2.463-1.187 3.853-1.36 4.838l-5.417-.955-.232-1.564c-.232-1.564-.55-2.636-.377-3.62.347-1.97 1.832-4.632 3.802-4.285z" />
                    </g>
                </svg>
            </button>
        </div>
    )
}