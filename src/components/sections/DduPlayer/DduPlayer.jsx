import { createContext, useEffect, useRef, useState } from "react";
import "./DduPlayer.sass"
import DduCanvas from "./DduCanvas/DduCanvas";
import { parseDdu } from "../../../utils/dodeca-parser.js";
import { getFilePaths, getDDU } from "../../../hooks/dduPlayer/getDDU.js";
import readFile from "../../../utils/readFileForm.js";
import { useInterval } from "../../../hooks/globalHooks/useInterval.jsx";


// Глобальный IsPlaying
export const DduPlayerContext = createContext({})

function DduPlayer(props) {
    const [file, setFile] = useState('') // Состояние файла
    const [isPlaying, setIsPlaying] = useState(false) // Проигрывается ли?
    const [fileName, setFileName] = useState('Файл не выбран') // Имя файла для отображения на сайте
    const [paths, setPaths] = useState([])
    const [isCaruselOn, setIsCaruselOn] = useState(true)
    const [caruselIndex, setCaruselIndex] = useState(0)


    const caruselInterval = useInterval(nextDdu, 30000)
    function carusel() {
        getDDU(paths[caruselIndex]).then(text => setFile(parseDdu(text))).then(() => setIsPlaying(true))
        
    }


    function togglePlaying() {
        !file ? setIsPlaying(false) :
            setIsPlaying(!isPlaying)
    }

    function fileFormChangeHandle(value) {
        if (!value) return
        setFileName(value.name)
        readFile(value)
            .then((result) => {
                if (!result) return false
                setFile(parseDdu(result))
                caruselInterval.reset()
                setIsCaruselOn(false)
                return true
            })
            .then(play => setIsPlaying(play))
    }

    function nextDdu() {
        caruselIndex === paths.length - 1 ?
            setCaruselIndex(0) :
            setCaruselIndex(caruselIndex + 1)
    }

    function prevDdu() {
        caruselIndex === 0 ?
            setCaruselIndex(paths.length-1) :
            setCaruselIndex(caruselIndex - 1)
    }

    useEffect(carusel, [caruselIndex])

    useEffect(() => {
        getFilePaths().then((data) => setPaths(data))
    }, [])

    useEffect(() => {
        if (isCaruselOn) {
            carusel()
            caruselInterval.start()
        }
    }, [paths])

    useEffect(() => {
        if (isCaruselOn) {
            isPlaying ? caruselInterval.resume() : caruselInterval.pause()
        }
    }, [isPlaying])

    useEffect(() => {
        if (!isCaruselOn) {
            caruselInterval.reset()
        } else if (isCaruselOn) {
            caruselInterval.reset()

            caruselInterval.start()
        }
    }, [isCaruselOn])

    return (
        <section className="DduPlayer">
            <div className="DduPlayer__container">
                <div className="DduPlayer__form">
                    <input // Кнопка выбора файла
                        onClick={() => setIsPlaying(false)}
                        id="dduFileInput"
                        className="DduPlayer__file-input"
                        type="file"
                        onChange={event => fileFormChangeHandle(event.target.files[0])}
                    />
                    <label className="DduPlayer__file-input-label" htmlFor="dduFileInput">выбрать файл</label>
                    <span className="DduPlayer__file-name">{fileName}</span>

                </div>
                <DduPlayerContext value={{ isPlaying, isCaruselOn, setIsCaruselOn, nextDdu, prevDdu }} >
                    <DduCanvas file={file} pause={togglePlaying /*Файл и функция паузы прокидываются вниз */} />
                </DduPlayerContext>
            </div>
        </section>
    )

}


export default DduPlayer