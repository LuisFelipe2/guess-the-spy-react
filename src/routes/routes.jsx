import { Routes, Route } from "react-router-dom"
import { HomeScreen, LobbyScreen } from "../ui/screens"
import { PATH_HOME, PATH_LOBBY } from "./paths"


export function RoutesNavigator() {
    return (
        <>
            <Routes >
                <Route path={PATH_HOME} exact element={<HomeScreen />} />
                <Route path={PATH_LOBBY} exact element={<LobbyScreen />} />
                <Route path="/" element={<HomeScreen />} />
            </Routes >
        </>
    )
}
