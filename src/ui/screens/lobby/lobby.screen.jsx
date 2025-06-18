import "./lobby.screen.css"

import { CardPlayers, LobbyBox, ChatLobby, LobbyBoxVotacao, LobbyBoxGameOver } from "../../components"
import { useEffect, useRef, useState } from "react"
import SockJsClient from "react-stomp";
import { useApi } from "../../../useApi/useApi";


const TELA = {
    telaDeEspera: 0,
    gameOver: 1,
    votacao: 2,
}


export function LobbyScreen() {
    const [sala, setSala] = useState({})
    const [players, setPlayer] = useState([])
    const [game, setGame] = useState(null)
    const [tela, setTela] = useState(TELA.telaDeEspera)

    const [topicRoom, setTopicRoom] = useState([]);
    const [topicGame, setTopicGame] = useState([]);

    const api = useApi();
    const lobbyId = localStorage.getItem("roomName");
    const userAtual = localStorage.getItem("username");

    useEffect(() => {
        async function getRoom() {
            const room = await api.getRoom(lobbyId)
            setSala(room);
            setPlayer(room.players || []);
        }
        async function getGame() {
            try {
                const game = await api.getGame(lobbyId)
                setGame(game);
            } catch(e) {
                console.log(e);
            }
        }
        getGame()
        getRoom()
    }, [])

    async function handleClick() {
        await api.createGame(lobbyId, userAtual);
    }

    function handleMessage(msg) {
        setPlayer(msg.players);

        if (msg.isEndGame) {
            setTela(TELA.gameOver)
        }
    }

    function handleConnectFailure() {
        console.log("error");
    }

    function handleMessageGame(msg) {
        setGame(msg)
    }

    function handleClickEndGame() {
        setTela(TELA.votacao)
    }

    function handleConnect(setTopic, topic) {
        setTopic([topic]);
    }

    async function handleClickVote(nomeJogadorOuPalavra) {
        if (game.spy === userAtual && typeof nomeJogadorOuPalavra === 'string') {
            await api.guessWord(lobbyId, userAtual, nomeJogadorOuPalavra);
        } else {
            await api.vote(lobbyId, userAtual, nomeJogadorOuPalavra);
            
            // api.endGame(lobbyId)
            // TODO -> Realizar o fim de jogo quando houver votos suficiente
        }
    }

    async function handleNewGame() {
        // TODO -> Corrigir new game +
        await api.createGame(lobbyId, userAtual);
    }

    function renderScreen() {
        if (tela === TELA.telaDeEspera)
            return (
                <LobbyBox
                    sala={sala}
                    userAtual={userAtual}
                    onclick={handleClick}
                    game={game}
                    handleClickEndGame={handleClickEndGame}
                />
            )
        if (tela === TELA.votacao)
            return (
                <LobbyBoxVotacao
                    sala={sala}
                    userAtual={userAtual}
                    onClick={handleClickVote}
                    game={game}
                    players={players}
                />
            )
        if (tela === TELA.gameOver)
            return (
                <LobbyBoxGameOver
                    game={game}
                    onNewGame={handleNewGame}
                />
            )
    }

    return (
        <main className="lobby-main">
            <div className="left-container">
                <div className="box-info-users">
                    <div className="header-info-lobby">
                        <h1 className="header-info-lobby-title">
                            {sala.name}
                        </h1>
                    </div>
                    <div className="card-players-container">
                        {players.map((jogador, index) => (
                            <CardPlayers
                                key={index}
                                user={jogador.name}
                                isMe={jogador.name === userAtual}
                                votes={game?.votes?.[jogador.name]}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="right-container">
                {renderScreen()}
                <ChatLobby lobbyId={lobbyId} currentPlayer={userAtual} />
            </div>


            <SockJsClient
                url={"http://localhost:8080/websocket"}
                topics={topicRoom}
                autoReconnect={false}
                onConnectFailure={handleConnectFailure}
                onMessage={handleMessage}
                onConnect={() => handleConnect(setTopicRoom, "/topic/room/" + lobbyId)}
                subscribeHeaders={{ roomName: lobbyId }}
            />

            <SockJsClient
                url={"http://localhost:8080/websocket"}
                topics={topicGame}
                autoReconnect={false}
                onConnectFailure={handleConnectFailure}
                onMessage={handleMessageGame}
                onConnect={() => handleConnect(setTopicGame, "/topic/game/" + lobbyId)}
                subscribeHeaders={{ roomName: lobbyId }}
            />
        </main>
    )
}
