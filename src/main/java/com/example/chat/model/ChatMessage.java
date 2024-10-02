package com.example.chat.model;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private ZonedDateTime date;

    public ChatMessage(String content, String sender, MessageType type, ZonedDateTime date) {
        this.content = content;
        this.sender = sender;
        this.type = type;
        this.date = date;
    }

    public ChatMessage() {
    }

    public String getContent() {
        return content;
    }

    public String getSender() {
        return sender;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }
}
