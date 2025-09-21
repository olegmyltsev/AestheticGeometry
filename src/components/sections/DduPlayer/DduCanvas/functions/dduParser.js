export class Circle{
    constructor(x, y, r, rule = "", color = "#000000", visible = false, fill = false) {
        this.color = color;
        this.visible = visible;
        this.fill = fill;
        this.x = x + 5000
        this.y = y + 5000
        this.r = r
        this.r2 = this.r * this.r;
        this.rule = rule.split('').map((c) => parseInt(c));
    }

    static fromJSON(json) {
        const { x, y, r, rule, color, visible, fill } = json;
        return new Circle(x, y, r, rule, color, visible, fill);
    }

    // invert *this* with respect to the *circle*
    invert(circle) {
        const dx = this.x - circle.x;
        const dy = this.y - circle.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const ratio = circle.r2 / (d * d - this.r2);
        this.x = circle.x + ratio * dx;
        this.y = circle.y + ratio * dy;
        this.r = Math.abs(this.r * ratio);
        this.r2 = this.r * this.r;
    }

    draw(context) {
        if (this.visible) {
            context.beginPath();
            context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            if (this.fill) {
                context.fillStyle = this.color;
                context.fill();
            }
            context.strokeStyle = this.color;
            context.stroke();
        }
    }
}


function readFloat(s) {
    return parseFloat(s.replace(',', '.'));
}
function readColor(s) {
    const bgr = parseInt(s);
    const b = (bgr >> 16) & 0xff;
    const g = (bgr >> 8) & 0xff;
    const r = bgr & 0xff;
    // eslint-disable-next-line
    const rgb = r << 16 | g << 8 | b;
    const cssColor = '#' + rgb.toString(16).padStart(6, '0');
    return cssColor;
}

export function parseDdu(file) {
    file = file.split('circle:')
    file.shift()
    let circle = {}
    let circles = []
    for (let circleArr of file) {

        circleArr = circleArr.trim().split('\n')

        circle = {
            'r': readFloat(circleArr[0]),
            'x': readFloat(circleArr[1]),
            'y': readFloat(circleArr[2]),
            'color': readColor(circleArr[3]),
            'fill': circleArr[4] === 'true' || circleArr[4] === '1',
            'visible': '',
            'rule': ''
        }

        if (typeof (circleArr[5]) == 'string') {
            if (circleArr[5].startsWith('n')) {
                circle['visible'] = false;
                circle['rule'] = circleArr[5].substring(1);
            } else {
                circle['visible'] = true;
                circle['rule'] = circleArr[5];
            }
        } else {
            circle['visible'] = false;
            circle['rule'] = "";
        }
        if ('x' in circle && 'y' in circle && 'r' in circle && 'visible' in circle) {
            circle = Circle.fromJSON(circle)
            circles.push(circle);
        }
    }
    
    return circles
}

// import fs from 'node:fs';
// fs.readFile('/Oleg/Programming/Work/aesthetic-geometry/Asters.ddu', 'utf8', (err, data) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log(myParseDdu(data))
// });