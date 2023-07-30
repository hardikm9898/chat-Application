const socket = io();
const userInput = socket.on("countconnection", (data) => {});
const messageInput = document.getElementById("message-input");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("message-form");
const userName = document.getElementById("name-input");
const totleClient = document.getElementById("client-total");

socket.on("countconnection", (data) => {
  totleClient.innerHTML = `Totale client ${data}`;
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  senndMessage();
});

function senndMessage() {
  if (messageInput.value === "") return;
  const data = {
    message: messageInput.value,
    dateTime: new Date(),
    name: userName.value,
  };
  socket.emit("message", data);
  ownMessage(true, data);
  messageInput.value = "";
  clearFeedBack();
}

function ownMessage(ownMessage, data) {
  const element = `<li class="${ownMessage ? "message-right" : "message-left"}">
        <p class="message">
        ${data.message}
          <span>${data.name} ● ${data.dateTime}</span>
        </p>
      </li> `;
  messageContainer.innerHTML += element;
  scrollAutomatic();
}
socket.on("brodcastmessage", (data) => {
  ownMessage(false, data);
});
function scrollAutomatic() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${userName.value} typing ...`,
  });
});

messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("brodcastfeedback", (data) => {
  clearFeedBack();
  const element = `<li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>`;
  messageContainer.innerHTML += element;
});

function clearFeedBack() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
