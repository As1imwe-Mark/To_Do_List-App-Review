import './style.css';
import { add } from "./Modules/add.js";
import { clear } from './Modules/clear.js';
import { save } from "./Modules/save.js";
import { loadList } from './Modules/load.js';
import { iconToggle } from './Modules/iconToggle.js';
import { del } from './Modules/remove.js';
import { complete } from './Modules/status.js';
import { clearAll } from './Modules/clearAll.js';
import { refresh } from './Modules/refresh.js';
import { edit } from './Modules/edit';

let list = [];


function populate() {
  const itemList = document.querySelector('.list-items');
  const item = document.querySelector('.item-input');

  item.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      add(list);
      const newItem = list[list.length - 1];
      const newItemElement = document.createElement('li');
      newItemElement.innerHTML = `
        <input class="check" type="checkbox" data-id="${newItem.index}">
        <span class='txt'>${newItem.description}</span>
        <span>
          <i class="menu fa">&#xf142;</i>
          <i data-id="${newItem.index}" class="delete hide fa">&#xf014;</i>
        </span>
      `;
      itemList.appendChild(newItemElement);
      save(list);
      clear();
     
      
      iconToggle()
      del(list);
      edit(list)
    }
  });
  
}

populate();
refresh();
clearAll(list);
complete(list);

window.onload = () => {
  
  loadList()
  edit(list);
};

export class Items {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }
}

import { del } from "./remove";
import { save } from "./save";
class Items {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }
}
export function add(list) {
  const item = document.querySelector('.item-input');
  const itemValue = item.value.trim();
  if (itemValue === '') {
    return;
  } else {
    const index = list.length;
    const item_ = new Items(itemValue, false, index);
    list.push(item_);
    item_.index = list.length;
    save(list);
    del(list)
  }
}

export const clear = () => {
  document.querySelector('.item-input').value = '';
};

import { save } from "./save";

export const clearAll = (list) => {
  const clear = document.querySelector('.clear');
  clear.addEventListener('click', (e) => {
    e.preventDefault()
    const completedTasks = list.filter((task) => task.completed === true);
    completedTasks.forEach((completedTask) => {
      const index = list.indexOf(completedTask);
      list.splice(index, 1);
    });
    save(list);
    location.reload();
  });
};

import { save } from "./save";

export function edit(list) {
  const description = document.querySelectorAll('.txt');
  description.forEach(txt => {
    txt.addEventListener('dblclick', () => {
      const oldValue = txt.textContent;
      txt.contentEditable = true;
      txt.focus();

      txt.addEventListener('blur', () => {
        const newValue = txt.textContent;
        txt.contentEditable = false;

        if (newValue !== oldValue) {
          const key = txt.parentElement.querySelector('.check').dataset.id;
          const itemIndex = list.findIndex(item => item.index.toString() === key);
          if (itemIndex !== -1) {
            list[itemIndex].description = newValue;
            save(list);
          }
        }
      });
    });
  });
}

export function iconToggle() {
  const menuItems = document.querySelectorAll('.menu');

  menuItems.forEach((menuItem) => {
    const deleteIcon = menuItem.nextElementSibling;

    menuItem.addEventListener('click', (e) => {
      const targetMenuItem = e.target;
      const parentListItem = targetMenuItem.parentElement.parentElement;

      parentListItem.classList.toggle('color');
      targetMenuItem.classList.add('hide');
      deleteIcon.classList.remove('hide');
    });
  });
}

import { iconToggle } from "./iconToggle";
import { complete } from "./status";
import { del } from "./remove";
import { save } from "./save";
import { edit } from "./edit";
let index=0;
let list=[];
export const loadList=() =>{
  const itemList=document.querySelector('.list-items');
  const storedList = JSON.parse(localStorage.getItem('Todo' || []));
  itemList.innerHTML = '';
  if (storedList) {
    list = storedList;
    let listHtml = '';
    list.forEach((item) => {
      listHtml += `<li><input class='check' type="checkbox" data-id="${item.index}"><span class='txt'>${item.description}</span><span><i class="menu fa">&#xf142;</i><i data-id="${item.index}" class="delete hide fa">&#xf014;</i></span></li>`;
      index=list.length;
    })
    itemList.innerHTML = listHtml;
    save(list)
   
  }else {
    list;
    index;
  }

 iconToggle();
 del(list);
 complete(list);
 edit(list);

}

export function refresh (){
  const refreshBtn=document.querySelector('.refresh');
  refreshBtn.addEventListener('click',()=>{
    location.reload();
  })
}

import { save } from "./save";

export function del(list) {
  const itemList = document.querySelector('.list-items');
  itemList.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('delete')) {
      const listItem = e.target.closest('li');
      if (listItem && itemList.contains(listItem)) {
        itemList.removeChild(listItem);
        const id = parseInt(e.target.getAttribute('data-id'));
        const index = list.findIndex(item => item.index === id);
        if (index !== -1) {
          list[index].index--;
          for (let i = index + 1; i < list.length; i++) {
            list[i].index--;
          }
          list.splice(index, 1);
          save(list);
        }
      }
    }
  });
}

export function save (list) {
  localStorage.setItem('Todo', JSON.stringify(list));
}

import { save } from "./save";

export function complete(list) {
  const itemList = document.querySelector('.list-items');
  const storedList = JSON.parse(localStorage.getItem('list')) || [];
  list.forEach((item, index) => {
    if (storedList[index] && storedList[index].completed) {
      item.completed = true;
    }
  });

  itemList.addEventListener('click', function (e) {
    if (e.target.classList.contains('check')) {
      const id = parseInt(e.target.getAttribute('data-id'));
      const index = list.findIndex(item => item.index === id);
      if (index !== -1) {
        list[index].completed = !list[index].completed;
        e.target.nextElementSibling.classList.toggle('finished');
        save(list);
        e.target.checked = list[index].completed;
      }
    }
  });

  list.forEach((item) => {
    const checkbox = document.querySelector(`[data-id="${item.index}"]`);
    const label = checkbox.nextElementSibling;
    checkbox.checked = item.completed;
    if (item.completed) {
      label.classList.add('finished');
    }
  });
}



