// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
    localStorage.clear();


    var eventSavedConfirmation = document.getElementById("event-saved-confirmation");
    var buttons = document.getElementsByClassName('saveBtn');
    var sections = document.getElementsByClassName('time-block');
    var counter = 0;
    var hour = null;

    var appointmentsArray = JSON.parse(localStorage.getItem("appointments"));

    
    for(counter = 0; counter < buttons.length; counter++){
        buttons[counter].addEventListener("click", saveEvent);
    }

    renderSavedEvents();

    function saveEvent(event){

        var item = null;

        if(event.target.tagName === "I"){

            hour = event.target.parentNode.parentNode;

        } else {

            hour = event.target.parentNode;
        }
        
        var textarea = this.previousElementSibling;

        if(textarea.value.trim() === ""){

            return;
        }

        if(appointmentsArray === null){
                
                appointmentsArray = [];
            }

        

            var foundEvent = findAppointment()

        if(foundEvent !== undefined){

            if(foundEvent.event === textarea.value){
            
                return;
            }
        }
        
       
        

        var appointment = {hour: hour.id, event: textarea.value};
        

        if(findAppointment() !== null){

            var removalIndex = appointmentsArray.indexOf(hour);
            appointmentsArray.splice(removalIndex, 1);

        }

        appointmentsArray.push(appointment);
        
        localStorage.setItem("appointments", JSON.stringify(appointmentsArray));

        eventSavedConfirmation.classList.remove("no-opacity");
        eventSavedConfirmation.classList.remove("opacity-0");
    
        setTimeout(fadeOut, 5000);
    }

    function findAppointment(){
        var foundEvent = appointmentsArray.find(item => item.hour === hour.id)
        return foundEvent
    }


    function fadeOut(){
        eventSavedConfirmation.classList.add("fade-out");

        setTimeout(function(){
            eventSavedConfirmation.classList.add("no-opacity");
            eventSavedConfirmation.classList.remove("fade-out");
        }, 2000);
        
    }

    function renderSavedEvents(){

        var appointment = null;
        
        if(appointmentsArray !== null  && appointmentsArray !== []){
            
            for(var counter = 0; counter < appointmentsArray.length; counter++){

                appointment = appointmentsArray[counter];

                var parentSection = document.getElementById(appointment.hour);
                var textarea = parentSection.querySelector("textarea");
                textarea.value = appointment.event;
            }
        }
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
