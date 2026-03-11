// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

// Click handler
fetchButton.addEventListener("click", () => {
  const state = stateInput.value.toUpperCase(); // get current input
  if (!state) return; // do nothing if input is empty

  fetchWeatherAlerts(state);

  // Clear input field after fetch
  stateInput.value = "";
});

function fetchWeatherAlerts(state) {
  // Clear previous error
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");

  fetch(`${weatherApi}${state}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      displayAlerts(data);
    })
    .catch((err) => {
  console.error("Error fetching data:", err);
  showError(err); // pass the actual error
});
}

function displayAlerts(data) {
  // Clear previous alerts
  alertsDisplay.innerHTML = "";

  // Clear any previous error
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");

  const features = Array.isArray(data.features) ? data.features : [];
  const numOfAlerts = features.length;

  // Summary text must match test expectation
  const summaryText = `Weather Alerts: ${numOfAlerts}`;
  const summaryItem = document.createElement("li");
  summaryItem.textContent = summaryText;
  alertsDisplay.appendChild(summaryItem);

  // Update document title
  document.title = summaryText;

  if (numOfAlerts === 0) {
    const noAlertItem = document.createElement("li");
    noAlertItem.textContent = "No active alerts.";
    alertsDisplay.appendChild(noAlertItem);
    return;
  }

  // Add all alert headlines
  features.forEach((alert) => {
    const alertItem = document.createElement("li");
    alertItem.textContent = alert.properties.headline;
    alertsDisplay.appendChild(alertItem);
  });
}

// Show error message for failed fetch
function showError(err) {
  errorMessage.textContent = err.message; // use the actual error message
  errorMessage.classList.remove("hidden");
}