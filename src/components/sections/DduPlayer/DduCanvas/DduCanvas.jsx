import React, { useEffect, useRef, useState } from "react";
import { parseDdu } from "./functions/dduParser";
import { update } from "./functions/dodeca-view";
import "./DduCanvas.sass"
import enableDragScroll from "./functions/dragScroll";





export default function DduCanvas(props) {
    const canvasRef = useRef(null);
    const canvasWindowRef = useRef(null)
    let file = parseDdu(props.file)
    const timerId = useRef(null);


    const [canvasWindowClass, setCanvasWindowClass] = useState('DduCanvas')

    function start() {
        clearTimeout(timerId.current);
        update(file, canvasRef.current.getContext('2d'))
        timerId.current = setTimeout(() => {
            if (props.isPlaying) { start(); }
        }, 50);
    }

    useEffect(() => {     
        canvasWindowRef.current.scrollTo(5000-canvasWindowRef.current.offsetWidth/2, 5000-canvasWindowRef.current.offsetHeight/2)

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
        if (document.fullscreenElement == null) {
            canvasWindowRef.current.requestFullscreen()
            setCanvasWindowClass(canvasWindowClass + ' ' + canvasWindowClass + '_isFullscreen')
        } else {
            document.exitFullscreen()
            setCanvasWindowClass('DduCanvas')
        }
    }

    useEffect(() => { enableDragScroll(canvasWindowRef.current) }, [])

    useEffect(() => {
        document.addEventListener('fullscreenchange', (e)=>{
            if (document.fullscreenElement == null){
                setCanvasWindowClass('DduCanvas')
                
            }
            
        })
        let scale = 1
        canvasWindowRef.current.addEventListener('wheel', (e) => {
            e.preventDefault()
            console.log(e);
            
            if (scale < 0.2) {
                scale = 0.2
                return
            } else if (scale > 3) {
                scale = 3
                return
            }
            
            if (e.deltaY > 0) { scale -= Math.floor(0.05 * 100) / 100 } else if (e.deltaY < 0) { scale += Math.floor(0.05 * 100) / 100 }
            canvasRef.current.style.transform = 'scale(' + scale + ')'
        })

    }, [])


    return (
        <div className={canvasWindowClass} ref={canvasWindowRef}>
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
