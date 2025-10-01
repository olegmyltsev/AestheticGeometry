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
        if (scale < 0.2) {
            scale = 0.2
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

    const [canvasWindowClass, setCanvasWindowClass] = useState('DduCanvas__window')
    const [isMouseMove, setMouseMove] = useState(false)

    function mouseMoveHandle() {
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement == null) {
                setMouseMove(false)
                return
            }
        })
        clearTimeout(mouseHoverTimer.current)
        if (!isMouseMove) {
            setMouseMove(true)
        }
        mouseHoverTimer.current = setTimeout(() => {
            setMouseMove(false)
        }, 1000)
    }

    function start() {

        update(file, canvasRef.current.getContext('2d'))
        clearTimeout(timerId.current);
        timerId.current = setTimeout(() => {
            if (isPlaying) { start(); }
        }, 50);
    }

    function fullScreenToggle() {
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement == null) {
                setCanvasWindowClass('DduCanvas__window')
            }
        })
        if (document.fullscreenElement == null) {
            canvasWindowRef.current.requestFullscreen()
            setCanvasWindowClass(canvasWindowClass + '_isFullscreen')
        } else {
            document.exitFullscreen()
            setCanvasWindowClass('')
        }
    }

    function centering() {

        canvasWindowRef.current.scrollTo(
            canvasRef.current.offsetWidth / 2 - canvasWindowRef.current.offsetWidth / 2,
            canvasRef.current.offsetHeight / 2 - canvasWindowRef.current.offsetHeight / 2
        )
        canvasRef.current.style.transformOrigin = `${canvasWindowRef.current.scrollLeft + canvasWindowRef.current.offsetWidth / 2
            }px ${canvasWindowRef.current.scrollTop + canvasWindowRef.current.offsetHeight / 2
            }px`
    }



    useEffect(() => {
        if (isPlaying && file.length !== 0) { start() } else clearTimeout(timerId.current);
    }, [isPlaying])

    useEffect(() => {
        centering()
        enableDragScroll(canvasWindowRef.current, canvasRef.current)
        zoom(canvasWindowRef.current, canvasRef.current)
    }, [])

    return (
        <div className="DduCanvas">
            <div
                className={'DduCanvas__window ' + canvasWindowClass}
                ref={canvasWindowRef}
                onMouseMove={mouseMoveHandle}
            >
                <Toolbar isActive={isMouseMove} fullScreen={fullScreenToggle} centering={centering} pause={pause} />
                <canvas
                    className="DduCanvas__canvas"
                    ref={canvasRef}
                    onDoubleClick={fullScreenToggle}
                    id="dduCanvas"
                    width='10000px'
                    height='10000px'
                ></canvas>
            </div>
        </div>

    );
}
