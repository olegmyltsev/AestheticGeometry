import { observer } from 'mobx-react-lite'
import currentDduStore from '../../../../../store/dduPlayerStore/currentDduStore'

import readFileForm from '../../../../../utils/readFileForm'


const ChooseFileForm = observer(() => {
    const { name, updateDdu } = currentDduStore

    function fileFormChangeHandle(value) {
        if (!value) return
        readFileForm(value).then((result) => {
            if (!result) return
            updateDdu(value.name, result)
        })
    }

    return (
        <div className="DduPlayer__form">
            <input // Кнопка выбора файла
                // onClick={() => setIsPlaying(false)}
                id="dduFileInput"
                className="DduPlayer__file-input"
                type="file"
                onChange={event => fileFormChangeHandle(event.target.files[0])}
            />
            <label className="DduPlayer__file-input-label" htmlFor="dduFileInput">выбрать файл с устройства</label>
            <span className="DduPlayer__file-name">{name}</span>

        </div>
    )
})

export default ChooseFileForm