
import currentDDU from '../../../../store/dduPlayerStore/currentDDU'
import './DduGalleryCard.sass'



const DduGalleryCard = ({name, path}) => {
    const {getDdu, updateFile} = currentDDU

    function cardClickHandle(){
        getDdu(path).then((data)=>updateFile(name, data))
        console.log(typeof(path));
        
    }

    return (
        <div className='DduGalleryCard' onClick={cardClickHandle}>
            <div className="cardHeader">{name}</div>
            <div className="cardImg" style={{backgroundImage: 'url ('+path+')'}}></div>
        </div>
    )
}

export default DduGalleryCard