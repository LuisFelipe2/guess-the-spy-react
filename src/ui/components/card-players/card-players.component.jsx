import "./card-players.component.css"

export function CardPlayers({
    user,
    isMe,
    votes
}) {
    return (
        <>
            <div className="container-cardPlayer">
                <div className="header-cardPlayer">
                    <div className="player-info-container">
                        <div className="player-name-container">
                            <h2 className="player-name ">{user}</h2>
                            {isMe ? <p>*</p> : ""}
                        </div>
                        <p className="player-score">{votes==null?0:votes} Votos</p>
                    </div>
                </div>
            </div>
        </>
    )
}
