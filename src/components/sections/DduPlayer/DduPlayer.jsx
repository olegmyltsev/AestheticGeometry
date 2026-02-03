import "./DduPlayer.sass"
import DduCanvas from "./DduCanvas/DduCanvas";
import ChooseFileForm from "./DduCanvas/ChooseFileForm/ChooseFileForm.jsx";




const DduPlayer = (props) => {

    return (
        <section className="DduPlayer">
            <div className="DduPlayer__container">
                <DduCanvas />
                <ChooseFileForm />
            </div>
        </section>
    )
}


export default DduPlayer