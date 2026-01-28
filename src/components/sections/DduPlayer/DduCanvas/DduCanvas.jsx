import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import "./DduCanvas.sass"

import { update } from "../../../../utils/dodeca-view";
import enableDragScroll from "../../../../hooks/dduPlayer/useDragScroll";
import Toolbar from "./Toolbar/Toolbar";

import targetDDU from "../../../../store/dduPlayerStore/targetDDU";
import userActionsStore from "../../../../store/dduPlayerStore/userActionsStore";



const DduCanvas = observer(() => {
    const file = targetDDU.content
    const {
        isPlaying,
        shape,
        setShape,
        drawTrace,
        setDrawTrace
    } = userActionsStore

    const canvasRef = useRef(null);
    const canvasWindowRef = useRef(null)
    const timerId = useRef(null);
    const showToolsTimer = useRef(null)


    const [showTools, setShowTools] = useState(true)
    const [dduCenter, setDduCenter] = useState([720, 400])
    const [isCentering, setCentering] = useState(false)
    const [scale, setScale] = useState(1)



    function cleanCanvas() {
        canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    function mouseMoveHandle() {
        clearTimeout(showToolsTimer.current)
        if (document.fullscreenElement == null) {
            setShowTools(true)
            return
        }

        canvasWindowRef.current.style.cursor = ""
        setShowTools(true)

        showToolsTimer.current = setTimeout(() => {
            canvasWindowRef.current.style.cursor = "none"
            setShowTools(false)
        }, 1500)
    }

    function start() {
        cancelAnimationFrame(timerId.current);
        let lastTime = 0;
        const interval = 50
        const loop = (timestamp) => {
            if (!isPlaying) return;
            if (timestamp - lastTime >= interval) {
                if (!drawTrace) {
                    cleanCanvas()
                }
                update(file.circles, canvasRef.current.getContext('2d'), dduCenter, shape);
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


    function chooseCenter(e) {
        if (!isCentering) return
        let scale = window.getComputedStyle(canvasRef.current).getPropertyValue('transform').split(',')[3]
        const rect = e.target.getBoundingClientRect();
        const x = (rect.left / scale - e.clientX / scale) * -1
        const y = (rect.top / scale - e.clientY / scale) * -1
        const transformX = dduCenter[0] - (-canvasRef.current.width / 2 + x)
        const transformY = dduCenter[1] - (-canvasRef.current.height / 2 + y)
        setDduCenter([transformX, transformY])
        setCentering(false)
    }




    useEffect(() => {
        if (isPlaying && file.circles.length !== 0) {
            start()
        } else cancelAnimationFrame(timerId.current);
    }, [isPlaying, dduCenter, drawTrace, shape, file])

    useEffect(
        () => {
            if (file.length == 0) return
            cleanCanvas()
            file.backgroundColor !== null ?
                canvasRef.current.style.backgroundColor = file.backgroundColor
                : canvasRef.current.style.backgroundColor = 'auto'

            if (file.bestCenter !== null) {
                setDduCenter([
                    (canvasRef.current.width) / 2 - file.bestCenter.x,
                    (canvasRef.current.height) / 2 - file.bestCenter.y
                ])
            }
            setShape(file.shape)
            setDrawTrace(file.drawTrace)
        }, [file]
    )
    useEffect(() => {
        centering()
        enableDragScroll(canvasWindowRef.current, canvasRef.current)

        setDduCenter([
            (canvasRef.current.width - canvasWindowRef.current.offsetWidth - dduCenter[0]) / 2,
            (canvasRef.current.height - canvasWindowRef.current.offsetHeight - dduCenter[1]) / 2
        ])
    }, [])

    useEffect(() => {
        isCentering ? canvasRef.current.style.cursor = 'crosshair' : canvasRef.current.style.cursor = ''
    }, [isCentering])

    useEffect(() => {
        canvasRef.current.style.transform = 'scale(' + scale + ')'
    }, [scale])

    return (
        <div className="DduCanvas">
            <div
                className='DduCanvas__window'
                ref={canvasWindowRef}
                onMouseMove={mouseMoveHandle}


            >
                <Toolbar
                    isActive={showTools}
                    fullScreen={() => fullScreenToggle(canvasWindowRef.current)}
                    centering={centering}
                    cleanCanvas={cleanCanvas}
                    isCentering={isCentering}
                    setCentering={setCentering}
                    zoom={(scaleStep) => {
                        if (scale < 0.55 && scaleStep < 0) {
                            return
                        } else if (scale > 2.95 && scaleStep > 0) {
                            return
                        } else setScale(scale + scaleStep)
                    }}
                />
                <canvas
                    onDoubleClick={() => fullScreenToggle(canvasWindowRef.current)}
                    className="DduCanvas__canvas"
                    ref={canvasRef}
                    onClick={e => chooseCenter(e)}
                    id="dduCanvas"
                    width='4000px'
                    height='2000px'
                ></canvas>
            </div>
        </div>

    );
})

export default DduCanvas