// API_URL has the data we need and where new data will be saved
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-fsa-et-web-pt-sf-b-nana/events`;

// an object array where new events can be logged in JS
const state = {
  events: [],
};

// DOM connecting JS to the UI events list
const eventList = document.querySelector("#event-list");

// DOM connecting JS to the UI addEvent form
const addEventForm = document.querySelector("#addEventForm");
// event listener to run the addEvent function when the form's submit button is clicked
addEventForm.addEventListener("submit", addEvent);

async function render() {
  await getEvents();
  renderEvents();
}
render();

// creating function to get from API to JS
async function getEvents() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
    }); // accessing API_URL via GET method
    const json = await response.json(); // formatting fetched data to json format
    const events = json.data; // collecting specifically the event data from the fetched url
    state.events = events; // replacing the object array with what's in json's data.
    // state.events = json.data;  -->  (ALTERNATIVE for the 2 lines above)
    console.log("state: ", state); // to confirm in console what the state.events array looks like.
  } catch (error) {
    console.error(error); // console that an error occured if the "try" didn't work
  }
}

// creating a function to render events from JS to UI
function renderEvents() {
  if (!state.events.length) {
    // if event array is blank, end funciton.
    return;
  }

  const eventCards = state.events.map((event) => {
    // mapping through events array and creating a card for each event
    const newButton = document.createElement("button"); // create a button
    newButton.textContent = "close"; //... with an X in it...
    newButton.addEventListener("click", deleteEvent); // .. with an event listener for a click, which will run deleteEvent fx...
    newButton.id = event.id; // using the ID to identify what event will close.
    const li = document.createElement("li"); // create a list
    li.innerHTML = ` 
        <h2>${event.name}</h2> 
        <p>${event.description}</p>
        <p>${new Date(event.date).toLocaleString("en-US")}/<p>
        <p>${event.location}</p>
        `; // format each listed event as above.
    li.appendChild(newButton); // append the new button to the list
    return li;
  });
  eventList.replaceChildren(...eventCards); // replace ul list's children with event cards
}

// creating a function to add the event to the API
async function addEvent(event) {
  event.preventDefault(); // prevent from being refreshed
  try {
    const response = await fetch(API_URL, {
      // accessing API_URL
      method: "POST", // POST will send data back to server/API_URL
      headers: { "Content-Type": "application/json" }, // specifies type of content
      body: JSON.stringify({
        //converts to a string and readable for json
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: new Date(addEventForm.date.value).toISOString(), // converts to iso string format
        location: addEventForm.location.value,
      }),
    });
    if (!response.ok) {
      // if response is NOT okay, throw error below
      throw new Error("Failed to create event");
    }
    render();
  } catch (error) {
    // catch error
    console.error(error);
  }
  addEventForm.reset();
}

// creating a function to delete an event
async function deleteEvent(event) {
  console.log("Delete Event"); // to check that function is working
  const id = event.target.id;
  const element = event.target; //
  element.remove();
  if (id != null) {
    // if id is not null...
    const DELETE_EVENT = `${API_URL}/${id}`; // delete event with that ID
    try {
      await fetch(DELETE_EVENT, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
    }
  }
  render();
}
