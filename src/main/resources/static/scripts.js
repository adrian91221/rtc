let messageForm = document.querySelector('#messageForm');
let usernameForm = document.querySelector('#usernameForm');
let messagesContainer = document.getElementById('messages');
let newMessageBar = document.getElementById('new-msg-bar')
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

    // if(message.type === 'JOIN') {
    //     messageElement.classList.add('event-message');
    //     message.content = message.sender + ' joined!';
    // } else if (message.type === 'LEAVE') {
    //     messageElement.classList.add('event-message');
    //     message.content = message.sender + ' left!';
    // } else {}

    console.log(messageData);
    addMessage(messageData);

}

function addMessage(messageData) {
    if (messageData.type === 'CHAT') {
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
    }
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
    messagesContainer.classList.remove('hidden');
    newMessageBar.classList.remove('hidden');

    fetch('/api/messages/public')
        .then(response => response.json())
        .then(messages => {
            for (let i = 0; i < messages.length; i++) {
                addMessage(messages[i]);
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


// function generateUUID() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//         var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);
//     });
// }

messageForm.addEventListener('submit', sendMessage, true);
usernameForm.addEventListener('submit', connect, true);



