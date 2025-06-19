import { useMemo } from "react";
import { useHttp } from "../_base";

export function useApi() {
  const http = useHttp(
    "https://guess-the-spy.vercel.app",
    {
      Authorization: '',
    },
    function (e) {
      console.log(e);
      throw e;
    }
  );

  function getGame(roomName) {
    return http.get(`/api/game/${roomName}`);
  }

  function getRoom(roomName) {
    return http.get(`/api/rooms/${roomName}`);
  }

  function getAllRooms() {
    return http.get("/api/rooms");
  }

  function enterRoom(roomName, playerName) {
    http.post(`/api/rooms/${roomName}/${playerName}`)
  }

  function createRoom(room) {
    return http.post("api/rooms", room);
  }

  function getAllCategories() {
    return http.get(`/api/categories`);
  }

  function createCategory(category) {
    return http.post(`/api/categories`, category);
  }

  function createGame(roomName, playerName) {
    return http.post(`/api/game/${roomName}/${playerName}`);
  }

  function vote(roomName, playerName, otherPlayer) {
    return http.post(`api/game/${roomName}/${playerName}/vote/${otherPlayer}`);
  }

  function guessWord(roomName, playerName, password) {
    return http.post(`api/game/${roomName}/${playerName}/guess/${password}`);
  }

  function endGame(roomName) {
    return http.post(`api/game/${roomName}`);
  }

  return useMemo(
    () => ({
      getGame,
      getAllRooms,
      getRoom,
      enterRoom,
      createRoom,
      getAllCategories,
      createCategory,
      createGame,
      vote,
      guessWord,
      endGame
    }),
    []
  );
}
