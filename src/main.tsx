import { createRoot } from 'react-dom/client'
import './index.css'
import MenuMemoryGame from './Game.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename='/zohar-gifs-host'>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/game" element={<MenuMemoryGame />} />
        </Routes>
    </BrowserRouter>
);
