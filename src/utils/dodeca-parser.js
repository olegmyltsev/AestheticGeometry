// reference: https://github.com/pier-bezuhoff/dodeca4android/blob/develop/app/src/main/java/com/pierbezuhoff/dodeca/data/Ddu.kt

// -> number or NaN
function readFloat(s) {
    return parseFloat(s.replace(',', '.'));
}

function readBool(s) {
    return s === 'true' || s === 'True' || s === '1' || s === '-1';
}

// <BBGGRR> int string -> css color string
// in hex: "BBGGRR" -> "#RRGGBB"
function readColor(s) {
    const bgr = parseInt(s);
    const b = (bgr >> 16) & 0xff;
    const g = (bgr >> 8) & 0xff;
    const r = bgr & 0xff;
    const rgb = r << 16 | g << 8 | b;
    const cssColor = '#' + rgb.toString(16).padStart(6, '0');
    return cssColor;
}

// -> { x: number, y: number } or null
function readXY(s) {
    const coordinates = s.split(' ');
    

    if (coordinates.length == 2) {
        const x = readFloat(coordinates[0]);
        const y = readFloat(coordinates[1]);
        if (Number.isFinite(x) && Number.isFinite(y)) {
            return { x, y };
        } else {
            return null;
        }
    } else {
        return null;
    }
}

const SHAPES = ["CIRCLE", "SQUARE", "CROSS", "VERTICAL_BAR", "HORIZONTAL_BAR"];

const MODE_NONE = -2;
const MODE_GLOBAL = -1;
// circle parsing
const MODE_EXPECTING_RADIUS = 0;
const MODE_EXPECTING_X = 1;
const MODE_EXPECTING_Y = 2;
const MODE_EXPECTING_COLOR = 3;
const MODE_EXPECTING_FILL = 4;
const MODE_EXPECTING_RULE = 5;
const MODE_EXPECTING_BORDER_COLOR = 6;

// fileContent: string ->
// {
//   backgroundColor: css-color-string,
//   drawTrace: boolean,
//   bestCenter: {x: number, y: number} or null,
//   shape: shape-string,
//   circles: Array<circle-json-object>
// }
export function parseDdu(file) {
    let backgroundColor = "#ffffff"; // white
    let drawTrace = true; // whether to retain old circles drawn on the canvas
    let bestCenter = null; // {x,y} of the center
    let shape = SHAPES[0]; // circle
    const circles = [];
    let circle = {};

    function tryToAddCircle() {
        if ('x' in circle && 'y' in circle && 'r' in circle &&
            !isNaN(circle.x) && !isNaN(circle.y) && !isNaN(circle.r)
        ) {
            if (!('rule' in circle)) {
                circle['visible'] = false;
                circle['rule'] = "";
            }
            if ('visible' in circle) {
                circles.push(circle);
            }
        }
        circle = {};
    }

    let mode = MODE_NONE;
    let nGlobals = 0;
    const content = file;//.getBlob().getDataAsString(); // reads file as a string in Apps Script, adjust in other envs
    for (let rawLine of content.split('\n')) {
        const line = rawLine.trim();
        if (line !== "") {
            if (mode === MODE_GLOBAL) { // read legacy global
                if (nGlobals === 0) {
                    backgroundColor = readColor(line);
                } else if (nGlobals === 3) {
                    drawTrace = readBool(line);
                } else if (nGlobals === 4) {
                    const xy = readXY(line);
                    if (xy !== null) {
                        bestCenter = xy;
                    }
                }
                nGlobals += 1;
                mode = MODE_NONE;
            } else if (line.startsWith("circle")) {
                tryToAddCircle();
                mode = MODE_EXPECTING_RADIUS; // reset circle construction
            } else if (mode === MODE_NONE) { // read new global                                
                if (line.startsWith("global")) {
                    mode = MODE_GLOBAL;
                } else if (line.startsWith("drawTrace:")) {
                    drawTrace = readBool(line.substring(line.indexOf(":") + 1).trim());
                } else if (line.startsWith("bestCenter:")) {
                    const xy = readXY(line.substring(line.indexOf(":") + 1).trim());
                    if (xy !== null) {
                        bestCenter = xy;
                    }
                } else if (line.startsWith("shape:")) {
                    const suffix = line.substring(line.indexOf(":") + 1).trim();                    
                    if (SHAPES.includes(suffix)) {
                        shape = suffix;
                    }
                }
            } else { // circle internals mode (>= 0)
                // read circle line
                if (mode === MODE_EXPECTING_RADIUS) {
                    circle['r'] = readFloat(line);
                } else if (mode === MODE_EXPECTING_X) {
                    circle['x'] = readFloat(line);
                } else if (mode === MODE_EXPECTING_Y) {
                    circle['y'] = readFloat(line);
                } else if (mode === MODE_EXPECTING_COLOR) {
                    circle['color'] = readColor(line);
                } else if (mode === MODE_EXPECTING_FILL) {
                    circle['fill'] = readBool(line);
                } else if (mode === MODE_EXPECTING_RULE) { // ['n']<rule>
                    if (line.startsWith('n')) {
                        circle['visible'] = false;
                        circle['rule'] = line.substring(1);
                    } else {
                        circle['visible'] = true;
                        circle['rule'] = line;
                    }
                } else if (mode === MODE_EXPECTING_BORDER_COLOR && line.startsWith("borderColor:")) {
                    circle['borderColor'] = readColor(line.substring(line.indexOf(':') + 1));
                }
                mode += 1;
            }
        }
    }
    tryToAddCircle();
    // console.log(`parsed ddu file into ${circles.length} circles with ${JSON.stringify({ backgroundColor, drawTrace, bestCenter, shape})}`);
    return { backgroundColor, drawTrace, bestCenter, shape, circles };
}
