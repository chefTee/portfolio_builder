const template = document.querySelectorAll('.template');
const templateButtons = document.querySelectorAll('.template-buttons');
const hero = document.querySelector('.hero')
const smallScreen = document.querySelector('.small-screen-menu');
const menuButton = document.querySelector('.menu-bar-btn');
const cancelButton = document.querySelector('.cancel-btn');

template.forEach((template, index) => {
    template.addEventListener("mouseenter", () => {
        templateButtons[index].classList.remove('hide')
    })
    template.addEventListener("mouseleave", () => {
        templateButtons[index].classList.add('hide')
    })
})


menuButton.addEventListener('click', () => {
  smallScreen.classList.remove('hide');
  hero.classList.add('hide');
});

cancelButton.addEventListener('click', () => {
  hero.classList.remove('hide');
  smallScreen.classList.remove('hide');
});


