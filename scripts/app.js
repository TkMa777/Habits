'use strict'


let habbits = []
const HABBIT_KEY = 'HABBIT_KEY'

// page

const page = {
    menu: document.querySelector('.menu__list')
}

/* utils */

function loadData() {
  const habbitsString = localStorage.getItem('HABBIT_KEY')
  const habbitArray = JSON.parse(habbitsString)
//   console.log(habbitArray)
  if (Array.isArray(habbitArray)) {
    habbits = habbitArray
  }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

// render

function rerenderMenu(activeHabbit) {
    
    if(!activeHabbit) {
        return
    }
    // document.querySelector('.menu__list').innerHTML = '';
    for (const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
        if(!existed) {
            //crating
            const element = document.createElement('button');
            element.setAttribute('menu-habbit-id', habbit.id);
            element.classList.add('menu__item');
            element.addEventListener('click', () => rerender(habbit.id));
            element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" />`;
            if (activeHabbit.id === habbit.id) {
                element.classList.add('menu__item_avtive');
            }
            page.menu.appendChild(element);
            continue;
        }
        if (activeHabbit.id === habbit.id) {
            existed.classList.add('menu__item_avtive');
        }else {
            existed.classList.remove('menu__item_avtive');
        }
    }
}



function rerender (activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
        rerenderMenu(activeHabbit);
}
    


// init

(() => {
    loadData()
    rerender(habbits[0].id)
}) ();


