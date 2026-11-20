import './App.css';
import { Routes, Route, Outlet } from "react-router-dom";
import Home from './pages/Home.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Method from './pages/Method.jsx';
import Maisons from './pages/Maisons.jsx';
import Finitions from './pages/Finitions.jsx';
import Realisations from './pages/Realisations.jsx';
import About from './pages/About.jsx';
import Error from './pages/Error.jsx';
import Contacts from './pages/Contacts.jsx';

// Layout commun : Header + main + Footer
function SiteLayout() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Toutes les pages du site avec header + footer */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/method" element={<Method />} />
        <Route path="/maisons" element={<Maisons />} />
        <Route path="/finitions" element={<Finitions />} />
        <Route path="/realisations" element={<Realisations />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contacts />} />
      </Route>

      {/* 404 plein écran, sans header ni footer */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;