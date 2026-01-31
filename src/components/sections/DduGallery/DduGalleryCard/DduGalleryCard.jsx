
import currentDDU from '../../../../store/dduPlayerStore/currentDDU'
import './DduGalleryCard.sass'



const DduGalleryCard = ({ name, path = '' }) => {
    const { getDdu, updateFile } = currentDDU

    function cardClickHandle() {
        getDdu(path).then((data) => updateFile(name, data))

    }
    console.log('https://raw.githubusercontent.com/olegmyltsev/AestheticGeometry/dev/src/Ddu/dduImg/' + encodeURI(name) + '.png');
    

    return (
        <div className='DduGalleryCard' onClick={cardClickHandle}>

            <div className="cardImg" style={{
                backgroundImage: 'url(https://raw.githubusercontent.com/olegmyltsev/AestheticGeometry/dev/src/DduStorage/dduImg/' + encodeURI(name) + '.png)'
            }}>
            </div>
            <div className="cardHeader">{name}</div>
        </div>
    )
}

export default DduGalleryCard