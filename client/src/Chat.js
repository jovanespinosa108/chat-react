import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    // async is used for
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: 
                    new Date(Date.now()).getHours() + ":" + 
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    // listen changes in the socket
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <div className='chat-window'>
            <div className='chat-header'>
                <p>Live Chat</p>
            </div>
            <div className='chat-body'>
                <ScrollToBottom className='message-container'>
                    {messageList.map((messageContent) => {
                        return(
                            <div 
                                className='message' 
                                id={username === messageContent.author ? "sender" : "receiver"}
                            >
                                <div>
                                    <div className='message-content'>
                                        <p>{messageContent.message}</p>
                                    </div>

                                    <div className='message-meta'>
                                        <p id='time'>{messageContent.time}</p>
                                        <p id='author'>{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </ScrollToBottom>
            </div>
            <div className='chat-footer'>
                <input 
                    type='text'
                    value={currentMessage} 
                    placeholder='Message' 
                    onChange={(event) => {
                     setCurrentMessage(event.target.value);
                    }}
                    onKeyUp={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </div>
    );
}

export default Chat;
