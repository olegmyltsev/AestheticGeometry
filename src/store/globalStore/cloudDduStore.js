import { makeAutoObservable } from "mobx"


class cloudDduStore {
    dduList = [{name: '', path: ''}, {name: '', path: ''}]

    constructor() {
        makeAutoObservable(this)
        this.updateDduList()
    }
    
     async updateDduList(
        url = 'https://api.github.com/repos/olegmyltsev/AestheticGeometry/contents/src/Ddu?ref=main' 
    ) {
        let tempDduList = []
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Файл не найден');
                return response.text();
            })
            .then(text => {
                for (let ddu of JSON.parse(text)) {
                    if (ddu.name.includes('.ddu'))
                        tempDduList.push({
                            name: ddu.name.slice(0, ddu.name.length - 4),
                            path: ddu.download_url
                        })
                }
                
                this.dduList = tempDduList
                return tempDduList
            })
            .catch(() => { return '' });
    }

  
}

export default new cloudDduStore()