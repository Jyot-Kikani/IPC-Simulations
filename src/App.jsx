import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SantaClaus from './pages/SantaClaus';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/santa-claus" element={<SantaClaus />} />
        {/* Add other routes later */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;