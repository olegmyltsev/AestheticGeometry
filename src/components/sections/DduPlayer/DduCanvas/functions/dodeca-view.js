


function clone(obj) {
    const newInstance = new obj.constructor();
    for (const key in obj) {
        newInstance[key] = obj[key];
    }
    return newInstance;
}

function invert(circle, inverter) {
    const dx = circle.x - inverter.x;
    const dy = circle.y - inverter.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    const ratio = (inverter.r * inverter.r) / (d * d - circle.r * circle.r);
    circle.x = inverter.x + ratio * dx;
    circle.y = inverter.y + ratio * dy;
    circle.r = Math.abs(circle.r * ratio);
    circle.r2 = circle.r * circle.r;
}


async function updateCircles(circles) {
    const newCircles = circles.map((circle) => clone(circle));

    for (const newCircle of newCircles) {
        for (const j of newCircle.rule) {
            invert(newCircle, circles[j]);
        }
    }
    for (let i = 0, len = newCircles.length; i < len; i++) {
        const newCircle = newCircles[i];
        circles[i] = newCircle;
    }

}

function draw(circle, context, shapeMethod) {
    context.beginPath();
    shapeMethod(context, circle)
    if (circle.fill) {
        context.fillStyle = circle.color;
        context.fill();
    }
    context.strokeStyle = circle.color;
    context.stroke();
}

export function update(file, context, center, shape) {
    for (const circle of file) {
        if (circle.visible) {
            if (shape === "SQUARE") {
                function shapeMethod(context, circle) {
                    context.rect(circle.x + center[0] - circle.r, circle.y + center[1] - circle.r, circle.r * 2, circle.r * 2)
                }
                draw(circle, context, shapeMethod)
            } else if (shape === "CROSS") {
                function shapeMethod(context, circle) {
                    context.moveTo(circle.x + center[0] - circle.r, circle.y + center[1]);
                    context.lineTo(circle.x + center[0] + circle.r, circle.y + center[1]);
                    context.moveTo(circle.x + center[0], circle.y + center[1] - circle.r);
                    context.lineTo(circle.x + center[0], circle.y + center[1] + circle.r);
                }
                draw(circle, context, shapeMethod)
            } else if (shape === "VERTICAL_BAR") {
                function shapeMethod(context, circle) {
                    context.moveTo(circle.x + center[0], circle.y + center[1] - circle.r);
                    context.lineTo(circle.x + center[0], circle.y + center[1] + circle.r);
                }
                draw(circle, context, shapeMethod)
            } else if (shape === "HORIZONTAL_BAR") {
                function shapeMethod(context, circle) {
                    context.moveTo(circle.x + center[0] - circle.r, circle.y + center[1]);
                    context.lineTo(circle.x + center[0] + circle.r, circle.y + center[1]);
                }
                draw(circle, context, shapeMethod)
            } else {
                function shapeMethod(context, circle) {
                    context.arc(circle.x + center[0], circle.y + center[1], circle.r, 0, 2 * Math.PI, false);
                }
                draw(circle, context, shapeMethod)
            }
        }
    }
    updateCircles(file);
}


