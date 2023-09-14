

// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(document).ready(function() {

    // localStorage.clear();

    displayCurrentDay();
    setInterval(displayCurrentDay, 1000);
    displayCorrectHour();
    setInterval(displayCorrectHour, 1000);

    function displayCurrentDay(){

        var day = dayjs().format('D');
        var suffix = renderSuffix(day);
        
        //I used this rather convoluted way of displaying the date because I was having trouble when using other ways of displaying it. 
        var date = dayjs().format(`dddd, MMMM ${day}`) + suffix + ', ' + dayjs().format(`YYYY`);
        document.getElementById("current-day").textContent = date;

        
    }

    function displayCorrectHour(){
        var hourString = dayjs().format('HH');
        var hour = parseInt(hourString);
        

        var hours = document.getElementsByClassName("description");

        for(counter = 9; counter < 18; counter++){

            var hourTextarea = document.getElementById("hour-" + counter + "-textarea");

            if(hour > counter){

                hourTextarea.classList.add("past");
                hourTextarea.classList.remove("present");
                hourTextarea.classList.remove("future");
                

            } else if(hour < counter){

                hourTextarea.classList.add("future");
                hourTextarea.classList.remove("present");
                hourTextarea.classList.remove("past");

            } else {

                hourTextarea.classList.add("present");
                hourTextarea.classList.remove("future");
                hourTextarea.classList.remove("past");
            }


        }

        
    }

    //The Xpert Learning Assistant gave me a lot of the code for this function and I made some adjustments.
    function renderSuffix(day){

        switch(day % 10){
            case 1:
                if(day === "11")
                    return 'th';
                else
                    return 'st';
            case 2:
                if(day === "12")
                    return 'th';
                else
                    return 'nd';
            case 3:
                if(day === "13")
                    return 'th';
                else
                    return 'rd';
            default:
                return 'th';
        }
    }

    renderSavedEvents();

    function saveEvent(event){

        var eventText = document.getElementById("event");
        var addRemoval = document.getElementById("add-removal");
        var emoji = document.getElementById("emoji");

        if(event.target.tagName === "I"){

            hour = event.target.parentNode.parentNode;

        } else {

            hour = event.target.parentNode;
        }
        
        var textarea = this.previousElementSibling;
        var foundEvent = findAppointment()

        if(foundEvent === textarea.value){
            
            eventText.textContent = "Event"
            addRemoval.textContent = "already in";
            emoji.textContent = "😊";

        } else if(foundEvent !== null && textarea.value.trim() === ""){

            localStorage.removeItem(hour.id);

            eventText.textContent = "Event"
            addRemoval.textContent = "removed from";
            emoji.textContent = "❌";

        } else if(foundEvent === null && textarea.value.trim() === ""){

            eventText.textContent = "No event"
            addRemoval.textContent = "to save to";
            emoji.textContent = "😞";

        } else {

            localStorage.setItem(hour.id, textarea.value);
            eventText.textContent = "Event"
            addRemoval.textContent = "saved to"
            emoji.textContent = "✔️"
        }

        eventSavedConfirmation.classList.remove("no-opacity");
        eventSavedConfirmation.classList.remove("opacity-0");
    
        setTimeout(fadeOut, 2000);
    }

    function findAppointment(){

        return localStorage.getItem(hour.id);
    }


    function fadeOut(){

        eventSavedConfirmation.classList.add("fade-out");

        setTimeout(function(){
            eventSavedConfirmation.classList.add("no-opacity");
            eventSavedConfirmation.classList.remove("fade-out");
        }, 2000);
    }

    function renderSavedEvents(){

        for(var hourCounter = 9; hourCounter < 18; hourCounter++){

            var storedEvent = localStorage.getItem("hour-" + hourCounter);

            if(storedEvent !== null){

                document.getElementById("hour-" + hourCounter + "-textarea").value = storedEvent;
            }
        }
    }

    var eventSavedConfirmation = document.getElementById("event-saved-confirmation");
    var buttons = document.getElementsByClassName('saveBtn');
    var sections = document.getElementsByClassName('time-block');
    var counter = 0;
    var hour = null;

    
    for(counter = 0; counter < buttons.length; counter++){

        buttons[counter].addEventListener("click", saveEvent);
    }

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
