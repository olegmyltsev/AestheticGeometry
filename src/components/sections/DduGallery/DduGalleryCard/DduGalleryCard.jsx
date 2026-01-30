
import currentDDU from '../../../../store/dduPlayerStore/currentDDU'
import './DduGalleryCard.sass'



const DduGalleryCard = ({ name, path = '' }) => {
    const { getDdu, updateFile } = currentDDU

    function cardClickHandle() {
        getDdu(path).then((data) => updateFile(name, data))

    }

    return (
        <div className='DduGalleryCard' onClick={cardClickHandle}>

            <div className="cardImg" style={{
                backgroundImage: 'url(https://raw.githubusercontent.com/olegmyltsev/AestheticGeometry/21e8040e28df70efa5666a55ebcc8b813972ee0b/src/DduStorage/dduImg/' + encodeURI(name) + '.png)'
            }}>
            </div>
            <div className="cardHeader">{name}</div>
        </div>
    )
}

export default DduGalleryCard