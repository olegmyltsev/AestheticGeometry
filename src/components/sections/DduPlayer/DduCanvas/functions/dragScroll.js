export default function enableDragScroll(element, chaild) {
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
        
        let scale = window.getComputedStyle(chaild).getPropertyValue('transform').split(',')[3]
        const walkX = (x - startX) / scale;
        const walkY = (y - startY) / scale;
        
        element.scrollLeft = scrollLeft - walkX;
        element.scrollTop = scrollTop - walkY;

        chaild.style.transformOrigin = `${
                    element.scrollLeft + element.offsetWidth / 2
                }px ${
                    element.scrollTop + element.offsetHeight / 2
                }px`
    });
}