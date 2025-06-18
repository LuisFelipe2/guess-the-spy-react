import "./chat-ballon.component.css"

export function ChatBallon({ name, isCurrentPlayer, children }) {
    return (
        <div
            className={`chat-ballon ${
                isCurrentPlayer ? "chat-ballon__dark" : ""
            }`}
        >
            <div className="chat-ballon__container">
                {!isCurrentPlayer && (
                    <p className="chat-ballon__name">{name}</p>
                )}
                <p className="chat-ballon__message">{children}</p>
            </div>
        </div>
    )
}
