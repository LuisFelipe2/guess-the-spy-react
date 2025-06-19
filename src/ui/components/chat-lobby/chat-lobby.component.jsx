import { useEffect, useRef, useState } from "react";
import SockJsClient from "react-stomp";
import { ChatBallon } from "..";
import "./chat-lobby.component.css";

const TOPIC_CHAT = "/topic/chat/";
const APP_MSG = "/app/chat/";

export function ChatLobby({ lobbyId, currentPlayer }) {
  const [chatTopic, setChatTopic] = useState([]);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  
  const client = useRef(null);
  const divRef = useRef(null);

  function handleMessage(msg) {
    setChatMessages((messages) => [...messages, msg]);
    divRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  function handleInputChange(event) {
    const { value } = event.target;
    setMessage(value);
  }

  function handleSendMessage(event) {
    event.preventDefault();

    if (!!message) {
      client.current.sendMessage(
        APP_MSG + lobbyId,
        JSON.stringify({
          name: currentPlayer,
          content: message,
        })
      );
      setMessage("");
    } else {
      console.warn("WebSocket não está conectado ainda")
    }
  }

  function loadSocket() {
    return (
      !!lobbyId && (
        <SockJsClient
          url={"https://guess-the-spy.vercel.app/websocket"}
          topics={chatTopic}
          autoReconnect={false}
          onMessage={handleMessage}
          subscribeHeaders={{ roomName: lobbyId }}
          onConnect={() => setChatTopic([TOPIC_CHAT + lobbyId])}
          onDisconnect={() => console.warn("❌ WebSocket desconectado")}
          onConnectFailure={(err) => console.error("Erro ao conectar WebSocket", err)}
          debug={true}
          ref={client}
        />
      )
    );
  }

  return (
    <div className="chat-lobby">
      {loadSocket()}
      <div className="chat-lobby__chat">
        {chatMessages.map((msg, i) => {
          const isCurrentPlayer = msg.name === currentPlayer;
          return (
            <div
              key={i}
              className={`chat-lobby__chat-ballon ${isCurrentPlayer ? "chat-lobby__chat-ballon-player" : ""
                }`}
            >
              <ChatBallon name={msg.name} isCurrentPlayer={isCurrentPlayer}>
                {msg.content}
              </ChatBallon>
            </div>
          );
        })}
        <div ref={divRef}></div>
      </div>

      <form onSubmit={handleSendMessage}>
        <input
          value={message}
          name="message"
          onChange={handleInputChange}
          className="form-control chat-lobby__input"
          id="message"
          placeholder="Envie uma mensagem"
        />
      </form>
    </div>
  );
}
