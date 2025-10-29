import { useContext, useEffect, useRef, useState } from "react";
import { update } from "./functions/dodeca-view";
import "./DduCanvas.sass"
import enableDragScroll from "./functions/dragScroll";
import Toolbar from "./Toolbar/Toolbar";
import { IsPlayingContext } from "../DduPlayer";

function zoom(element, chaild) {
    let scale = 1
    element.addEventListener('wheel', (e) => {
        e.preventDefault()
        if (scale < 0.5) {
            scale = 0.5
            return
        } else if (scale > 3) {
            scale = 3
            return
        }
        if (e.deltaY > 0) {
            scale -= 0.05
        } else if (e.deltaY < 0) {
            scale += 0.05

        }
        chaild.style.transform = 'scale(' + scale + ')'
    })
}


export default function DduCanvas({ file, pause }) {
    const canvasRef = useRef(null);
    const canvasWindowRef = useRef(null)
    const timerId = useRef(null);
    const mouseHoverTimer = useRef(null)

    const isPlaying = useContext(IsPlayingContext)

    const [isMouseMove, setMouseMove] = useState(false)
    const [dduCenter, setDduCenter] = useState([400, 640])
    const [isCentering, setCentering] = useState(false)

    function cleanCanvas() {
        canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    function mouseMoveHandle() {
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement == null) {
                setMouseMove(false)
                return
            }
        })
        clearTimeout(mouseHoverTimer.current)
        if (!isMouseMove) {
            canvasWindowRef.current.style.cursor = ""
            setMouseMove(true)
        }
        mouseHoverTimer.current = setTimeout(() => {
            if (document.fullscreenElement !== null) {
                canvasWindowRef.current.style.cursor = "none"
            }
            setMouseMove(false)
        }, 1500)
    }

    function start() {
        cancelAnimationFrame(timerId.current);
        let lastTime = 0;
        const interval = 50
        const loop = (timestamp) => {
            if (!isPlaying) return;
            if (timestamp - lastTime >= interval) {
                if (!file.drawTrace) {
                    cleanCanvas()
                }
                update(file.circles, canvasRef.current.getContext('2d'), dduCenter, file.shape);
                lastTime = timestamp;
            }
            timerId.current = requestAnimationFrame(loop);
        };
        if (isPlaying) {
            timerId.current = requestAnimationFrame(loop);
        }

    }

    function fullScreenToggle(element) {
        document.fullscreenElement == null ? element.requestFullscreen() : document.exitFullscreen()
    }

    function centering() {
        // скролл элемента
        canvasWindowRef.current.scrollTo(
            canvasRef.current.offsetWidth / 2 - canvasWindowRef.current.offsetWidth / 2,
            canvasRef.current.offsetHeight / 2 - canvasWindowRef.current.offsetHeight / 2
        )
        // Измененение цетра трансформаций
        canvasRef.current.style.transformOrigin = `${canvasWindowRef.current.scrollLeft + canvasWindowRef.current.offsetWidth / 2
            }px ${canvasWindowRef.current.scrollTop + canvasWindowRef.current.offsetHeight / 2
            }px`
    }





    useEffect(() => {
        if (isPlaying && file.circles.length !== 0) {
            start()
        } else cancelAnimationFrame(timerId.current);
    }, [isPlaying, dduCenter])

    useEffect(
        () => {
            if (file.length == 0) return
            file.backgroundColor !== null ?
                canvasRef.current.style.backgroundColor = file.backgroundColor
                : canvasRef.current.style.backgroundColor = 'auto'

            if (file.bestCenter !== null) {
                setDduCenter([
                    (canvasRef.current.width) / 2 - file.bestCenter.x,
                    (canvasRef.current.height) / 2 - file.bestCenter.y
                ])
            }
        }, [file]
    )
    useEffect(() => {
        centering()
        enableDragScroll(canvasWindowRef.current, canvasRef.current)
        zoom(canvasWindowRef.current, canvasRef.current)
        setDduCenter([
            (canvasRef.current.width - canvasWindowRef.current.offsetWidth - dduCenter[0]) / 2,
            (canvasRef.current.height - canvasWindowRef.current.offsetHeight - dduCenter[1]) / 2
        ])
    }, [])

    useEffect(()=>{
        isCentering ? canvasRef.current.style.cursor = 'crosshair': canvasRef.current.style.cursor = ''
    }, [isCentering])


    return (
        <div className="DduCanvas">
            <div
                className='DduCanvas__window'
                ref={canvasWindowRef}
                onMouseMove={mouseMoveHandle}


            >
                <Toolbar isActive={isMouseMove} fullScreen={() => fullScreenToggle(canvasWindowRef.current)} centering={centering} pause={pause} cleanCanvas={cleanCanvas} setCentering={setCentering} isCentering={isCentering} />
                <canvas
                    // onDoubleClick={() => fullScreenToggle(canvasWindowRef.current)}
                    className="DduCanvas__canvas"
                    ref={canvasRef}
                    onClick={(e) => {
                        if (!isCentering) return
                        let scale = window.getComputedStyle(canvasRef.current).getPropertyValue('transform').split(',')[3]
                        const rect = e.target.getBoundingClientRect();
                        const x = (rect.left / scale - e.clientX / scale) * -1
                        const y = (rect.top / scale - e.clientY / scale) * -1
                        const transformX = dduCenter[0]-(-canvasRef.current.width / 2 + x)
                        const transformY = dduCenter[1]-(-canvasRef.current.height / 2 + y)
                        setDduCenter([ transformX, transformY])
                        setCentering(false)
                    }}
                    id="dduCanvas"
                    width='6000px'
                    height='3000px'
                ></canvas>
            </div>
        </div>

    );
}
