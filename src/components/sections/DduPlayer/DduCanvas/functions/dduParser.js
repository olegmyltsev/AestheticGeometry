// Константы для магических чисел
const CANVAS_OFFSET = 5000;
const DEFAULT_RULE = "";
const DEFAULT_COLOR = "#000000";
const DEFAULT_VISIBLE = false;
const DEFAULT_FILL = false;

export class Circle {
    constructor(x, y, r, rule = DEFAULT_RULE, color = DEFAULT_COLOR, visible = DEFAULT_VISIBLE, fill = DEFAULT_FILL) {
        this.color = color;
        this.visible = visible;
        this.fill = fill;
        this.x = x + CANVAS_OFFSET; // Выносим смещение в константу
        this.y = y + CANVAS_OFFSET;
        this.r = r;
        this.r2 = r * r; // Используем переданный r вместо this.r
        this.rule = this.parseRule(rule); // Выносим парсинг правила в отдельный метод
    }

    static fromJSON(json) {
        // Деструктуризация с значениями по умолчанию
        const { x, y, r, rule = DEFAULT_RULE, color = DEFAULT_COLOR, visible = DEFAULT_VISIBLE, fill = DEFAULT_FILL } = json;
        return new Circle(x, y, r, rule, color, visible, fill);
    }

    // Парсинг правила вынесен в отдельный метод для читаемости
    parseRule(rule) {
        return rule ? rule.split('').map(c => parseInt(c, 10)) : [];
    }

    // invert *this* with respect to the *circle*
    invert(circle) {
        const dx = this.x - circle.x;
        const dy = this.y - circle.y;
        const dSquared = dx * dx + dy * dy;
        
        // Избегаем вычисления квадратного корня где возможно
        const ratio = circle.r2 / (dSquared - this.r2);
        
        this.x = circle.x + ratio * dx;
        this.y = circle.y + ratio * dy;
        this.r = Math.abs(this.r * ratio);
        this.r2 = this.r * this.r;
    }

    draw(context) {
        if (!this.visible) return; // Ранний возврат
        
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        
        if (this.fill) {
            context.fillStyle = this.color;
            context.fill();
        }
        
        context.strokeStyle = this.color;
        context.stroke();
    }
}

// Вспомогательные функции
function readFloat(s) {
    return parseFloat(s.replace(',', '.'));
}

function readColor(s) {
    const bgr = parseInt(s, 10);
    // Используем битовые операции для извлечения компонентов
    const r = (bgr) & 0xff;
    const g = (bgr >> 8) & 0xff;
    const b = (bgr >> 16) & 0xff;
    
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function parseBoolean(value) {
    return value === 'true' || value === '1' || value === '-1';
}

function parseVisibilityAndRule(ruleStr = "") {
    if (!ruleStr) return { visible: false, rule: "" };
    
    const visible = !ruleStr.startsWith('n');
    const rule = visible ? ruleStr : ruleStr.substring(1);
    
    return { visible, rule };
}

export function parseDdu(file = '') {
    if (!file.trim()) return []; // Ранний возврат для пустого файла
    
    const circles = [];
    const circleSections = file.split('circle:').slice(1); // Объединяем split и slice
    
    for (const section of circleSections) {
        const lines = section.trim().split('\n');
        
        // Валидация минимального количества строк
        if (lines.length < 5) continue;
        
        const { visible, rule } = parseVisibilityAndRule(lines[5]);
        
        const circleData = {
            r: readFloat(lines[0]),
            x: readFloat(lines[1]),
            y: readFloat(lines[2]),
            color: readColor(lines[3]),
            fill: parseBoolean(lines[4]),
            visible,
            rule
        };
        
        // Проверяем обязательные поля
        if (circleData.x != null && circleData.y != null && circleData.r != null) {
            circles.push(Circle.fromJSON(circleData));
        }
    }
    
    return circles;
}