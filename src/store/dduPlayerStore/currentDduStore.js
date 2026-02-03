import { makeAutoObservable } from "mobx"

import parseDdu from '../../utils/parseDdu'
import cloudDduStore from "../globalStore/cloudDduStore"


class currentDduStore {
    name = ''
    content = ''
    currentDduIndex = null



    constructor() { makeAutoObservable(this) }

    updateDdu = (name, content) => {
        this.name = name
        this.content = parseDdu(content)
        for (let i = 0; i < cloudDduStore.dduList.length; i++) {
            if (cloudDduStore.dduList[i].name == name) {
                this.currentDduIndex = i
                return
            } 
        }
        this.currentDduIndex = null        
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
}
export default new currentDduStore()