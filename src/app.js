import { BrowserRouter } from "react-router-dom"
import "./app.css"
import { RoutesNavigator } from "./routes/routes"

function App() {
    return (
        <BrowserRouter>
            <RoutesNavigator />
        </BrowserRouter>
    )
}

export default App
