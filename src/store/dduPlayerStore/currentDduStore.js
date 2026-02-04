import { makeAutoObservable } from "mobx"

import parseDdu from '../../utils/parseDdu'
import cloudDduStore from "../globalStore/cloudDduStore"

class currentDduStore {
    name = ''
    content = ''
    indexInDduList = null

    constructor() { makeAutoObservable(this) }

    updateDdu = (name, content) => {
        this.name = name
        this.content = parseDdu(content)
        for (let i = 0; i < cloudDduStore.dduList.length; i++) {
            if (cloudDduStore.dduList[i].name === this.name) {
                this.indexInDduList = i                
                return
            }
        }
    }

    getDduFromDB = async (path, name) => {
        return fetch(path)
            .then(response => {
                if (!response.ok) throw new Error('Файл не найден');
                return response.text();
            })
            .then((response) => {
                this.updateDdu(name, response)
            })
            .catch(() => { return '' });
    }


    getNextDdu = () => {
        const dduList = cloudDduStore.dduList
        let nextDduIndex
        this.indexInDduList === dduList.length - 1 ? nextDduIndex = 0 : nextDduIndex = this.indexInDduList + 1
        this.getDduFromDB(dduList[nextDduIndex].path, dduList[nextDduIndex].name, nextDduIndex)
        return
    }

    getPrevDdu = () => {
        const dduList = cloudDduStore.dduList
        let prevDduIndex
        this.indexInDduList === 0 ? prevDduIndex = dduList.length - 1 : prevDduIndex = this.indexInDduList - 1
        this.getDduFromDB(dduList[prevDduIndex].path, dduList[prevDduIndex].name, prevDduIndex)
        return
    }
}
export default new currentDduStore()