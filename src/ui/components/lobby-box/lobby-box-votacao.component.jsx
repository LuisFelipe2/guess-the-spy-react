import { useEffect, useState } from "react"
import "./lobby-box.component.css"

export function LobbyBoxVotacao({ sala, onClick, game, userAtual, players }) {
    const [voto, setVoto] = useState(null);
    const [palavraChute, setPalavraChute] = useState("");

    function votar(nomeJogador) {
        setVoto(nomeJogador)
        onClick(nomeJogador)
    }

    function handlePalavraChuteChange(e) {
        setPalavraChute(e.target.value);
    }

    function enviarPalavraChute() {
        if (palavraChute.trim()) {
            onClick(palavraChute);
        }
    }

    const isSpy = game.spy === userAtual;

    return (
        <div className="CardInGame">
            <div className="box-info-ingame">
                <div className="header-info-lobby-ingame">
                    <h1 className="lobby-title">{sala?.categoryName?.name}</h1>
                </div>

                        {!isSpy ? (
                            <div className="votacao-box">
                                <h4>Vote em quem você acha que é o espião:</h4>
                                <div className="vote-buttons">
                                    {players
                                        ?.filter((j) => j.name !== userAtual)
                                        .map((jogador, index) => (
                                            <button
                                                key={index}
                                                className={`vote-button ${voto === jogador.name ? "voted" : ""}`}
                                                onClick={() => votar(jogador.name)}
                                                disabled={voto !== null}
                                            >
                                                {jogador.name}
                                            </button>
                                        ))}
                                </div>
                                {!!voto && <p className="vote-confirm">Você votou em <strong>{voto}</strong></p>}
                            </div>
                        ) : (
                            <div className="votacao-box">
                                <h4>Tente adivinhar a palavra secreta:</h4>
                                <input
                                    type="text"
                                    value={palavraChute}
                                    onChange={handlePalavraChuteChange}
                                    placeholder="Digite sua resposta"
                                    className="chat-lobby__input"
                                    disabled={voto !== null}
                                />
                                <button
                                    className="vote-button"
                                    onClick={enviarPalavraChute}
                                    disabled={!palavraChute.trim() || voto !== null}
                                >
                                    Enviar resposta
                                </button>
                                {!!voto && <p className="vote-confirm">Você enviou: <strong>{voto}</strong></p>}
                            </div>
                        )}
            </div>
        </div>
    )
}