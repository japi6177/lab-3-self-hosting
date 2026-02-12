const categoryColors = {
    "Academic": "#4e73df", // blue
    "Work": "#1cc88a", // green?
    "Personal": "#858796", // pastel blue
    "Health & Fitness": "#d63384", // pink
    "Social": "#f6c23e", // either yellow or green
    "Family": "#fd7e14", // orange
    "Travel": "#20c9a6", // teal
    "Deadline": "#e74a3b", // red
    "Hobby": "#6f42c1" // purple
};

let selected_card = null;
//const events = [];

function enableSaveButton(){
    document.getElementById("save_btn").classList.remove("d-none");
    document.getElementById("edit_btn").classList.add("d-none");
}

function enableEditButton(){
    document.getElementById("save_btn").classList.add("d-none");
    document.getElementById("edit_btn").classList.remove("d-none");
}

function clearForm() {
    eventForm = document.getElementById('event_form');
    if(eventForm.classList.contains("was-validated")){
        eventForm.classList.remove("was-validated");
    }
    eventForm.reset();
    updateLocationOptions(null);
    enableSaveButton();
}

function updateLocationOptions(modality) {

    //console.log("BUH");

    const location = document.getElementById("location_group");
    const remoteURL = document.getElementById("remote_url_group");

    if (modality === "in_person") {
        location.className = "mb-3 d-inline";
        location.required = true;
        remoteURL.className = "mb-3 d-none";
        remoteURL.required = false;
    }
    else if (modality === "remote") {
        location.className = "mb-3 d-none";
        location.required = false;
        remoteURL.className = "mb-3 d-inline";
        remoteURL.required = true;
    }
    else {
        location.className = "mb-3 d-none";
        location.required = false;
        remoteURL.className = "mb-3 d-none";
        remoteURL.required = false;
    }

}

function editCard(eventDetails, curr_card){

    //console.log("BUH");

    //Get modal
    const event_modal = document.getElementById('event_modal'); 
    const event_modal_instance = bootstrap.Modal.getOrCreateInstance(event_modal);

    //Clear the form in case someone started typing, closed the modal, and clicked an event
    clearForm();

    //Swap the save button for a "save edit" button
    enableEditButton();

    //Set te global varieable "selected_card" equal to "curr_card" so we don't lose it
    selected_card = curr_card;

    //Fill in all the wthings except location/url
    document.getElementById("event_name").value = eventDetails.name; // name of the event from the form,
    document.getElementById("event_category").value = eventDetails.category; // category of the event
    document.getElementById("event_weekday").value = eventDetails.weekday;//weekday of the event from the form,
    document.getElementById("event_time").value = eventDetails.time;//time of the event from the form,
    document.getElementById("event_modality").value = eventDetails.modality;//modality of the event from the form,
    document.getElementById("event_attendees").value = eventDetails.attendees;//list of attendees from the form

    //Show the proper location/URL entry space, then fill it in
    updateLocationOptions(eventDetails.modality)

    if(eventDetails.location === null){
        document.getElementById("event_remote_url").value = eventDetails.remoteURL;
    }
    else{
        document.getElementById("event_location").value = eventDetails.location;
    }



    //Shpw the modal when everythign ians fielle in :)
    event_modal_instance.show();
    console.log(selected_card);

}

function createEventCard(eventDetails) {

    let event_element = document.createElement('div');

    event_element.classList = 'event border rounded m-1 py-1';
    event_element.addEventListener("click", () => {
        editCard(eventDetails, event_element);
    });

    let info = document.createElement('div');

    let name = eventDetails.name;
    let category = eventDetails.category;
    let weekday = eventDetails.weekday;
    let time = eventDetails.time;
    let modality = eventDetails.modality;
    let location = eventDetails.location;
    let remote_url = eventDetails.remote_url;
    let attendees = eventDetails.attendees;

    event_element.style.backgroundColor = categoryColors[category];

    if (location === null){
        info.innerHTML = `<h2>${name}</h2>
                          - ${category}<br>
                          - Weekday: ${weekday}<br>
                          - Time: ${time}<br>
                          - Remote<br>
                          - URL: ${remote_url}<br>
                          - Attendees: ${attendees}`;
    }
    else{
        info.innerHTML = `<h2>${name}</h2>
                          - ${category}<br>
                          - Weekday: ${weekday}<br>
                          - Time: ${time}<br>
                          - In-Person<br>
                          - Location: ${location}<br>
                          - Attendees: ${attendees}`;
    }
    event_element.appendChild(info);

    return event_element;

}

function addEventToCalendarUI(eventInfo) {

    let event_card = createEventCard(eventInfo);



    let weekday = document.getElementById(eventInfo.weekday);

    weekday.appendChild(event_card);

    const myModalElement = document.getElementById('event_modal');
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.hide();

}

function clearForm() {
    eventForm = document.getElementById('event_form');
    if(eventForm.classList.contains("was-validated")){
        eventForm.classList.remove("was-validated");
    }
    eventForm.reset();
    updateLocationOptions(null);
}




//Not to be confused with "saveEvent()," which is right below this
function saveEdit() {

    //Check validity
    if (!document.getElementById('event_form').checkValidity()) {
        document.getElementById('event_form').classList.add("was-validated");
        return; 
    }

    //Build json object
    const eventDetails = {
        name: document.getElementById("event_name").value,// name of the event from the form,
        category: document.getElementById("event_category").value, // category of the event
        weekday: document.getElementById("event_weekday").value,//weekday of the event from the form,
        time: document.getElementById("event_time").value,//time of the event from the form,
        modality: document.getElementById("event_modality").value,//modality of the event from the form,
        location: null,//if the modality is "In-person" then this has a value and remote_url is null,
        remote_url: null,//if the modality is "Remote" then this has a value location is null,
        attendees: document.getElementById("event_attendees").value//list of attendees from the form
    };

    //in person or not
    if (eventDetails.modality === "in_person")
        eventDetails.location = document.getElementById("event_location").value
    else if (eventDetails.modality === "remote")
        eventDetails.remote_url = document.getElementById("event_remote_url").value

    //reset the form
    clearForm();

    //Grab our info element from before
    let info = selected_card.firstElementChild;

    //Re-write the selected card.
    if (eventDetails.location === null){
        info.innerHTML = `<h2>${eventDetails.name}</h2>
                                  - ${eventDetails.category}<br>
                                  - Weekday: ${eventDetails.weekday}<br>
                                  - Time: ${eventDetails.time}<br>
                                  - Remote<br>
                                  - URL: ${eventDetails.remote_url}<br>
                                  - Attendees: ${eventDetails.attendees}`;
    }
    else{
        info.innerHTML = `<h2>${eventDetails.name}</h2>
                                  - ${eventDetails.category}<br>
                                  - Weekday: ${eventDetails.weekday}<br>
                                  - Time: ${eventDetails.time}<br>
                                  - In-Person<br>
                                  - Location: ${eventDetails.location}<br>
                                  - Attendees: ${eventDetails.attendees}`
    }

    //Move selected card to the proper day
    let weekday = document.getElementById(eventDetails.weekday);

    weekday.appendChild(selected_card);

    //Update the event listener and reset the global variable 
    selected_card.removeEventListener("click", editCard);
    selected_card.addEventListener("click", () => {
        editCard(eventDetails, selected_card);
    });
    selected_card = null;

    const myModalElement = document.getElementById('event_modal');
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.hide();
}


//Not to be confused with "saveEdit()," which is right above this
function saveEvent() {

    //Check validity
    if (!document.getElementById('event_form').checkValidity()) {
        document.getElementById('event_form').classList.add("was-validated");
        return; 
    }

    //Build json object
    const eventDetails = {
        name: document.getElementById("event_name").value,// name of the event from the form,
        category: document.getElementById("event_category").value, // category of the event
        weekday: document.getElementById("event_weekday").value,//weekday of the event from the form,
        time: document.getElementById("event_time").value,//time of the event from the form,
        modality: document.getElementById("event_modality").value,//modality of the event from the form,
        location: null,//if the modality is "In-person" then this has a value and remote_url is null,
        remote_url: null,//if the modality is "Remote" then this has a value location is null,
        attendees: document.getElementById("event_attendees").value//list of attendees from the form
    };

    //in person or not
    if (eventDetails.modality === "in_person")
        eventDetails.location = document.getElementById("event_location").value
    else if (eventDetails.modality === "remote")
        eventDetails.remote_url = document.getElementById("event_remote_url").value

    //reset the form
    clearForm();

    //events.push(eventDetails)
    //console.log(events[events.length - 1]);

    addEventToCalendarUI(eventDetails)
}
