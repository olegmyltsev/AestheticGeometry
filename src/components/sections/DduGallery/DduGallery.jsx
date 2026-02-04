import { observer } from 'mobx-react-lite'
import './DduGallery.sass'
import DduGalleryCard from './DduGalleryCard/DduGalleryCard'
import cloudDduStore from '../../../store/globalStore/cloudDduStore'


const DduGallery = observer(() => {
    const dduList = cloudDduStore.dduList

    return (
        <div className='DduGallery'>
            <h1>Галерея додек</h1>
            <div className="DduGallery__container">
                {dduList.map((value, index) => {        
                    return <DduGalleryCard dduName={value.name} dduPath = {value.path} index={index} key={index} />
                }
                )}
            </div>
        </div>
    )
})

export default DduGallery