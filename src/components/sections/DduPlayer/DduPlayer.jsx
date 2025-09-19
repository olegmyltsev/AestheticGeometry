import React, { useState } from "react";
import "./DduPlayer.sass"
import DduCanvas from "./DduCanvas/DduCanvas";



function DduPlyer(props) {

    async function readFile(file) {
        if (typeof file != 'object') return;
        if (file.name.split('.').pop() !== 'ddu') {
            alert('Неизвестный тип файла.');
            return;
        }

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

    const [file, setFile] = useState('')
    const [isPlaying, setIsPlayng] = useState(false)
    return (
        <section className="DduPlayer">
            <div className="DduPlayer__container">
                <div className="DduPlayer__input">
                    <input type="file" onChange={async (event) => setFile(await readFile(event.target.files[0]))} />
                    <button onClick={() => setIsPlayng(!isPlaying)}>play</button>
                </div>
                <DduCanvas file={file} isPlaying={isPlaying}/>
            </div>
        </section>
    )

}

export default DduPlyer