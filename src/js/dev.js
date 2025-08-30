import { parseDdu } from "./dodeca-parser.js";
import {dodecaView} from "./dodeca-view.js"

let btn = document.getElementById('btn')
let input = document.getElementById('file1')


btn.addEventListener('click',  () => {
   readFile(input.files[0])    
});


function readFile(file /*file from input*/) {

    let result
    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
        console.log(parseDdu(reader.result));
        
        dodecaView(parseDdu(reader.result))
    };

    reader.onerror = function () {
        result = reader.error
    };

}

