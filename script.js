const template = document.querySelectorAll('.template');
const templateButtons = document.querySelectorAll('.template-buttons');

template.forEach((template, index) => {
    template.addEventListener("mouseenter", () => {
        templateButtons[index].classList.remove('hide')
    })
    template.addEventListener("mouseleave", () => {
        templateButtons[index].classList.add('hide')
    })
})


