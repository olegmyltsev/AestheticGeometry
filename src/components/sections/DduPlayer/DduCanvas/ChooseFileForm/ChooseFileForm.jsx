import { observer } from 'mobx-react-lite'
import React from 'react'
import dduFileStore from '../../../../../store/dduPlayerStore/dduFileStore'
import { reaction } from 'mobx'


const ChooseFileForm = observer(() => {
    const {name, updateFile} = dduFileStore

    function fileFormChangeHandle(value) {
        if (!value) return
        updateFile(value)
    }

    reaction(()=>name, (name)=>{console.log(name);
    })
    // useEffect(()=>{console.log(getFile())}, [file.name])

    return (
        <div className="DduPlayer__form">
            <input // Кнопка выбора файла
                // onClick={() => setIsPlaying(false)}
                id="dduFileInput"
                className="DduPlayer__file-input"
                type="file"
                onChange={event => fileFormChangeHandle(event.target.files[0])}
            />
            <label className="DduPlayer__file-input-label" htmlFor="dduFileInput">выбрать файл</label>
            <span className="DduPlayer__file-name">{name}</span>

        </div>
    )
})

export default ChooseFileForm