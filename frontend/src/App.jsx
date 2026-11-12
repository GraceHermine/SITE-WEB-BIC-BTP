import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Method from './pages/Method.jsx';
import Maisons from './pages/Maisons.jsx';
import Finitions from './pages/Finitions.jsx';
import Realisations from './pages/Realisations.jsx';

function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Routes>                                      
          <Route path="/" element={<Home />} />
          <Route path="/method" element={<Method />} />
          <Route path="/maisons" element={<Maisons />} />
          <Route path="/finitions" element={<Finitions />} />
          <Route path="/realisations" element={<Realisations />} />
        </Routes>                 
      </main>
      <Footer />
    </>
  );
}

export default App;