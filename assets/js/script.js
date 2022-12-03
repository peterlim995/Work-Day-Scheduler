// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
});


var currentDayEl = $('#currentDay');
var containerEl = $('#container');
var begin = 9; // begining time of work is 9 am 
var end = 17; // ending time of work is 5 pm
var total = end-begin+1; // total working hour : 9 hours

// console.log("Begin");

// display current time
function displaytime(){
  var showDate = dayjs().format('dddd, MMMM D ');
  currentDayEl.text(showDate);   
}

// Read schedule from local storage and returns array of schedule
// Returns an array that has no content inside if there aren't any schedule.
function readScheduleFromStorage(){
  var schedules = JSON.parse(localStorage.getItem('schedules'));

  if(schedules !== null){
    // console.log("exist!");
    return schedules;
  }else {
    // console.log("Not exist!")
    schedules = [];
    for (let i = 0; i < total; i++) {
      schedules.push('');      
    }    
  }
  return schedules;
}

// Get schedule data from local storage and displays it.
function printScheduleData(){

  containerEl.empty();

  var schedules = readScheduleFromStorage();

  var indexHour = begin; // begining time work
  var totalWorkingHour = total; // total working hours

  for (let i = 0; i < totalWorkingHour; i++) {
    var schedule = schedules[i];
    
    // get hour of today
    var currentHour = parseInt(dayjs().format('H'));
    // console.log("Current Hour: "+currentHour);
    
    // if schedule hour is passed class is past
    // if schedule hour is passed class is present
    // if schedule hour is passed class is future
    if(indexHour < currentHour){
      var divRow = $('<div id="hour-'+ indexHour+ '" class="row time-block past">');
    } else if(indexHour === currentHour){
      var divRow = $('<div id="hour-'+ indexHour+ '" class="row time-block present">');
    } else {
      var divRow = $('<div id="hour-'+ indexHour+ '" class="row time-block future">');
    }
    
    // If hour is less than 12 put AM
    // If hour is 12PM
    // If hour is more than 12 put PM
    if(indexHour < 12){
      var divHour = $('<div class="col-2 col-md-1 hour text-center py-3">'+ indexHour +'AM</div>');
    } else if (indexHour === 12){
      var divHour = $('<div class="col-2 col-md-1 hour text-center py-3">'+ indexHour +'PM</div>');
    } else {
      var divHour = $('<div class="col-2 col-md-1 hour text-center py-3">'+ (indexHour - 12) +'PM</div>');
    }

    // display schedule description
    var textDescription = $('<textarea class="col-8 col-md-10 description" rows="3">'+ schedule +'</textarea>');
    
    // Save Btn
    // Setting data-index attr as beginHour
    var saveBtn = $('<button class="btn saveBtn col-2 col-md-1" aria-label="save" data-index="'+indexHour+'"><i class="fas fa-save" aria-hidden="true"></i></button>');

     // append elements to DOM to display them
    divRow.append(divHour, textDescription, saveBtn);
    containerEl.append(divRow);

    indexHour++;  // for next hour
  }
}


// Take an array of schedules and saves them in localStorage.
function saveScheduleToStorage(schedules){
    localStorage.setItem('schedules',JSON.stringify(schedules));

}


// Show message on the top of the list after save
function showMessage(){
  
  var message = $('<div>');
  message.addClass('text-center align-middle my-3 bg-success p-2 text-white bg-opacity-75 w-25 m-auto');  
  message.attr('id','message');
  message.text("Schedule is Saved!✔");

  containerEl.prepend(message);

  clearMessage();
}

// Clear the message after certain time
function clearMessage() {
  
  var time = 3;  // 3 seconds
  var timerInterval = setInterval(function() {
    time--;
    
    if(time === 0) {
      clearInterval(timerInterval);
      containerEl.empty();
      printScheduleData();
    }

  }, 1000);
}

// Adds a schedule to local storage and prints the schedule data
function handleSaveSchedule(){

  // Getting data-index attr from the button
  var dataIndex = $(this).attr('data-index');
  // console.log("dataIndex: "+dataIndex);

  // find <div id="hour-(dataIndex)">
  var textArea = containerEl.children('#hour-'+dataIndex);
  // console.log("textArea: "+textArea);

  // Getting textarea value
  var description = textArea.children('textarea').val().trim();
  // console.log("description: "+description);

  // Getting old schedule from local storage
  var schedules = readScheduleFromStorage();

  // decide the updateing index
  var updateIndex = dataIndex - begin;

  // replace schedule description
  schedules.splice(updateIndex,1,description);
  
  // save updated schedules to local storage
  saveScheduleToStorage(schedules);

  // print new schedule data
  printScheduleData();
  
  // show save message
  showMessage();
}


printScheduleData();

// When click the save button 
containerEl.on('click', '.btn', handleSaveSchedule);

displaytime();

setInterval(displaytime, 1000);



