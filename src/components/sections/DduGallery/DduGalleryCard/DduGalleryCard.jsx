
import currentDDU from '../../../../store/dduPlayerStore/currentDDU'
import './DduGalleryCard.sass'



const DduGalleryCard = (props) => {
    const {getDdu, updateFile} = currentDDU

    function cardClickHandle(){
        getDdu(props.path).then((data)=>updateFile(props.name, data))
    }

    return (
        <div className='DduGalleryCard' onClick={cardClickHandle}>{props.name}</div>
    )
}

export default DduGalleryCard