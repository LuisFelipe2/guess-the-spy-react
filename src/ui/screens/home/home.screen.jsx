import { useState, useEffect } from "react";
import { ModalNewRoom } from "../../components";
import { useApi } from "../../../useApi/useApi";
import { PATH_LOBBY } from "../../../routes/paths"
import { useNavigate } from 'react-router-dom';
import "./home.screen.css";

const RoomCard = ({ room, onJoin }) => {
  return (
    <div className="room-card">
      <div className="room-header">
        <h3>{room.name}</h3>
        <span>Criado por: {room.adminName}</span>
      </div>
      <div className="room-details">
        <div>
          <span>Categoria: {room.categoryName.name}</span>
        </div>
        <div>
          <span>Jogadores: {room.players.length}/{room.maxPlayers}</span>
          <span>Mínimo: {room.minPlayers}</span>
        </div>
      </div>
      <div className="room-players">
        {room.players.map((player, index) => (
          <span key={index} className="player-tag">
            {player.name}
          </span>
        ))}
      </div>
      <button className="join-button" onClick={() => onJoin(room)}>
        Entrar
      </button>
    </div>
  );
};

export function HomeScreen() {
  const [username, setUsername] = useState("");
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("");

  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => { 
    async function getRooms() {
      const newRooms = await api.getAllRooms();
      console.log(newRooms);
      setRooms(newRooms);
    }
    getRooms()
  }, []);

  const handleCreateRoom = async (newRoom) => {
    newRoom.playerName = username;
    const newRoomRetorned = await api.createRoom(newRoom);
    console.log("Nova sala criada:", newRoomRetorned);

    // setRooms([...rooms, { ...newRoomRetorned, id: rooms.length + 1 }]);
    // setShowModal(false);
    localStorage.setItem("username", username)
    localStorage.setItem("roomName", newRoomRetorned.name)
    navigate(PATH_LOBBY)
  };

  const handleJoinRoom = async (room) => {
    if (!username) {
      alert("Por favor, digite seu nome antes de entrar em uma sala");
      return;
    }

    await api.enterRoom(room.name, username);
    console.log(`${username} entrando na sala ${room.name}`);
    localStorage.setItem("username", username)
    localStorage.setItem("roomName", room.name)
    navigate(PATH_LOBBY)
  };

  function handleClick() {
    if (!username) {
      alert("Por favor, digite seu nome antes de criar uma sala");
      return;
    }
    setShowModal(true)
  }

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="rooms-container">
      <div className="rooms-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Digite seu nome"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="name-input"
          />
        </div>
      </div>

      <div className="rooms-list">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} onJoin={handleJoinRoom} />
          ))
        ) : (
          <div className="no-rooms">Nenhuma sala encontrada</div>
        )}
      </div>

      <button className="create-room-button" onClick={handleClick}>
        Criar Nova Sala
      </button>

      {showModal && (
        <ModalNewRoom
          onCreate={handleCreateRoom}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}