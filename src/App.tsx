import { Route, Routes } from 'react-router-dom'
import Home from "./components/Home"
import AboutMe from './components/AboutMe'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<AboutMe />} />
      </Routes>
    </div>
  )
}

export default App
