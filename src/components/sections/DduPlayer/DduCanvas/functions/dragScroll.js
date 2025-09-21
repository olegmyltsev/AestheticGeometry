export default function enableDragScroll(element) {
    let isDragging = false;
    let startX, startY;
    let scrollLeft, scrollTop;

    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - element.offsetLeft;
        startY = e.pageY - element.offsetTop;
        scrollLeft = element.scrollLeft;
        scrollTop = element.scrollTop;
        element.style.cursor = 'grabbing';
        element.style.userSelect = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        element.style.cursor = 'grab';
        element.style.userSelect = 'auto';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const x = e.pageX - element.offsetLeft;
        const y = e.pageY - element.offsetTop;
        
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        
        element.scrollLeft = scrollLeft - walkX;
        element.scrollTop = scrollTop - walkY;
    });
}