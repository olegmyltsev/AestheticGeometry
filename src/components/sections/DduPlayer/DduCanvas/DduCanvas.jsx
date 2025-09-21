import React, { useEffect, useRef } from "react";
import { parseDdu } from "./functions/dduParser";
import { update } from "./functions/dodeca-view";
import "./DduCanvas.sass"
import enableDragScroll from "./functions/dragScroll";





export default function DduCanvas(props) {
    const canvasRef = useRef(null);
    const canvasWindowRef = useRef(null)
    let file = parseDdu(props.file)
    const timerId = useRef(null);

    function start() {
        clearTimeout(timerId.current);
        update(file, canvasRef.current.getContext('2d'))
        timerId.current = setTimeout(() => {
            if (props.isPlaying) { start(); }
        }, 50);
    }

    useEffect(() => {
        canvasWindowRef.current.scrollTo(5000, 5000)
        if (props.isPlaying & file.length !== 0) {
            start();
        } else {
            clearTimeout(timerId.current);
        }

        return () => {
            clearTimeout(timerId.current);
        };
    }, [props.isPlaying])

    function fullScreenToggle() {
        canvasWindowRef.current.requestFullscreen()
    }

    useEffect(() => { enableDragScroll(canvasWindowRef.current) }, [])

    useEffect(() => {
        let scale = 1
        canvasWindowRef.current.addEventListener('wheel', (e) => {
            e.preventDefault()
            if (scale < 0.1) {
                scale = 0.1
                return
            } else if (scale > 5) {
                scale = 5
                return
            }
            if (e.deltaY > 0) { scale -= Math.floor(0.05*100) / 100 } else if (e.deltaY < 0) { scale += Math.floor(0.05*100) / 100 }
            console.log(scale);

            canvasRef.current.style.transform = 'scale(' + scale + ')'
        })

    }, [])


    return (
        <div className="DduCanvas" ref={canvasWindowRef}>
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
