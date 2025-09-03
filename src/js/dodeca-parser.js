




export function parseDdu(file) {
    const circles = [];
    let circle = {};

    function readFloat(s) {
        return parseFloat(s.replace(',', '.'));
    }

    function readBool(s) {
        return s === 'true' || s === '1';
    }


    // in hex: BBGGRR -> "#RRGGBB"
    function readColor(s) {
        const bgr = parseInt(s);
        const b = (bgr >> 16) & 0xff;
        const g = (bgr >> 8) & 0xff;
        const r = bgr & 0xff;
        const rgb = r << 16 | g << 8 | b;
        const cssColor = '#' + rgb.toString(16).padStart(6, '0');
        return cssColor;
    }

    function addCircle() {
        if ('x' in circle && 'y' in circle && 'r' in circle) {
            if (!('rule' in circle)) {
                circle['visible'] = false;
                circle['rule'] = "";
            }
            if ('visible' in circle) {
                circles.push(circle);
            }
        }
    }

    const content = file
    let paramLine = -1;
    for (let line of content.split('\n')) {
        line = line.trim();
        if (line.startsWith("circle")) {
            addCircle();
            paramLine = 0;
            circle = {};
        } else if (paramLine >= 0) {
            if (paramLine == 0)
                circle['r'] = readFloat(line);
            else if (paramLine == 1)
                circle['x'] = readFloat(line);
            else if (paramLine == 2)
                circle['y'] = readFloat(line);
            else if (paramLine == 3)
                circle['color'] = readColor(line);
            else if (paramLine == 4)
                circle['fill'] = readBool(line);
            else if (paramLine == 5) { // ['n']<rule>
                if (line.startsWith('n')) {
                    circle['visible'] = false;
                    circle['rule'] = line.substring(1);
                } else if (line != "") {
                    circle['visible'] = true;
                    circle['rule'] = line;
                }
            }
            paramLine += 1;
        }
    }
    addCircle();
    // console.log(`parsed ddu file into ${circles.length} circles`);
    return circles;
}




