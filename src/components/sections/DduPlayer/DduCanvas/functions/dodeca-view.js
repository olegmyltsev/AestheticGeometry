

// const canvas = document.getElementById("dduCanvas");
// const context = canvas.getContext("2d");
// context.lineWidth = 1;
// const canvasCenterX = canvas.width / 2;
// const canvasCenterY = canvas.height / 2;

// // 
// const shiftX = canvasCenterX - 640 + 300;
// const shiftY = canvasCenterY - 400;
// const scale = 0.5; // Math.min(canvas.height/800, canvas.width/1280)



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


export function update(file, context) {
    
    for (const circle of file) {
        circle.draw(context);
    }
    updateCircles(file);
}


