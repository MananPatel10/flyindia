import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FlightSearch from './pages/FlightSearch';
import FlightDetail from './pages/FlightDetail';
import BookingConfirmation from './pages/BookingConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import MyTrips from './pages/MyTrips';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<FlightSearch />} />
                  <Route path="/flight/:id" element={<FlightDetail />} />
                  <Route path="/booking/:ref" element={<BookingConfirmation />} />
                  <Route path="/my-trips" element={<MyTrips />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
