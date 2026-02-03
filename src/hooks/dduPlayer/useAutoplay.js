import { useRef } from "react"
import userActionsStore from "../../store/dduPlayerStore/userActionsStore"
import cloudDduStore from "../../store/globalStore/cloudDduStore"
import currentDduStore from "../../store/dduPlayerStore/currentDduStore"
import autoplayStore from "../../store/dduPlayerStore/autoplayStore"

const delay = 5000

export function useAutoplay() {
    const setAutoplayState = autoplayStore.setAutoplayState

    const isPlaying = userActionsStore.isPlaying
    const ddulist = cloudDduStore.dduList
    const getDduFromDB = currentDduStore.getDduFromDB

    const intervalId = useRef(null)
    const startTime = useRef();
    const remainingTime = useRef(delay)


    function randomElement(list) {
        return list[Math.floor(Math.random() * list.length)]
    }

    function autoplayRandomUpdate() {
        let randomDdu = randomElement(ddulist)
        getDduFromDB(randomDdu.path, randomDdu.name)
        startTime.current = Date.now()
    }

    function autoplayLoop(time) {
        intervalId.current = setTimeout(() => {
            autoplayRandomUpdate()
            autoplayLoop(delay)
        }, time)
    }

    function startAutoplay() {
        setAutoplayState(true)
        // autoplayRandomUpdate()
        autoplayLoop(remainingTime.current)
    }

    function stopAutoplay() {
        setAutoplayState(false)
        console.log('aeaaa');

        clearInterval(intervalId.current)
        remainingTime.current = Date.now() - startTime.current
    }

    return { startAutoplay, stopAutoplay }
    // function carusel() {
    //     getDDU(paths[caruselIndex]).then(text => setFile(parseDdu(text))).then(() => setIsPlaying(true))

    // }

    //     function nextDdu() {
    //     caruselIndex === paths.length - 1 ?
    //         setCaruselIndex(0) :
    //         setCaruselIndex(caruselIndex + 1)
    // }

    // function prevDdu() {
    //     caruselIndex === 0 ?
    //         setCaruselIndex(paths.length-1) :
    //         setCaruselIndex(caruselIndex - 1)
    // }

    // useEffect(() => {
    //     getFilePaths().then((data) => console.log(data))
    // }, [])

    // useEffect(() => {
    //     if (isCaruselOn) {
    //         // carusel()
    //         caruselInterval.start()
    //     }
    // }, [paths])

    // useEffect(() => {
    //     if (isCaruselOn) {
    //         isPlaying ? caruselInterval.resume() : caruselInterval.pause()
    //     }
    // }, [isPlaying])

    // useEffect(() => {
    //     if (!isCaruselOn) {
    //         caruselInterval.reset()
    //     } else if (isCaruselOn) {
    //         caruselInterval.reset()

    //         caruselInterval.start()
    //     }
    // }, [isCaruselOn])
}

