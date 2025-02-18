import { createRoot } from 'react-dom/client'
import './index.css'
import MenuMemoryGame from './Game.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
          <Route path="/zohar-gifs-host/" element={<App />} />
          <Route path="/zohar-gifs-host/game" element={<MenuMemoryGame />} />
        </Routes>
    </BrowserRouter>
);
