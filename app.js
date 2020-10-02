const tableBody = document.querySelector('tbody')
const form = document.querySelector('#todo')
const newItem = document.querySelector('#item')

function createItem (item, previousElementSibling) {
    let noTD = 4
    let TD = 1
    let newRow = document.createElement('tr')
    while(TD <= noTD ) {
        let newTD = document.createElement('td')
        if (TD === 1) {
            newRow.appendChild(newTD)
            if (previousElementSibling) {
               let itemID = parseInt(previousElementSibling.dataset.id) + 1
                newTD.dataset.id = itemID
            }
        }
        if (TD === 2) {
           newTD.innerText = item
           newRow.appendChild(newTD)
        }
        if (TD === 3) {
            let button = document.createElement('button')
            button.innerText = 'x'
           newTD.appendChild(button)
           newRow.appendChild(newTD)
        }
        if (TD === 4) {
            let checkBox = document.createElement('input')
            checkBox.type = 'checkbox'
           newTD.appendChild(checkBox)
           newRow.appendChild(newTD)
        }
        TD++
    }
   
    return newRow
}

function placeholderItem() {
    let placeHolderRow = document.createElement('tr')
    let newTD = document.createElement('td')
    let newLink = document.createElement('a')
    newLink.href = '#item'
    newLink.innerText = 'Add an item to the list'
    newTD.colSpan = '4'
    newTD.appendChild(newLink)
    placeHolderRow.id = 'placeholder-row'
    placeHolderRow.appendChild(newTD)
    return placeHolderRow
}

function addPlaceHolder() {
    if (!tableBody.childElementCount) {
        tableBody.appendChild(placeholderItem())
    }
}

function removePlaceHolder(placeHolderRow) {
    if (placeHolderRow) {
        placeHolderRow.remove()
    }
}
function addItemToList(item) {
    tableBody.appendChild(item)
}

function removeItemFromList(target) {
    target.parentNode.parentNode.remove()
}
function setTodoIndices(indexList) {
    for (let index = 0; index < indexList.length; index++) {
        indexList[index].innerText = index + 1;
        indexList[index].dataset.id = index + 1
    }
}

function toggleCrossItem(target) {
    const listItem = target.parentNode.previousElementSibling.previousElementSibling
    if (target.checked) {
       // console.log('Checked')
       listItem.style.textDecoration = 'line-through'
       listItem.previousElementSibling.style.textDecoration = 'line-through'
    } else {
        listItem.style.textDecoration = ''
        listItem.previousElementSibling.style.textDecoration = ''
    }
}

function removeElmentFromArray(position, array) {
    position -= 1
    return array.filter(function(item, index){
      return position != index
    })
  }

function getStoredItems() {
    const todoItems = JSON.parse(localStorage.getItem('todoItems'))
    todoItems.forEach((item, index) => {
        const newTodo = createItem(item.value)
        if (item.isDone) {
            newTodo.children[0].style.textDecoration = 'line-through'
            newTodo.children[1].style.textDecoration = 'line-through'
            newTodo.children[3].firstElementChild.setAttribute('checked', '')// = true
        }
        tableBody.appendChild(newTodo)
        const todoIndices =  document.querySelectorAll('tr td:nth-child(1)')
        setTodoIndices(todoIndices)
    });
}

function updateStoredItems(options) {
    const todoItems = JSON.parse(localStorage.getItem('todoItems'))
    if (options.type === 'addItem') {
        todoItems.push({
            value: options.value,
            isDone: false
        })
        localStorage.setItem('todoItems', JSON.stringify(todoItems))
    }
    if (options.type === 'deleteItem') {
        let itemID = parseInt(options.target.dataset.id)
        let remainderList = removeElmentFromArray(itemID, todoItems)
        localStorage.setItem('todoItems', JSON.stringify(remainderList))
    }
    if (options.type === 'crossedItem') {
        const idLocation = options.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling    
        let itemID = parseInt(idLocation.dataset.id) - 1
        if (options.target.checked) {
            todoItems[itemID].isDone = true
        } else {
            todoItems[itemID].isDone = false
        }
        localStorage.setItem('todoItems', JSON.stringify(todoItems))
    }
}

tableBody.addEventListener('click', function (event) {
    const isCheckBox = event.target.tagName === 'INPUT'? true : false
    const isButton = event.target.tagName === 'BUTTON'? true : false
    if (isButton) {
        removeItemFromList(event.target)
        const idLocation = event.target.parentNode.previousElementSibling.previousElementSibling
        updateStoredItems({
            type: 'deleteItem',
            target: idLocation
        })
        const todoIndices =  document.querySelectorAll('tr td:nth-child(1)')
        setTodoIndices(todoIndices)
        addPlaceHolder()
    }
    
    if (isCheckBox) {
        const idLocation = event.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling
        updateStoredItems({
            type: 'crossedItem',
            target:  event.target
        })

        toggleCrossItem(event.target)
    }
})

form.addEventListener('submit', function (event) {
    event.preventDefault()
    
    const placeHolderRow =  document.querySelector('#placeholder-row')
    removePlaceHolder(placeHolderRow)
    const newTodo = createItem(newItem.value)
    addItemToList(newTodo)
    updateStoredItems({
        type: 'addItem',
        value: newItem.value,
        isDone: false
    })
    form.reset()
    const todoIndices =  document.querySelectorAll('tr td:nth-child(1)')
    setTodoIndices(todoIndices)
})

document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('todoItems')) {
        getStoredItems()
        addPlaceHolder()
    } else {
        localStorage.setItem('todoItems', JSON.stringify([]))
        addPlaceHolder()
    }
    
})