import { createContext, useEffect, useRef, useState } from "react";
import "./DduPlayer.sass"
import DduCanvas from "./DduCanvas/DduCanvas";
import { parseDdu } from "./DduCanvas/functions/dodeca-parser.js";
import getFilePaths from "../../../hooks/useDduGet.jsx";


// Глобальный IsPlaying
export const IsPlayingContext = createContext(false)

function DduPlayer(props) {
    const [file, setFile] = useState('') // Состояние файла
    const [isPlaying, setIsPlaying] = useState(false) // Проигрывается ли?
    const [fileName, setFileName] = useState('Файл не выбран') // Имя файла для отображения на сайте
    const caruselInterval = useRef(null)

    function carusel(paths) {
        function fethDDU() {            
            fetch(paths[i])
                .then(response => {
                    if (!response.ok) throw new Error('Файл не найден');
                    return response.text();
                })
                .then(text => setFile(parseDdu(text)))
                .catch(error => console.error('Ошибка:', error));
            i=Math.floor(Math.random()*paths.length)
        }
        let i = 0
        fethDDU()
        if (file === '') {
            caruselInterval.current = setInterval(() => {
                fethDDU()
            }, 30000)
        }
    }

    async function readFile(file) {
        // Проверка типа файла
        if (file.name.split('.').pop().toLowerCase() !== 'ddu') {
            alert('Неизвестный тип файла.');
            return false;
        }
        setFileName(file.name) // Изменение имени
        try {
            // Асинхронное чтение файла
            const content = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsText(file);
            });

            return content; // Возвращает контент из файла
        } catch (error) {
            console.error('Ошибка чтения файла:', error);
            alert(`Ошибка чтения файла`)
            throw error; // Или ошибку
        }
    }

    //  Функция пуск/пауза
    function togglePlaying() {
        if (!file) { // Проверка на пустой файл
            setIsPlaying(false)

        } else setIsPlaying(!isPlaying)
    }

    //  Запускает проигрывание сразу при выборе файла
    useEffect(() => {
        if (!file) return
        setIsPlaying(true);

    }, [file])


    // useEffect(() => {
    //     if (typeof (paths) !== 'object') return
    //     carusel()
    // }, [paths])

    useEffect(() => {
        getFilePaths().then((data) => carusel(data))
    }, [])

    return (
        <section className="DduPlayer">
            <div className="DduPlayer__container">
                <div className="DduPlayer__form">
                    <input // Кнопка выбора файла
                        onClick={() => setIsPlaying(false)}
                        id="dduFileInput"
                        className="DduPlayer__file-input"
                        type="file"
                        onChange={async (event) => {
                            // Начинается чтение сразу при выборе файла
                            if (!event.target.files[0]) return

                            const fileContent = await readFile(event.target.files[0]);
                            if (!fileContent) return // Если файл пустой, выход  
                            setFile(parseDdu(fileContent)) // Или обновляется состояние                         
                        }}
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