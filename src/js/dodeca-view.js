const canvas = document.getElementById("dduCanvas");
const context = canvas.getContext("2d");
context.lineWidth = 1;
const canvasCenterX = canvas.width / 2;
const canvasCenterY = canvas.height / 2;

// 
const shiftX = canvasCenterX - 640 + 300;
const shiftY = canvasCenterY - 400;
const scale = 0.5; // Math.min(canvas.height/800, canvas.width/1280)



// class Figure {
//     constructor(x, y, rule = "", color, visible = false, file = false) {
//         this.color = color;
//         this.visible = visible;
//         this.fill = fill;
//         this.x = x
//         this.y = y
//         this.rule = rule.split('').map((c) => parseInt(c));
//     }
// }

// // let rect = new Figure
// Класс "фигура",
// все последующие классы наследуют её основные свойства

class Circle {
    constructor(x, y, r, rule = "", color = "#000000", visible = false, fill = false) {
        this.color = color;
        this.visible = visible;
        this.fill = fill;
        this.x = (x + shiftX) * scale;
        this.y = (y + shiftY) * scale;
        this.r = r * scale;
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

function clone(obj) {
    const newInstance = new obj.constructor();
    for (const key in obj) {
        newInstance[key] = obj[key];
    }
    return newInstance;
}

function updateCircles(circles) {
    const newCircles = circles.map((circle) => clone(circle));
    for (const newCircle of newCircles) {
        for (const j of newCircle.rule) {
            newCircle.invert(circles[j]);
        }
    }
    for (let i = 0, len = newCircles.length; i < len; i++) {
        const newCircle = newCircles[i];
        circles[i] = newCircle;
    }
}


function update(file) {
    for (const circle of file) {
        circle.draw(context);
    }
    updateCircles(file);
}


export function start(delay, file) {
    let dduCircles = file.map((json) => Circle.fromJSON(json));
    const mainLoop = setInterval(() => update(dduCircles), delay);
}

