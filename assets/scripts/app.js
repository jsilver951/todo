// variables
const body = document.querySelector('body');
const itemsList = document.querySelector('#tasks');
const itemStatus = document.querySelector('.status');
const addItems = document.querySelector('.add-items');
const openForm = document.querySelector('.open-button');
const closeForm = document.querySelector('.close-button');
const titleInput = document.getElementById('newTaskTitle');
// const descriptionInput = document.getElementById('newTaskDescription');
const submitInput = document.getElementById('newTaskSubmit');
const completedToggle = document.querySelector('#ShowCompletedTasks');
const tabindex = document.querySelectorAll('.tabindex');
const items = JSON.parse(localStorage.getItem('items')) || [];
let showCompletedToggleState = JSON.parse(localStorage.getItem('showCompletedToggleState')) || false;

// ##########
// FUNCTIONS
// ##########

function isListEmpty(){  
  let notDoneCount = itemsList.querySelectorAll('.task:not(.done)').length;
  let allTaskCount = itemsList.querySelectorAll('.task').length;
  if ( allTaskCount === 0 ){
    itemsList.classList.add('empty');
  } else if ( notDoneCount === 0 && !showCompletedToggleState ) {
    itemsList.classList.add('empty');             
  } else {
    itemsList.classList.remove('empty');
  }
}

function addItem(e) {
  e.preventDefault();
  if (titleInput.value){
    const title = titleInput.value;
    // const description = descriptionInput.value || '';
    const item = {
      title,
      // description,
      done: false
    };
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
    // populateList(title, description);
    populateList(title);
    addItems.reset();
    titleInput.focus();
    updateColor();      
  } else {
    titleInput.classList.add('error');
  } 
  isListEmpty();
}

function setBackgroundColors() { 
  if ( !localStorage.getItem('hue1') ){
    localStorage.setItem('hue1', 0);
  }  
  if ( !localStorage.getItem('hue2') ){
    localStorage.setItem('hue2', 90);
  }
  body.style.setProperty('--hue-1', localStorage.getItem('hue1') ); 
  body.style.setProperty('--hue-2', localStorage.getItem('hue2') );
}

function updateColor(){    
  let hue1 = JSON.parse(parseInt(localStorage.getItem('hue1'))) + 3;  
  localStorage.setItem('hue1', `${hue1}`);
  body.style.setProperty('--hue-1', hue1);   
  let hue2 = JSON.parse(parseInt(localStorage.getItem('hue2'))) + 3;  
  localStorage.setItem('hue2', `${hue2}`);
  body.style.setProperty('--hue-2', hue2); 
}

function populateList(title, description) {
  let newCount = document.querySelectorAll('.task').length;
  itemsList.innerHTML += `
    <li class="task" data-count="${newCount+1}">
      <div class="remove"></div>
      <input type="checkbox" data-index=${newCount} id="item${newCount}" />
      <label for="item${newCount}">${title}</label>
    </li>`;
};

function populateListOnPageLoad(tasks = [], tasksList) {
  if ( localStorage.getItem('items') ){
    tasksList.innerHTML = tasks.map((task, i) => {
      return `
        <li class="task ${task.done ? 'done' : ''}" data-count="${i+1}">
          <div class="remove"></div>
          <input type="checkbox" data-index=${i} id="item${i}" ${task.done ? 'checked' : ''} />
          <label for="item${i}">${task.title}</label>
        </li>`;
    }).join('');
    setToggleClass();
  } 
  isListEmpty();    
}

function setToggleClass() {
  if (localStorage.getItem('showCompletedToggleState') === "true"){
    tasks.classList.add('show-all');
    completedToggle.setAttribute('checked', 'checked');
  } else {
    tasks.classList.remove('show-all');
    completedToggle.removeAttribute('checked');
  };
}

function removeIndex(finishedTask) {   
  const liElements = finishedTask.parentNode.parentNode.getElementsByTagName('li');
  const liElementsLength = liElements.length;
  for (var i = 0; i < liElementsLength; i++) {
    if (liElements[i] == finishedTask) {
      items.splice(i,1);
      localStorage.setItem('items', JSON.stringify(items));
    }
  }
  updateColor();
} 

function ifEnter(e) {
  if (event.which == 13 || event.keyCode == 13) {
    addItem(e);
    return false;
  }
}

function validateTitle() {
  if (titleInput.value){
    titleInput.classList.remove('error');  
    // return true;
  } else {
    titleInput.classList.add('error');  
    // return false;
  }
}

// ##########
// EVENTS
// ##########

// RUNS ON PAGE LOAD -- populate html list with json data
populateListOnPageLoad(items, itemsList);
setBackgroundColors();

// submit new item form
addItems.addEventListener('submit', addItem);
// descriptionInput.addEventListener('keydown', ifEnter);
titleInput.addEventListener('keydown', ifEnter);
titleInput.addEventListener('blur', validateTitle);

// toggle to show done tasks in list
completedToggle.addEventListener('click', function(){
  showCompletedToggleState = !showCompletedToggleState;
  localStorage.setItem('showCompletedToggleState', JSON.stringify(showCompletedToggleState));
  setToggleClass();
  isListEmpty();
});

// remove done task from json data and html list
itemsList.addEventListener('click',function(e){	
    // toggle tasks between normal and done
  if(e.target && e.target.matches('input')){		
    let index = e.target.dataset.index;
    let parent = e.target.parentElement;
    parent.classList.toggle('done');
    items[index].done = !items[index].done;
    localStorage.setItem('items', JSON.stringify(items));
    isListEmpty();
  }
  // remove element when X is presses
  if(e.target && e.target.className == 'remove'){
    let thisLI = e.target.parentNode;
    thisLI.classList.add('remove');
    // remove from JSON
    removeIndex(thisLI);
    // remove from HTML
    window.setTimeout(function(){
      itemsList.removeChild(thisLI);
      let count = document.querySelectorAll('.task');
      for (var i = 0; i < count.length; i++) {
        count[i].setAttribute('data-count',`${i+1}`);        
        count[i].querySelector('input').setAttribute('data-index',`${i}`);
        count[i].querySelector('input').setAttribute('id',`items${i}`);            
        count[i].querySelector('label').setAttribute('for',`items${i}`);
      };      
      isListEmpty();
    }, 250);
  }  
})

// open new task form section
openForm.focus(); // on page load
openForm.addEventListener('click', function(){
  event.preventDefault();
  body.classList.add('opened');  
  for (var i = 0; i < tabindex.length; i++) {
    tabindex[i].tabIndex = 1;
  }  
  window.setTimeout(function(){
    titleInput.focus();
  }, 250);  
});

// close new task form section
closeForm.addEventListener('click', function(){
  event.preventDefault();
  body.classList.remove('opened');  
  for (var i = 0; i < tabindex.length; i++) {
    tabindex[i].tabIndex = -1;
  }
});

// ##########
// SPEECH
// ##########

const voiceInput = document.querySelector('.voice-input');
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
voiceInput.addEventListener('mousedown', function(){  
  recognition.interimResults = true;
  recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');
    titleInput.value = transcript;
    if (e.results[0].isFinal) {
      submitInput.focus();
    }
  });
  recognition.start();
  // TODO -- figure out how to .start while the button is still pressed but .stop when the button is off
  // recognition.addEventListener('end', recognition.stop);
});
voiceInput.addEventListener('mouseup', function(){
  // console.log("mouseup");
  recognition.stop();
  submitInput.focus();
  // TODO -- add a new element that displays the spoken text and allows the user to confirm by voice that's what they said.
  // confirmSpeech();
});