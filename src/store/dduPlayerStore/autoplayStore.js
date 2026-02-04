import { makeAutoObservable } from "mobx";


class autoplayStore{
    isAutoplayOn = false

    constructor(){makeAutoObservable(this)}

    toggleIsAutoplay = (option)=>{
        this.isAutoplayOn = option
    }

    
}

export default new autoplayStore()