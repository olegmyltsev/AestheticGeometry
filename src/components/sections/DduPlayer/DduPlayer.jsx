import { createContext, useEffect, useRef, useState } from "react";
import "./DduPlayer.sass"
import DduCanvas from "./DduCanvas/DduCanvas";
import { parseDdu } from "../../../utils/dodeca-parser.js";
import {getFilePaths,  getDDU } from "../../../hooks/dduPlayer/getDDU.js";
import readFile from "../../../utils/readFileForm.js";


// Глобальный IsPlaying
export const IsPlayingContext = createContext(false)

function DduPlayer(props) {
    const [file, setFile] = useState('') // Состояние файла
    const [isPlaying, setIsPlaying] = useState(false) // Проигрывается ли?
    const [fileName, setFileName] = useState('Файл не выбран') // Имя файла для отображения на сайте
    const caruselTimeout = useRef(null)

    function carusel(paths) {
        function fethDDU() {
            clearTimeout(caruselTimeout.current)
            getDDU(paths[index])
                .then(text => setFile(parseDdu(text)))
                .then(() => {
                    setIsPlaying(true)
                    caruselTimeout.current = setTimeout(() => {
                        fethDDU()
                    }, 30000)
                })
            index = Math.floor(Math.random() * paths.length)
        }
        let index = Math.floor(Math.random() * paths.length)
        fethDDU()
    }


    function togglePlaying() {
        !file ? setIsPlaying(false) :
            setIsPlaying(!isPlaying)
    }

    function fileFormChangeHandle(value) {
        if (!value) return
        clearTimeout(caruselTimeout.current)
        setFileName(value.name)
        readFile(value)
            .then((result) => {
                if (!result) return false
                setFile(parseDdu(result))
                return true
            })
            .then(result => setIsPlaying(result))
    }


    useEffect(() => {
        getFilePaths().then((data) => carusel(data))
    }, [])

    useEffect(() => {
        if (isPlaying && fileName === 'Файл не выбран') {
            getFilePaths().then((data) => carusel(data))
        } else {
            clearTimeout(caruselTimeout.current)
        }
    }, [isPlaying])

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
                <IsPlayingContext value={isPlaying} >
                    <DduCanvas file={file} pause={togglePlaying /*Файл и функция паузы прокидываются вниз */} />
                </IsPlayingContext>
            </div>
        </section>
    )

}


export default DduPlayer