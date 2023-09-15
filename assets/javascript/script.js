// This function call to jQuery keeps the script from running until the page has loaded.
$(document).ready(function() {

    /* The functions to display the current day and the correct hour are called each second so as to 
    display the correct day and hour in real time or near real time.*/
    displayCurrentDay();
    setInterval(displayCurrentDay, 1000);
    displayCorrectHour();
    setInterval(displayCorrectHour, 1000);

    // This function gets the current date and displays it on the page.
    function displayCurrentDay(){

        var day = dayjs().format('D');
        var suffix = renderSuffix(day);
        
        //I used this rather convoluted way of displaying the date because I was having trouble when using other ways of displaying it. 
        var date = dayjs().format(`dddd, MMMM ${day}`) + suffix + ', ' + dayjs().format(`YYYY`);
        document.getElementById("current-day").textContent = date;

        
    }

    /* This function colors the textarea of the current hour red, the textareas of past hours grey and the 
    textareas of future hours green.*/
    function displayCorrectHour(){

        var hourString = dayjs().format('HH');
        var hour = parseInt(hourString);

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

    /*The Xpert Learning Assistant gave me a lot of the code for this function and I made some adjustments.
    This function gives the correct suffix for the date, depending on what day of the month it is.*/
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

    /*This function saves an event to local storage when the user types an event on the page and clicks the corresponding Save button.  It also removes
    an event from local storage if the user deletes the event and clicks the corresponding Save button.*/
    function saveEvent(event){

        hour = event.target.closest('.row');

        var eventText = document.getElementById("event");
        var addRemoval = document.getElementById("add-removal");
        var emoji = document.getElementById("emoji");
        var textarea = this.previousElementSibling;
        var foundEvent = findEvent();

        /* If the user clicks the Save button when an event already exists for a given hour, 
        but the user hasn't modified the event, the system will let the user know the event is already saved. */ 
        if(foundEvent === textarea.value){
            
            eventText.textContent = "Event"
            addRemoval.textContent = "already in";
            emoji.textContent = "😊";

        } else if(foundEvent !== null && textarea.value.trim() === ""){

            localStorage.removeItem(hour.id);

            eventText.textContent = "Event"
            addRemoval.textContent = "removed from";
            emoji.textContent = "❌";


        /* If the user clicks a Save button without typing an event, the system will notify the user of this. */
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
        
        debounceTimeout();

        eventSavedConfirmation.classList.remove("no-opacity");
        eventSavedConfirmation.classList.remove("opacity-0");

    }

    /* The Xpert Learning Assistant AI gave me the code for this function.  This function ensures that the function it wraps isn't 
    called before the specified delay has passed.  I used this for the fadeOut() function to avoid click-spamming issues on the save buttons.*/
    function debounce(func, delay){

        var timeoutId;

        return function(){
            clearTimeout(timeoutId);
            timeoutId = setTimeout(func, delay)
        }
    }

    // This function retrieves an event from local storage.
    function findEvent(){

        return localStorage.getItem(hour.id);
    }

    /* This function adds a fade to the text that tells the user that an event has been saved to and removed from local stoarge.*/
    function fadeOut(){
        
        eventSavedConfirmation.classList.add("no-opacity");

        eventSavedConfirmation.classList.add("fade-out");

        setTimeout(function(){
            
            eventSavedConfirmation.classList.remove("fade-out");

        }, 2000);
    }

    /*This function renders the events saved in local storage to the webpage. */
    function renderSavedEvents(){

        for(var hourCounter = 9; hourCounter < 18; hourCounter++){

            var storedEvent = localStorage.getItem("hour-" + hourCounter);

            if(storedEvent !== null){

                document.getElementById("hour-" + hourCounter + "-textarea").value = storedEvent;
            }
        }
    }

    // Here, I am declaring the global variables for the script.
    var eventSavedConfirmation = document.getElementById("event-saved-confirmation");
    var buttons = document.getElementsByClassName('saveBtn');
    var counter = 0;
    var hour = null;
    const debounceTimeout = debounce(fadeOut, 2000);

    // Here, I am adding an event listener to each Save button.
    for(counter = 0; counter < buttons.length; counter++){

        buttons[counter].addEventListener("click", saveEvent);
    }

});
