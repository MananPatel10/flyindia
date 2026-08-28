import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plane, User, LogOut, LayoutDashboard, MapPin } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-[#1a3a8a] to-[#1e40af] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Plane className="w-6 h-6" />
            </div>
            <span>
              <span className="text-white">Fly</span>
              <span className="text-amber-300">India</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/search" className="flex items-center gap-1.5 text-sm hover:text-amber-300 transition font-medium">
              <MapPin className="w-4 h-4" /> Search Flights
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-1.5 text-sm hover:text-amber-300 transition font-medium">
                    <LayoutDashboard className="w-4 h-4" /> Admin
                  </Link>
                )}
                <Link to="/my-trips" className="flex items-center gap-1.5 text-sm hover:text-amber-300 transition font-medium">
                  <User className="w-4 h-4" /> My Trips
                </Link>
                <div className="flex items-center gap-3 border-l border-white/20 pl-4">
                  <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
                    {user.name}
                  </span>
                  <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm hover:text-amber-300 transition">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm hover:text-amber-300 transition font-medium">Login</Link>
                <Link to="/register" className="bg-amber-400 text-[#1a3a8a] px-4 py-1.5 rounded-full text-sm font-bold hover:bg-amber-300 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
