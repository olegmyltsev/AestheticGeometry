(function () {
    var framesNumber = 0;
    const framesLimit = 500;
    const startIndex = getRndInteger(0, ddus.length - 1);
    var dduIndex = startIndex;
    var ddu = ddus[dduIndex];

    const sortedNames = ddusNamesEng.sort();



    var Circle, canvas, canvasCenterX, canvasCenterY, clone, context, dduCircles, json, mainLoop, scale, shiftX, shiftY, step, update, winterDduCircles;

    canvas = document.getElementById('dduCanvas');

    dduName = document.getElementById('dduName');



    const canvasMarginH = 0;
    const canvasMarginV = 0;




    canvas.width = document.body.clientWidth - canvasMarginH;
    canvas.height = window.screen.height - canvasMarginV;
    canvas.style.left = canvasMarginH / 2;



    context = canvas.getContext('2d');

    context.lineWidth = 1;

    canvasCenterX = canvas.width / 2;

    canvasCenterY = canvas.height / 2;


    shiftX = canvasCenterX + 200;

    shiftY = canvasCenterY - 400;

    scale = 0.5;

    clone = function (obj) {
        var key, newInstance;
        newInstance = new obj.constructor();
        for (key in obj) {
            newInstance[key] = obj[key];
        }
        return newInstance;
    };

    Circle = class Circle {
        constructor(x, y, r, rule = "", color1 = "#000000", visible1 = false, fill1 = false) {
            this.color = color1;
            this.visible = visible1;
            this.fill = fill1;
            this.x = (x + shiftX) * scale;
            this.y = (y + shiftY) * scale;
            this.r = r * scale;
            this.r2 = this.r * this.r;
            this.rule = (function () {
                var k, len, results;
                results = [];
                for (k = 0, len = rule.length; k < len; k++) {
                    x = rule[k];
                    results.push(parseInt(x));
                }
                return results;
            })();
        }

        static fromJSON(json) {
            var color, fill, r, rule, visible, x, y;
            ({ x, y, r, rule, color, visible, fill } = json);
            return new Circle(x, y, r, rule, color, visible, fill);
        }


        invert(circle) {
            var d, dx, dy, ratio;
            dx = this.x - circle.x;
            dy = this.y - circle.y;
            d = Math.sqrt(dx * dx + dy * dy);
            ratio = circle.r2 / (d * d - this.r2);
            this.x = circle.x + ratio * dx;
            this.y = circle.y + ratio * dy;
            this.r = Math.abs(this.r * ratio);
            return this.r2 = this.r * this.r;
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
                return context.stroke();
            }
        }

    };

    step = function (circles) {
        var circle, i, j, k, l, len, len1, len2, m, newCircle, newCircles, ref;
        newCircles = (function () {
            var k, len, results;
            results = [];
            for (k = 0, len = circles.length; k < len; k++) {
                circle = circles[k];
                results.push(clone(circle));
            }
            return results;
        })();
        for (k = 0, len = newCircles.length; k < len; k++) {
            newCircle = newCircles[k];
            ref = newCircle.rule;
            for (l = 0, len1 = ref.length; l < len1; l++) {
                j = ref[l];
                newCircle.invert(circles[j]);
            }
        }
        for (i = m = 0, len2 = newCircles.length; m < len2; i = ++m) {
            newCircle = newCircles[i];
            circles[i] = newCircle;
        }
        return newCircles;
    };

    window.addEventListener('load', function () {
        return console.log('Page is loaded');
    });

    dduCircles = (function () {
        var k,
            len,
            results;
        results = [];
        for (k = 0, len = ddu.length; k < len; k++) {
            json = ddu[k];
            results.push(Circle.fromJSON(json));
        }
        return results;
    })()
        ;
    function makeCircles() {
        var k,
            len,
            results;
        results = [];
        for (k = 0, len = ddu.length; k < len; k++) {
            json = ddu[k];
            results.push(Circle.fromJSON(json));
        }
        return results;

    }


    update = function () {
        framesNumber++;
        if (framesNumber >= framesLimit) {
            framesNumber = 0;
            dduIndex++;

            ddu = ddus[dduIndex % ddus.length];
            dduCircles = makeCircles();


        } else {
            var circle, k, len;
            for (k = 0, len = dduCircles.length; k < len; k++) {
                circle = dduCircles[k];
                circle.draw(context);
            }
            dduCircles = step(dduCircles);
        }
    };

    mainLoop = setInterval(update, 40);

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }





}).call(this);