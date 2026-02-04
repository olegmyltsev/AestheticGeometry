import { observer } from 'mobx-react-lite'
import currentDduStore from '../../../../store/dduPlayerStore/currentDduStore'
import './DduGalleryCard.sass'
import autoplayStore from '../../../../store/dduPlayerStore/autoplayStore'

const DduGalleryCard = observer(({ dduName, dduPath = '', index }) => {
    const { getDduFromDB, indexInDduList } = currentDduStore
    const toggleIsAutoplay = autoplayStore.toggleIsAutoplay

    const imgPath = `url(https://raw.githubusercontent.com/olegmyltsev/AestheticGeometry/main/src/Ddu/dduImg/${encodeURI(dduName)}.png)`

    function cardClickHandle() {
        toggleIsAutoplay(false)
        getDduFromDB(dduPath, dduName)
    }

    return (
        <div className={`DduGalleryCard ${index === indexInDduList ? " DduGalleryCard-chosen" : ''}`} onClick={cardClickHandle}>
            <div
                className="DduGalleryCard__img"
                style={{ backgroundImage: imgPath }}
            >
            </div>
            <div className="DduGalleryCard__header">{dduName}</div>
        </div>
    )
})

export default DduGalleryCard