import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Results from './pages/Results'
import RoomDetail from './pages/RoomDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/resultados"    element={<Results />} />
        <Route path="/habitacion/:id" element={<RoomDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
