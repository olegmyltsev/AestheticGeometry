export default function zoom(element, chaild) {
    let scale = 1
    element.addEventListener('wheel', (e) => {
        e.preventDefault()
        if (scale < 0.5) {
            scale = 0.5
            return
        } else if (scale > 3) {
            scale = 3
            return
        }
        if (e.deltaY > 0) {
            scale -= 0.05
        } else if (e.deltaY < 0) {
            scale += 0.05

        }
        chaild.style.transform = 'scale(' + scale + ')'
    })
}