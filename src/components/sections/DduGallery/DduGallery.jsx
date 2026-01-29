import { observer } from 'mobx-react-lite'
import './DduGallery.sass'
import DduGalleryCard from './DduGalleryCard/DduGalleryCard'
import cloudDduStore from '../../../store/globalStore/cloudDduStore'


const DduGallery = observer(() => {
    const dduList = cloudDduStore.dduList

    return (
        <div className='DduGallery'>
            <h1>Или выберите додеку из нашей галереи.</h1>
            <div className="container">
                
                {dduList.map((value, index) =>
                    <DduGalleryCard name={value.name} path = {value.path} key={index} />
                )}
            </div>
        </div>
    )
})

export default DduGallery