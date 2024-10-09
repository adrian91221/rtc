let messageForm = document.querySelector('#messageForm');
let usernameForm = document.querySelector('#usernameForm');
let messagesContainer = document.getElementById('messages');
let usersContainer = document.getElementById('users');
let newMessageBar = document.getElementById('new-msg-bar')
let usersBox = document.getElementById('users')
let mainContainer = document.getElementById('main-container')
let username = null;
let stompClient = null;
let connected = false;


// (function () {
//     if (!connected) connect();
// })();

function sendMessage(event) {
    //if(!connected) connect();
    if (!connected) return;

    let messageText = document.getElementById("input-msg");
    if (messageText.value.trim().length < 1) return;

    let messageContent = messageText.value.trim();
    if (messageContent && stompClient) {
        let chatMessage = {
            sender: username,
            content: messageContent,
            date: new Date().toISOString(),
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    }

    messageText.value = "";
    event.preventDefault();


    // let newMessage = document.createElement("div");
    // newMessage.className = "message";
    // newMessage.innerText = messageText.value;
    //
    // let messagesContainer = document.getElementById("messages");
    // messagesContainer.appendChild(newMessage);
    //
    // messageText.value = "";
}

function onMessageReceived(payload) {
    let messageData = JSON.parse(payload.body);

    console.log(messageData);

    if (messageData.type === 'CHAT') {
        addMessage(messageData);
    } else if (messageData.type === 'JOIN') {
        addUser(messageData);
    } else if (messageData.type === 'LEAVE') {
        removeUser(messageData);
    }


}

function addMessage(messageData) {
    const isScrolledToBottom = messagesContainer.scrollHeight - messagesContainer.clientHeight <= messagesContainer.scrollTop + 1;
    let newMessageContainer = document.createElement('div');
    newMessageContainer.className = 'message-container'

    let sender = document.createElement('div');
    sender.className = 'sender';
    sender.innerText = messageData.sender;

    let date = document.createElement('div');
    date.className = 'date';
    date.innerText = messageData.date;

    let message = document.createElement('div');
    message.className = 'message';
    message.innerText = messageData.content;
    let hr = document.createElement('hr');
    hr.className = 'messages-divider';
    message.appendChild(hr);

    newMessageContainer.appendChild(sender);
    newMessageContainer.appendChild(date);
    newMessageContainer.appendChild(message);

    messagesContainer.appendChild(newMessageContainer);
    if (isScrolledToBottom) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function addUser(messageData) {

    // <div class="user">user1<hr class="users-divider"></div>

    if (messageData.sender === username) return;

    let newUserContainer = document.createElement('div');
    newUserContainer.className = 'user'
    newUserContainer.id = messageData.sender;

    newUserContainer.innerText = messageData.sender;

    let hr = document.createElement('hr');
    hr.className = 'users-divider';
    newUserContainer.appendChild(hr);

    usersContainer.appendChild(newUserContainer);
}

function removeUser(messageData) {
    if (messageData.sender === username) return;

    let userContainer = document.getElementById(messageData.sender);
    userContainer.remove();
}

function connect(event) {
    //username = generateUUID();

    let usernameInput = document.getElementById("input-username");
    //username = document.getElementById("input-username").value.trim();
    //if (username.length < 1) return;
    if (usernameInput.value.trim().length < 1) return;

    username = usernameInput.value.trim();

    console.log("Connecting as " + username);
    let socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
    connected = true;
    console.log("Connected as " + username);

    usernameForm.classList.add('hidden');
    mainContainer.classList.remove('hidden');

    fetch('/api/messages/public')
        .then(response => response.json())
        .then(messages => {
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].type === 'CHAT') {
                    addMessage(messages[i]);
                } else if (messages[i].type === 'JOIN') {
                    addUser(messages[i]);
                } else if (messages[i].type === 'LEAVE') {
                    removeUser(messages[i]);
                }
            }
        })
        .catch(error => console.error('Error with messages download: ', error));

    event.preventDefault();
}

function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.send('/app/chat.addUser', {}, JSON.stringify({
        sender: username,
        date: new Date().toISOString(),
        type: 'JOIN'
    }));
}

function onError(error) {
    console.log("Error: " + error);
}


function disconnect() {
    stompClient.disconnect(function () {
        console.log("Disconnected");
    });
}

// function generateUUID() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//         var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);
//     });
// }

messageForm.addEventListener('submit', sendMessage, true);
usernameForm.addEventListener('submit', connect, true);
window.addEventListener('beforeunload', disconnect);