import { makeAutoObservable, toJS} from "mobx"

import readFile from "../../utils/readFileForm.js";
import parseDdu from "../../utils/dodeca-parser.js";


class targetDDU {
    name = ''
    content = ''

    constructor() {
        makeAutoObservable(this)
    }

    updateFile = (value) => {
        this.name = value.name
        readFile(value)
            .then((result) => {
                if (!result) return false
                this.content = parseDdu(result)                
                return true
            })
    }
}
export default new targetDDU()