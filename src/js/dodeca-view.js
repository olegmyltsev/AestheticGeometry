export function dodecaView(ddu) {
    const canvas = document.getElementById("dduCanvas");
    const context = canvas.getContext("2d");
    context.lineWidth = 1;
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;
    // old bestCenter = (640, 400)
    const shiftX = canvasCenterX - 640 + 300;
    const shiftY = canvasCenterY - 400;
    const scale = 0.5; // Math.min(canvas.height/800, canvas.width/1280)

    class Circle {
        constructor(x, y, r, rule = "", color = "#000000", visible = false, fill = false) {
            this.color = color;
            this.visible = visible;
            this.fill = fill;
            this.x = (x + shiftX) * scale;
            this.y = (y + shiftY) * scale;
            this.r = r * scale;
            this.r2 = this.r * this.r;
            // this.rule = parseInt(rule)
            this.rule = rule.split('').map((c) => parseInt(c));
        }

        static fromJSON(json) {
            const { x, y, r, rule, color, visible, fill } = json;
            return Circle(x, y, r, rule, color, visible, fill);
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

    const winterDduCircles = [
        new Circle(-920.753173828125, 1866.708740234375, 1859.665708492877),
        new Circle(-901.8592529296875, 1878.81103515625, 1854.104930797163),
        new Circle(468.9537048339844, 340.31658935546875, 339.07684691208505, "01"),
        new Circle(468.5248718261719, 345.0711669921875, 335.5959384049609, "01"),
        new Circle(1388.179443359375, -3772.58935546875, 4538.483459205404, "2301"),
        new Circle(1767.4017333984375, -5054.71484375, 5872.806895318434, "2301"),
        new Circle(677.2852783203125, 879.8759765625, 63.33096624273902, "45452301", "#200020", true, true),
        new Circle(663.2559814453125, 889.6435546875, 56.01607696333538, "45452301", "#0000ff", true, true),
        new Circle(369.8866882324219, 806.8751220703125, 299.7592443917674, "45452301", "#80ffff", true),
    ];

    // let dduCircles = winterDduCircles;
    const dduCircles = ddu.map((json) => new Circle(json.x, json.y, json.r, json.rule, json.color, json.visible, json.fill));

    function update() {
        for (const circle of dduCircles) {
            circle.draw(context);
        }
        updateCircles(dduCircles);
    }

    const delayMilliseconds = 40;
    const mainLoop = setInterval(update, delayMilliseconds);
}


