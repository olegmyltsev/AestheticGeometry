import React, { useEffect, useRef, useState } from "react";
import { parseDdu } from "./functions/dduParser";
import { update } from "./functions/dodeca-view";
import "./DduCanvas.sass"
import enableDragScroll from "./functions/dragScroll";





export default function DduCanvas(props) {
    const canvasRef = useRef(null);
    const canvasWindowRef = useRef(null)
    const timerId = useRef(null);

    const [file, setFile] = useState('')
    const [canvasWindowClass, setCanvasWindowClass] = useState('DduCanvas')

    function start() {
        update(file, canvasRef.current.getContext('2d'))
        clearTimeout(timerId.current);
        timerId.current = setTimeout(() => {
            if (props.isPlaying) { start(); }
        }, 50);
    }

        function fullScreenToggle() {
        document.addEventListener('fullscreenchange', (e) => {
            if (document.fullscreenElement == null) {
                setCanvasWindowClass('DduCanvas')
            }
        })
        if (document.fullscreenElement == null) {
            canvasWindowRef.current.requestFullscreen()
            setCanvasWindowClass(canvasWindowClass + ' ' + canvasWindowClass + '_isFullscreen')
        } else {
            document.exitFullscreen()
            setCanvasWindowClass('DduCanvas')
        }
    }

    function zoom() {
        let scale = 1
        canvasWindowRef.current.addEventListener('wheel', (e) => {
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
            canvasRef.current.style.transform = 'scale(' + scale + ')'
        })
    }

    useEffect(() => {        
        if (props.isPlaying && file.length !== 0) {start()} else clearTimeout(timerId.current);
    }, [props.isPlaying])

    useEffect(() => {
        canvasWindowRef.current.scrollTo(
            5000-canvasWindowRef.current.offsetWidth/2,
            5000-canvasWindowRef.current.offsetHeight / 2
        )
        enableDragScroll(canvasWindowRef.current, canvasRef.current)
        zoom()
    }, [])

    useEffect(() => { setFile(parseDdu(props.file)) }, [props.file])

    return (
        <div
            className={canvasWindowClass}
            ref={canvasWindowRef}
        >
            <canvas
                className="DduCanvas__canvas"
                ref={canvasRef}
                onDoubleClick={fullScreenToggle}
                id="dduCanvas"
                width='10000px'
                height='10000px'
            ></canvas>
        </div>
    );
}
