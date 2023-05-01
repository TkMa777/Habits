'use strict'

let habbits = []
const HABBIT_KEY = 'HABBIT_KEY'
let globalActiveHabbitId;

// page
const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover-bar'),
    },
    content: {
        daysContainer: document.getElementById('days'),
        nextDay: document.querySelector('.habbit__day')
    },
    popup: {
        index: document.getElementById('add-habbit_popup'),
        iconFiled: document.querySelector('.popup__form input[name="icon"]')
    }
}



// utils 

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


function togglePopup() {
    if (page.popup.index.classList.contains('cover_hidden')) {
        page.popup.index.classList.remove('cover_hidden')
    } else {
        page.popup.index.classList.add('cover_hidden')
    }
}

function resetForm(form, fields) {
    for (const field of fields) {
        form[field].value = ''
    }
}

// the function validateAndGetFormData does two jobs for validation and for data, no good.
// they are strongly related
function validateAndGetFormData(form, fields) {
    const formData = new FormData(form)
    const res = {};
    for (const field of fields) {
        const fieldValue = formData.get(field)
        form[field].classList.remove('error')
        if (!fieldValue) {
            form[field].classList.add('error')
         }
         res[field] = fieldValue
    }
    let isValid = true
    for (const field of fields) {
        if (!res[field]) {
            isValid = false
        }
    }
    if (!isValid) {
        return
    }
    return res
}

// render

function rerenderMenu(activeHabbit) {
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

function rerenderHead(activeHabbit) {
    page.header.h1.innerText = activeHabbit.name;
    const progress = activeHabbit.days.length / activeHabbit.target > 1 
        ? 100
        : activeHabbit.days.length / activeHabbit.target * 100
    page.header.progressPercent.innerText = progress.toFixed(0) + ' %';
    page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`)
}

function rerenderContent(activeHabbit) {
    page.content.daysContainer.innerHTML = ''
    for (const index in activeHabbit.days) {
        const element = document.createElement ('div')
        element.classList.add('habbit')
        element.innerHTML = `<div class="habbit__day">Day ${Number(index) + 1}</div>
             <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
            <button class="habbit__delete" onclick="deleteDay(${index})">
                 <img src="images/Delete.svg" alt="Delete day${index + 1}">
            </button>`
            page.content.daysContainer.appendChild(element)
    } 
    page.content.nextDay.innerHTML = `Dar ${activeHabbit.days.length + 1}`
}

function rerender (activeHabbitId) {
    globalActiveHabbitId = activeHabbitId
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    if(!activeHabbit) {
        return
    }
    document.location.replace(document.location.pathname + '#' + activeHabbitId) // hach
    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderContent(activeHabbit)
}

// work with days

function addDays(event) {
    event.preventDefault()
    const data = validateAndGetFormData(event.target, ['comment'])
    if (!data) {
        return
    }
    // const form = event.target
    // // console.log(event)
    // const data = new FormData(form)
    // //console.log(data.getAll('comment'))
    // const comment = data.get('comment')
    // //console.log(form)
    // form['comment'].classList.remove('error')
    // if (!comment) {
    //    form['comment'].classList.add('error')
    // }
    // //console.log(globalActiveHabbit)
    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            return {
                ...habbit,
                days: habbit.days.concat([{comment: data.comment}])
            }
        }
        return habbit
    });
    resetForm(event.target, ['comment'])
    // form['comment'].value = ''
    rerender(globalActiveHabbitId)
    saveData()
}
    

function deleteDay (index) {
    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            habbit.days.splice(index, 1)
            return {
                ...habbit,
                days: habbit.days
            }
        }
        return habbit
    })
    rerender(globalActiveHabbitId)
    saveData()
}

// working with habbits

// page.header.h1.addEventListener('click', function () {
//     console.log(this)
// })

function setIcon (context, icon) {
    page.popup.iconFiled.value = icon
    const activeIcon = document.querySelector('.icon.icon_active')
    activeIcon.classList.remove('icon_active')
    context.classList.add('icon_active')
    //console.log(context)
}

function addHabbit (event) {
    event.preventDefault()

    const data = validateAndGetFormData(event.target, ['name', 'icon', 'target'])
     if (!data) {
         return
    }
    const maxId = habbits.reduce((acc, habbit) => acc > habbit.id ? acc : habbit.id, 0)
    habbits.push({
        id: maxId +1,
        name: data.name,
        target: data.target,
        icon: data.icon,
        days: []
    });
    resetForm(event.target, ['name', 'target'])
    togglePopup()
    saveData()
    rerender(maxId + 1)
 }

 


// init

(() => {
    loadData()
    const hashId = Number(document.location.hash.replace('#', ''))
    const urlHabbit = habbits.find(habbit => habbit.id == hashId)
    if (urlHabbit) {
        rerender(urlHabbit.id)
    } else {
        rerender(habbits[0], id)
    }
    
}) ();