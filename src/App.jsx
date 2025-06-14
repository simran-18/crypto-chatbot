import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
  <div>
 <ToastContainer position="top-right" autoClose={3000} />
  <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
  </BrowserRouter>
  </div>
  )
}

export default App
