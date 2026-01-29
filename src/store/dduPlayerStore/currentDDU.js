import { makeAutoObservable, toJS } from "mobx"

import parseDdu from '../../utils/parseDdu'


class currentDDU {
    name = ''
    content = ''


    constructor() {
        makeAutoObservable(this)

    }

    updateFile = (name, content) => {
        this.name = name
        this.content = parseDdu(content)
        
    }

    async getDdu(path) {
        return fetch(path)
            .then(response => {
                if (!response.ok) throw new Error('Файл не найден');
                return response.text();
            })
            .catch(() => { return '' });
    }
}
export default new currentDDU()