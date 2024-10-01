package com.example.chat.model;

public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;

    public ChatMessage(String content, String sender, MessageType type) {
        this.content = content;
        this.sender = sender;
        this.type = type;
    }

    public ChatMessage() {
    }

//    public String getContent() {
//        return content;
//    }

    public String getSender() {
        return sender;
    }

//    public MessageType getType() {
//        return type;
//    }

    public void setSender(String sender) {
        this.sender = sender;
    }

//    public void setContent(String content) {
//        this.content = content;
//    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
}
