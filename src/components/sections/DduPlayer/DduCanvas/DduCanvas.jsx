import React, { useEffect, useRef } from "react";
import { parseDdu, Circle } from "./functions/dduParser";
import { update } from "./functions/dodeca-view";





export default function DduCanvas(props) {
    const canvasRef = useRef(null);
    let file = parseDdu(props.file)
    const timerId = useRef(null);

    function start() {
        clearTimeout(timerId.current);

        update(file, canvasRef.current.getContext('2d'))

        timerId.current = setTimeout(() => {
            if (props.isPlaying) {
                start();
            }
        }, 1000);
    }

    useEffect(() => {
        if (props.isPlaying) {
            start();
        } else {
            clearTimeout(timerId.current);
        }

        return () => {
            clearTimeout(timerId.current);
        };
    }, [props.isPlaying])



    return (
        <canvas ref={canvasRef} id="dduCanvas" width="1138" height="864">

        </canvas>
    );
}
