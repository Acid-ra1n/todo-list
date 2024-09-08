// Generates a random string of characters acting as a task id
function generateID() {
  return Math.random().toString(36).substr(2, 5);
}

// Validates that the input string is a valid time formatted as "hh:mm:ss"
function isValidTime(timeString)
{
    const timePattern = /^(?:1[0-2]|0?[1-9]):[0-5][0-9]:[0-5][0-9]\s?(?:AM|PM)\s*$/i;
    return timePattern.test(timeString);
}

// Validates that the input string is a valid date formatted as "mm/dd/yyyy"
function isValidDate(dateString) {
  const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}\s*$/;
  if (!datePattern.test(dateString)) {
      return false;
  }
  
  const parts = dateString.split("/");
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Range for years and months
  if (year < 1900 || year > 2300 || month < 1 || month > 12) {
      return false;
  }
  // Number of days in each month
  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      monthLength[1] = 29;
  }
  // Checks if number of day in month exists
  return day > 0 && day <= monthLength[month - 1];
}

// Must be at least one character or error message will be displayed
function minLetter(input) {
  if (input.length === 0) {
      document.getElementById("errorMessage").textContent = "Please enter a task.";
      document.getElementById("errorMessage").style.display = "block";
      return false;
  }
  document.getElementById("errorMessage").textContent = "";
  document.getElementById("errorMessage").style.display = "none";
  return true;
}

// Adds a task to the list
function addTask() {
  // Checks if there is at least one character in the input
  const input = document.getElementById("taskInput").value;
  if (!minLetter(input)) return;

  // Task container
  const ul = document.getElementById("taskList");
  // Every li is a task
  const li = document.createElement("li");

  // Checkbox for marking the task as complete
  const checkMark = document.createElement('input');
  checkMark.type = "checkbox";
  // Appends elements to task
  li.appendChild(checkMark);

  // Div to display task content
  const content = document.createElement("div");
  content.classList.add('content');
  content.textContent = input;
  li.appendChild(content);

  // Input to Edit task content
  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.value = input;
  inputField.className = "input";
  li.appendChild(inputField);

  // Creates an error message
  const errorMessage = document.createElement('span');
  errorMessage.classList.add('error-message', 'second');
  errorMessage.textContent = "Please enter a task.";
  li.appendChild(errorMessage);

  // Creates an edit button to edit tasks
  const taskEdit = document.createElement('button');
  taskEdit.innerText = 'Edit';
  taskEdit.addEventListener('click', () => {
    // Saved mode starts, can't edit anything
      if (li.classList.contains('expanded')) {
          if (!(inputField.value)) {
              // When editing, task content cannot be empty
              errorMessage.style.display = "block";
              return;
          } else {
              errorMessage.style.display = "none";
          }
          content.textContent = inputField.value;
          taskEdit.innerText = 'Edit';

          // Selects date and time input fields
          const dateInput = li.querySelector('.date-input');
          const timeInput = li.querySelector('.time-input');

          // Calls the functions that validate date and time
          const isValidDateInput = dateInput && isValidDate(dateInput.value);
          const isValidTimeInput = timeInput && isValidTime(timeInput.value);
          // Displays date or time in span when they are valid inputs
          if (isValidDateInput || isValidTimeInput) {
              let dateDisplaySpan = li.querySelector('.date-display');
              if (!dateDisplaySpan) {
                  dateDisplaySpan = document.createElement('span');
                  dateDisplaySpan.classList.add('date-display');
                  li.appendChild(dateDisplaySpan);
                  content.appendChild(dateDisplaySpan);
              }
              // Display format. At least one of date or time has to be valid for the span to display content
              if (isValidDateInput && isValidTimeInput) {
                  dateDisplaySpan.textContent = `Date: ${dateInput.value}, Time: ${timeInput.value}`;
              } else if (isValidDateInput) {
                  dateDisplaySpan.textContent = `Date: ${dateInput.value}`;
              } else if (isValidTimeInput) {
                  dateDisplaySpan.textContent = `Time: ${timeInput.value}`;
              }
          } else { // If neither value is valid, span content will be empty
              let dateDisplaySpan = li.querySelector('.date-display');
              if (dateDisplaySpan) {
                  dateDisplaySpan.textContent = '';
              }
          }
      } else { // Saved mode ends and Editing mode starts
          taskEdit.innerText = 'Save';
          errorMessage.style.display = "none";

          // After clicking the set date/time button, the date/time input fields will be displayed, and the button will disappear
          if (!li.querySelector('.set-date-button')) {
              const setDateTimeButton = document.createElement('button');
              setDateTimeButton.innerText = 'Set Date & Time';
              setDateTimeButton.classList.add('set-date-button');
              li.appendChild(setDateTimeButton);
              
              // Things that will occur by clicking the button 
              setDateTimeButton.addEventListener('click', () => {
                  setDateTimeButton.style.display = "none";
              // Div that contains date and time input fields and set notification button
                  const dateTimeNotif = document.createElement('div');
                  dateTimeNotif.classList.add('dateTimeNotif');

                  const dateTitle = document.createElement('p');
                  dateTitle.innerText = "Date:";
                  const dateInput = document.createElement('input');
                  dateInput.type = 'text';
                  dateInput.placeholder = 'mm/dd/yyyy';
                  dateInput.classList.add('date-input');
                  dateTimeNotif.appendChild(dateTitle);
                  dateTimeNotif.appendChild(dateInput);

                  // Error message will appear when date is not valid
                  const dateError = document.createElement('span');
                  dateError.classList.add('error-message', 'date-error');
                  dateTimeNotif.appendChild(dateError);

                  const timeTitle = document.createElement('p');
                  timeTitle.innerText = "Time:";
                  const timeInput = document.createElement('input');
                  timeInput.type = "text";
                  timeInput.placeholder = 'hh:mm:ss am/pm';
                  timeInput.classList.add('time-input');
                  dateTimeNotif.appendChild(timeTitle);
                  dateTimeNotif.appendChild(timeInput);

                  // Error message will appear when time is not valid
                  const timeError = document.createElement('span');
                  timeError.classList.add('error-message', 'time-error');
                  dateTimeNotif.appendChild(timeError);

                  // Colors indicate validity of input. No input shows no message or colors
                  timeInput.addEventListener('input', () => {
                    if (timeInput.value === "") {
                        timeError.textContent = "";
                        timeError.style.color = '';
                        timeInput.style.borderColor = '';
                    } else if (isValidTime(timeInput.value)) {
                        timeError.textContent = "Time is valid!";
                        timeError.style.color = 'Green';
                        timeInput.style.borderColor = 'Green';
                    } else {
                        timeError.textContent = "Please enter a valid time.";
                        timeError.style.color = 'Red';
                        timeInput.style.borderColor = 'Red';
                    }
                  });

                  dateInput.addEventListener('input', () => {
                    if (dateInput.value === "") {
                        dateError.textContent = "";
                        dateError.style.color = '';
                        dateInput.style.borderColor = '';
                    } else if (isValidDate(dateInput.value)) {
                        dateError.textContent = "Date is valid!";
                        dateError.style.color = 'Green';
                        dateInput.style.borderColor = 'Green';
                    } else {
                        dateError.textContent = "Please enter a valid date.";
                        dateError.style.color = 'Red';
                        dateInput.style.borderColor = 'Red';
                    }
                  });
                  // Button that allows the user to set notifications for tasks
                  const setNotification = document.createElement("button");
                  setNotification.innerText = "Set Notification";
                  setNotification.id = "setNotification";
                  // Retrieves user's valid date and time input values
                  setNotification.onclick = function () {
                      let dateInputValue = li.querySelector('.date-input').value;
                      let timeInputValue = li.querySelector('.time-input').value;
                      let contentValue = li.querySelector('.content').innerText;
                      // Each task has a unique id to differentiate it from other tasks
                      let taskId = generateID();
                      // Calls function with 4 parameters. For each task, the function will be called
                      permission(taskId, dateInputValue, timeInputValue, contentValue)
                  };
                  dateTimeNotif.appendChild(setNotification);

                  li.appendChild(dateTimeNotif);
              }); // End of set date event listener
          } // End of set date button
      } // End of editing mode
      // Clicking the edit button will expand the task. Clicking the save button will remove the expanded state.
      li.classList.toggle('expanded');
  }); // End of saved mode

  li.appendChild(taskEdit);

  // Delete button to delete individual tasks
  const taskDelete = document.createElement('button');
  taskDelete.innerText = 'Delete';
  taskDelete.style.backgroundColor = 'Red';
  taskDelete.addEventListener('click', () => {
      ul.removeChild(li);
  });
  li.appendChild(taskDelete);

  // Every task is appended to the list that contains all the tasks
  ul.appendChild(li);
  // Every time you add a task, the top input resets state
  document.getElementById("taskInput").value = "";
  document.getElementById("errorMessage").textContent = "";
  document.getElementById("errorMessage").style.display = "none";
}// End addTask function

document.getElementById("minusButton").addEventListener("click", function () {
  // If user clicks ok, all tasks are removed
  if (confirm("Are you sure you want to delete all tasks?")) {
      document.getElementById("taskList").innerHTML = "";
  }
});

// Object to hold timeout ids
let timeoutIDs = {};

// Asynchronous function that sets a notification for a task 
async function setNotification(taskId, date, time, task) {
  // Condition for notification
  if (!date.trim() || !time.trim()) {
      alert("Date or time cannot be empty. Cannot set notification.");
      return;
  }
  // Condition for notification
  if (!isValidDate(date) || !isValidTime(time)) {
      alert("Invalid date or time format. Cannot set notification.");
      return;
  }
  // Parse date and time, and checks if conditions are true
  // Splits and converts each part into an integer before assigning to variables
  const [month, day, year] = date.split('/').map(part => parseInt(part, 10));
  // Regular expression to match the hours, minutes, and seconds in the time string, converts each part to an integer, and assigns them to variables
  let [hours, minutes, seconds] = time.match(/(\d+):(\d+):(\d+)\s?(AM|PM)?/i).slice(1, 4).map(part => parseInt(part, 10));
  // Regular expression to see whether am or pm is present
  const period = time.match(/(AM|PM)$/i);
  // Conditions for time, conditions represent 24 hour format
  if (period && period[0].toUpperCase() === 'PM' && hours < 12) hours += 12;
  if (period && period[0].toUpperCase() === 'AM' && hours === 12) hours = 0;
  // Date object tells date and time the notification should be set
  const notificationTime = new Date(year, month - 1, day, hours, minutes, seconds);
  // Difference between current time and notification time
  const now = new Date();
  const delay = notificationTime - now;

  // If setting a new notification for task, removes previous one
  if (timeoutIDs[taskId]) {
      clearTimeout(timeoutIDs[taskId]);
  }

  // Triggers notification when difference reaches 0
  if (delay > 0) {
      alert("Notification set.");
      // Timeout id references the notification and task id references the task that was added
      timeoutIDs[taskId] = setTimeout(() => {
          // What the notification shows you later
          new Notification("Task Reminder", {
              body: `${task}  `,
          });
      }, delay);
  } else {
      // Conditions to set notification
      alert("Date or time cannot be in the past, invalid, or empty. Cannot set notification.");
  }
}

// Requests user for permission to display notifications
async function requestNotificationPermission() {
  return new Promise((resolve, reject) => {
      // Checks if notification api is available
      if (!("Notification" in window)) {
          reject(new Error("This browser does not support notifications."));
      }

      Notification.requestPermission().then((permission) => {
          // If user grants permission, notifications will work
          if (permission === "granted") {
              resolve();
          } else {
              // No permission =  notifications will not work
              reject(new Error("Notification permission denied."));
              alert("Notification permission denied.");
          }
      }).catch((error) => { // If any errors, catches them
          reject(new Error("Notification permission request failed."));
          alert("Notification permission request failed.");
      });
  });
}

// Function to request notification permission and set notification
async function permission(taskId, dateInputValue, timeInputValue, contentValue) {
  // Functions must complete before continuing
  try {
      await requestNotificationPermission();
      // Notifications only work with permission
      await setNotification(taskId, dateInputValue, timeInputValue, contentValue);
  } catch (error) { // Errors thrown get caught by try block
      console.error(error.message);
  }
}

