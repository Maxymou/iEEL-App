import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SubCategories from './pages/SubCategories';
import Materiels from './pages/Materiels';
import MaterielDetail from './pages/MaterielDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<SubCategories />} />
        <Route path="/sous-category/:id" element={<Materiels />} />
        <Route path="/materiel/:id" element={<MaterielDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
