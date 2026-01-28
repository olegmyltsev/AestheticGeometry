import { observer } from 'mobx-react-lite'
import React from 'react'
import targetDDU from '../../../../../store/dduPlayerStore/targetDDU'


const ChooseFileForm = observer(() => {
    const {name, updateFile} = targetDDU

    // useEffect(()=>{console.log(getFile())}, [file.name])

    return (
        <div className="DduPlayer__form">
            <input // Кнопка выбора файла
                // onClick={() => setIsPlaying(false)}
                id="dduFileInput"
                className="DduPlayer__file-input"
                type="file"
                onChange={event => {
                    const e = event.target.files[0]
                    if (!e) return
                    updateFile(e)
                }}
            />
            <label className="DduPlayer__file-input-label" htmlFor="dduFileInput">выбрать файл</label>
            <span className="DduPlayer__file-name">{name}</span>

        </div>
    )
})

export default ChooseFileForm