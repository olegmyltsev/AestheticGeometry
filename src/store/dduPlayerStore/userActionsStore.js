import { makeAutoObservable } from "mobx";
import targetDDU from "./targetDDU";

const SHAPES = ["CIRCLE", "SQUARE", "CROSS", "VERTICAL_BAR", "HORIZONTAL_BAR"]

class userActionsStore {
    isPlaying = false
    shape = 'CIRCLE'
    drawTrace = true

    constructor() {
        makeAutoObservable(this)
    }

    togglePlaying = (option = !this.isPlaying) => {
        if (!targetDDU.content) return
        this.isPlaying = option
    }

    setShape = (option) => {
        if (SHAPES.includes(option)) {
            this.shape = option
        }
    }

    setDrawTrace = (option) => {
        if (typeof(option) !== 'boolean') return
        this.drawTrace = option
    }
}

export default new userActionsStore()