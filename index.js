// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";
const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorDiv = document.getElementById("error-message");
//linking variables to html ids

fetchButton.addEventListener("click", () => {
  const state = stateInput.value.toUpperCase();
//event listener for button click, assign var state to user input and capitalize
// once clicked: 
  // Clear previous alerts and errors
  alertsDisplay.innerHTML = "";
  errorDiv.textContent = "";

   //call function
  fetchWeatherAlerts(state);

  // Clear input field
  stateInput.value = "";
});

function fetchWeatherAlerts(state) {
  fetch(`${weatherApi}${state}`)
  //fetch weather api and var state
    .then(function(response) {
      console.log("response object:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
      //make js compatible
    })
    .then(function(data) {
      console.log("data object:", data);
      displayAlerts(data);
      //then run display alerts function passing in API data
    })
    .catch(function(err) {
      console.error("Error fetching data:", err);
      showError(err);
    });
}

function displayAlerts(data) {
  // Clear previous alerts
  alertsDisplay.innerHTML = "";
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden"); 

  // Check if there are alerts
  if (!data.features || data.features.length === 0) {
    const noItem = document.createElement("li");
    noItem.textContent = "No active alerts.";
    alertsDisplay.appendChild(noItem);
    return;
  }

  // Summary message
  const numOfAlerts = data.features.length;
  const summaryText = `Weather Alerts: ${numOfAlerts}`;
  const summaryItem = document.createElement("li");
  summaryItem.textContent = summaryText;
  alertsDisplay.appendChild(summaryItem);

  document.title = summaryText;

  // List each alert headline
  data.features.forEach(function(alert) {
    const alertItem = document.createElement("li");
    alertItem.textContent = alert.properties.headline;
    alertsDisplay.appendChild(alertItem);
  });
}

function showError(err) {
  errorDiv.textContent = err.message; // show actual error message
  errorDiv.classList.remove("hidden");
}