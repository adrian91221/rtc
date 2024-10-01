// https://www.callicoder.com/spring-boot-websocket-chat-example/
let messageForm = document.querySelector('#messageForm');
let messagesBox = document.getElementById("messages");
let username = null;
let stompClient = null;
let connected = false;


(function () {
    if (!connected) connect();
})();

function sendMessage(event) {
    //if(!connected) connect();

    let messageText = document.getElementById("input-msg");
    if (messageText.value.trim().length < 1) return;

    let messageContent = messageText.value.trim();
    if (messageContent && stompClient) {
        let chatMessage = {
            sender: username,
            content: messageContent,
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
    // let messagesBox = document.getElementById("messages");
    // messagesBox.appendChild(newMessage);
    //
    // messageText.value = "";
}

function onMessageReceived(payload) {
    let message = JSON.parse(payload.body);

    // if(message.type === 'JOIN') {
    //     messageElement.classList.add('event-message');
    //     message.content = message.sender + ' joined!';
    // } else if (message.type === 'LEAVE') {
    //     messageElement.classList.add('event-message');
    //     message.content = message.sender + ' left!';
    // } else {}

    if (message.type === 'CHAT') {
        let newMessage = document.createElement("div");
        newMessage.className = 'message';
        newMessage.innerText = message.content;

        let hr = document.createElement('hr');
        hr.className = 'messages-divider';
        newMessage.appendChild(hr);

        messagesBox.appendChild(newMessage);
    }
}

function connect() {
    username = generateUUID();
    if (username) {
        let socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
    console.log("Connected");
    connected = true;
}

function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);

    stompClient.send('/app/chat.addUser', {}, JSON.stringify({sender: username, type: 'JOIN'}));
}

function onError(error) {
    console.log("Error: " + error);
}


function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

messageForm.addEventListener('submit', sendMessage, true);



