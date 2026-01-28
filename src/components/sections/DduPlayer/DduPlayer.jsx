import { createContext, useEffect, useState } from "react";
import "./DduPlayer.sass"
import DduCanvas from "./DduCanvas/DduCanvas";
import { getFilePaths } from "../../../hooks/dduPlayer/getDDU.js";
import { useInterval } from "../../../hooks/globalHooks/useInterval.jsx";
import { observer } from "mobx-react-lite";
import ChooseFileForm from "./DduCanvas/ChooseFileForm/ChooseFileForm.jsx";
import userActionsStore from "../../../store/dduPlayerStore/userActionsStore.js";



export const DduPlayerContext = createContext({})

const DduPlayer= observer((props) => {
    const {isPlaying} = userActionsStore
    const [paths, setPaths] = useState([])
    const [isCaruselOn, setIsCaruselOn] = useState(true)
    const [caruselIndex, setCaruselIndex] = useState(0)


    const caruselInterval = useInterval(nextDdu, 30000)

    // function carusel() {
    //     getDDU(paths[caruselIndex]).then(text => setFile(parseDdu(text))).then(() => setIsPlaying(true))
        
    // }


  
    

    function nextDdu() {
        caruselIndex === paths.length - 1 ?
            setCaruselIndex(0) :
            setCaruselIndex(caruselIndex + 1)
    }

    function prevDdu() {
        caruselIndex === 0 ?
            setCaruselIndex(paths.length-1) :
            setCaruselIndex(caruselIndex - 1)
    }

    // useEffect(carusel, [caruselIndex])

    useEffect(() => {
        getFilePaths().then((data) => setPaths(data))
    }, [])

    useEffect(() => {
        if (isCaruselOn) {
            // carusel()
            caruselInterval.start()
        }
    }, [paths])

    useEffect(() => {
        if (isCaruselOn) {
            isPlaying ? caruselInterval.resume() : caruselInterval.pause()
        }
    }, [isPlaying])

    useEffect(() => {
        if (!isCaruselOn) {
            caruselInterval.reset()
        } else if (isCaruselOn) {
            caruselInterval.reset()

            caruselInterval.start()
        }
    }, [isCaruselOn])

    return (
        <section className="DduPlayer">
            <div className="DduPlayer__container">
                <ChooseFileForm />
                <DduPlayerContext value={{ isPlaying, isCaruselOn, setIsCaruselOn, nextDdu, prevDdu }} >
                    <DduCanvas />
                </DduPlayerContext>
            </div>
        </section>
    )

})


export default DduPlayer