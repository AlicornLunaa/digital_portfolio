import { Route, Routes } from 'react-router-dom'
import Home from "./routes/Home"
import SpaceGame from './routes/SpaceGame'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SpaceGame" element={<SpaceGame />} />
      </Routes>
    </div>
  )
}

export default App
