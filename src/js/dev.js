import { parseDdu } from "./dodeca-parser.js";
import { start } from "./dodeca-view.js"

let btn = document.getElementById('pause-btn')
let input = document.getElementById('fileDdu')


let result

input.addEventListener('change', ()=> readFile(input.files[0]))



function readFile(file /*file from input*/) {
    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
        start(40, parseDdu(reader.result))
    };

    reader.onerror = function () {
        result = reader.error
    };

}

btn.addEventListener('click', () => {

    console.log(result);
    

});
