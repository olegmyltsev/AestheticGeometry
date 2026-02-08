import { useEffect, useRef } from "react"
import cloudDduStore from "../../store/globalStore/cloudDduStore"
import currentDduStore from "../../store/dduPlayerStore/currentDduStore"
import autoplayStore from "../../store/dduPlayerStore/autoplayStore"

const delay = 30000

export function useAutoplay() {
    const { isAutoplayOn } = autoplayStore

    const dduList = cloudDduStore.dduList
    const getDduFromDB = currentDduStore.getDduFromDB
    const intervalId = useRef(null)


    // function randomElement(list) {
    //     return list[Math.floor(Math.random() * list.length)]
    // }

    function autoplayRandomUpdate() {
        let randomDdu = dduList[Math.floor(Math.random() * dduList.length)]
        getDduFromDB(randomDdu.path, randomDdu.name)
    }

    function autoplayLoop() {
        intervalId.current = setTimeout(() => {
            autoplayRandomUpdate()
            autoplayLoop()
        }, delay)
    }

    function startAutoplay() {
        autoplayRandomUpdate()
        autoplayLoop()
    }

    function stopAutoplay() {
        clearInterval(intervalId.current)
    }


    useEffect(() => {
        isAutoplayOn ? startAutoplay() : stopAutoplay()
    }, [isAutoplayOn])

    // return { startAutoplay, stopAutoplay }
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

