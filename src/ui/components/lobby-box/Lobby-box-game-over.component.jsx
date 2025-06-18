import "./lobby-box.component.css"

export function LobbyBoxGameOver({ game, onNewGame }) {
    const mostVotedPlayer = Object.entries(game?.votes || {}).reduce((a, b) => 
        a[1] > b[1] ? a : b, ["", -1])[0];

    return (
        <div className="CardInGame">
            <div className="box-info-ingame">
                <div className="header-info-lobby-ingame">
                    <h1 className="lobby-title">Resultados</h1>
                </div>

                <div className="right-panel">
                    <div className="papel-box">
                        <h3>Fim do jogo!</h3>
                        <p>O espião era: <strong>{game.spy}</strong></p>
                        <p>Quem recebeu mais votos: <strong>{mostVotedPlayer || "Ninguém"}</strong></p>
                        <p>Palavra que o espião descobriu: <strong>{game.passwordGuess}</strong></p>
                        <p>Palavra secreta: <strong>{game.password}</strong></p>
                        
                        {game.passwordGuess?.toLowerCase() === game.password.toLowerCase() ? (
                            <p>O espião decobriu a palavra secreta! Espião venceu!</p>
                        ) :
                        mostVotedPlayer.toLowerCase() === game.spy.toLowerCase() ?
                            <p>O espião foi descoberto!</p>
                        :
                         (
                            <p>O espião não descobriu a palavra secreta, entretanto também não foi descoberto</p>
                        )}
                    </div>

                    <button
                        className="btn-comecar-game"
                        onClick={onNewGame}
                    >
                        Nova partida
                    </button>
                </div>
            </div>
        </div>
    )
}