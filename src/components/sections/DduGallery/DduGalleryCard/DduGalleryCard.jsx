import currentDduStore from '../../../../store/dduPlayerStore/currentDduStore'
import './DduGalleryCard.sass'

const DduGalleryCard = ({ dduName, dduPath = '' }) => {
    const getDduFromDB = currentDduStore.getDduFromDB

    const imgPath = `url(https://raw.githubusercontent.com/olegmyltsev/AestheticGeometry/main/src/Ddu/dduImg/${encodeURI(dduName)}.png)`

    function cardClickHandle() {getDduFromDB(dduPath, dduName)}

    return (
        <div className='DduGalleryCard' onClick={cardClickHandle}>
            <div
                className="DduGalleryCard__img"
                style={{ backgroundImage: imgPath }}
            >
            </div>
            <div className="DduGalleryCard__header">{dduName}</div>
        </div>
    )
}

export default DduGalleryCard