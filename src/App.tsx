import { Route, Routes } from 'react-router-dom'
import Home from "./routes/Home"
import SpaceGame from './routes/SpaceGame'
import AutomatingMinecraft from './routes/AutomatingMinecraft'
import Billiards from './routes/Billiards'
import Pacman from './routes/Pacman'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SpaceGame" element={<SpaceGame />} />
        <Route path="/AutomatingMinecraft" element={<AutomatingMinecraft />} />
        <Route path="/Billiards" element={<Billiards />} />
        <Route path="/Pacman" element={<Pacman />} />
      </Routes>
    </div>
  )
}

export default App
