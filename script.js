// Password for posting and deleting events
const password = "123";

// Retrieve events from localStorage if available
let events = JSON.parse(localStorage.getItem('events')) || [];

// Event form submission
const postEvent = () => {
  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const location = document.getElementById('location').value;
  const registration = document.getElementById('registration').value;
  const description = document.getElementById('description').value;
  const hoursInput = document.getElementById('hours').value;
  const contact = document.getElementById('contact').value;
  const enteredPassword = document.getElementById('password').value;

  // Validate hours field
  const hours = parseInt(hoursInput);
  if (isNaN(hours) || !Number.isInteger(hours)) {
    alert("Please enter a valid integer value for hours.");
    return;
  }

  if (enteredPassword === password && title && date && time && location && registration && description && hoursInput) {
    const event = {
      title,
      date,
      time,
      location,
      registration,
      description,
      hours,
      contact
    };

    events.push(event);
    saveEventsToLocalStorage();
    displayEvents();

    // Clear input fields
    document.getElementById('title').value = '';
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
    document.getElementById('location').value = '';
    document.getElementById('registration').value = '';
    document.getElementById('description').value = '';
    document.getElementById('hours').value = '';
    document.getElementById('contact').value = '';
    document.getElementById('password').value = '';
  }
};

// Display posted events
const displayEvents = () => {
    const eventsList = document.getElementById('events');
    eventsList.innerHTML = '';
  
    // Reverse the order of events to display newest posts at the top
    const reversedEvents = [...events].reverse();
  
    reversedEvents.forEach((event, index) => {
      const eventItem = document.createElement('li');
      eventItem.classList.add('event-item');
  
      const eventDate = new Date(event.date);
      const formattedDate = `${eventDate.getMonth() + 1}/${eventDate.getDate()}/${eventDate.getFullYear()}`;

      const eventTime = new Date(`${event.date}T${event.time}`);
    const formattedTime = eventTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  
      eventItem.innerHTML = `
        <h3><strong>${event.title}<strong></h3>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${formattedTime}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Registration:</strong> <a href="${event.registration}" target="_blank">${event.registration}</a></p>
        <p><strong>Volunteer Hours:</strong> ${event.hours}</p>
        <p><strong>Description:</strong> ${event.description}</p>
        <p><strong>Contact:</strong> <a href="mailto:${event.contact}" target="_blank">${event.contact}</a></p>
        <button class="add-to-calendar-button" onclick="addToCalendar('${event.title}', '${eventDate.toISOString()}', '${event.time}')">Add to Google Calendar</button>
        <input class="password-input-field" type="password" id="delete-password-${index}" placeholder="Password">
        <button class="delete-button" onclick="deleteEvent(${index})">Delete</button>
      `;
  
      eventsList.appendChild(eventItem);
    });
  };
  
  // Add event to Google Calendar
const addToCalendar = (title, date, time) => {
    const eventDateTime = new Date(`${date}T${time}`);
    const eventStartTime = eventDateTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  
    const eventDetails = {
      summary: title,
      start: {
        eventStartTime,
      },
      reminders: {
        useDefault: true,
      },
    };
  
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventDetails.summary
    )}&dates=${encodeURIComponent(
      eventDetails.start.dateTime
    )}&details=${encodeURIComponent(eventDetails.summary)}`;
  
    window.open(calendarUrl, '_blank');
  };

// Delete event
const deleteEvent = (index) => {
    const enteredPassword = document.getElementById(`delete-password-${index}`).value;
  
    if (enteredPassword === password) {
      const eventIndex = events.length - 1 - index; // Adjust index for reversed order
      events.splice(eventIndex, 1);
      saveEventsToLocalStorage();
      displayEvents();
    } else {
      alert("Incorrect password. Cannot delete the event.");
    }
  };

// Save events to localStorage
const saveEventsToLocalStorage = () => {
  localStorage.setItem('events', JSON.stringify(events));
};

// Load events from localStorage on page load
window.addEventListener('load', () => {
  displayEvents();
});

// Event listener for post button
document.getElementById('post-button').addEventListener('click', postEvent);
  
