import { createContext, useEffect, useState } from "react";
import "./DduPlayer.sass"
import DduCanvas from "./DduCanvas/DduCanvas";
import { parseDdu } from "./DduCanvas/functions/dduParser";

export const IsPlayingContext = createContext(false)

function DduPlayer(props) {
    const [file, setFile] = useState('')
    const [isPlaying, setIsPlaying] = useState(false)
    const [fileName, setFileName] = useState('Файл не выбран')

    async function readFile(file) {
        if (typeof file != 'object') return;
        if (file.name.split('.').pop().toLowerCase() !== 'ddu') {
            alert('Неизвестный тип файла.');
            return '';
        }
        setFileName(file.name)
        try {
            const content = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsText(file);
            });

            return content; // Вернет Promise, который разрешится в string
        } catch (error) {
            console.error('Ошибка чтения файла:', error);
            alert(`Ошибка чтения файла:` + error)
            throw error;
        }
    }

    function togglePlaying() {
        if (file === '') return
        setIsPlaying(!isPlaying)
    }

    useEffect(() => {
        if (file === '') return
        setIsPlaying(true);
    }, [file])

    return (
        <section className="DduPlayer">
            <div className="DduPlayer__container">
                <div className="DduPlayer__form">
                    <input
                        id="dduFileInput"
                        className="DduPlayer__file-input"
                        type="file"
                        onChange={async (event) => {
                            const fileContent = await readFile(event.target.files[0]);
                            setFile(parseDdu(fileContent));
                        }}
                    />
                    <label className="DduPlayer__file-input-label" htmlFor="dduFileInput">выбрать файл</label>
                    <span className="DduPlayer__file-name">{fileName}</span>

                </div>
                <IsPlayingContext value={isPlaying} >
                    <DduCanvas file={file} pause={togglePlaying} />
                </IsPlayingContext>
            </div>
        </section>
    )

}

export default DduPlayer