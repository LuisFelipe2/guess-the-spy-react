import "./lobby-box.component.css"

export function LobbyBox({ sala, onclick, handleClickEndGame, game, userAtual }) {

    function handleClick() {
        onclick()
    }

    return (
        <div className="CardInGame">
            <div className="box-info-ingame">
                <div className="header-info-lobby-ingame">
                    <h1 className="lobby-title">{sala?.categoryName?.name}</h1>
                </div>

                {game == null ?
                    <button
                        className="btn-comecar-game"
                        onClick={handleClick}
                    >
                        "Iniciar partida"
                    </button>
                    :
                    <button
                        className="btn-comecar-game"
                        onClick={handleClickEndGame}
                    >
                        "Iniciar votação"
                    </button>
                }


                {game != null &&
                    <div className="right-panel">
                        <div className="papel-box">
                            {game.spy == userAtual ? (
                                <p>🕵️‍♂️ Você é o <strong>espião</strong>!</p>
                            ) : (
                                <p>🔐 Palavra secreta: <strong>{game.password}</strong></p>
                            )}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
