import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Plane, Plus, Trash2, Edit, ArrowRight, Users } from 'lucide-react';

interface Flight {
  id: number; flightNumber: string; airline: string; origin: string; destination: string;
  originCode: string; destinationCode: string; departureTime: string; arrivalTime: string;
  availableSeats: number; totalSeats: number; basePrice: number; aircraftType: string;
}

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) { navigate('/login'); return; }
    fetch('/api/flights/search?origin=Delhi&destination=Mumbai&date=' + new Date().toISOString().split('T')[0])
      .then(r => r.json())
      .then(d => { setFlights(d); setLoading(false); });
  }, [user, isAdmin]);

  const deleteFlight = async (id: number) => {
    if (!confirm('Deactivate this flight?')) return;
    await fetch(`/api/admin/flights/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setFlights(prev => prev.filter(f => f.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-16">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <LayoutDashboard className="w-7 h-7" /> Admin Dashboard
            </div>
            <p className="text-purple-200 mt-1">Manage flights, routes, and pricing</p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl">
            <p className="text-sm text-purple-200">Logged in as</p>
            <p className="font-bold">{user?.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Flights', value: flights.length, icon: <Plane className="w-6 h-6" />, color: 'bg-blue-500' },
            { label: 'Airlines', value: new Set(flights.map(f => f.airline)).size, icon: <Users className="w-6 h-6" />, color: 'bg-purple-500' },
            { label: 'Avg Price', value: '₹' + Math.round(flights.reduce((s, f) => s + f.basePrice, 0) / (flights.length || 1)).toLocaleString('en-IN'), icon: <span className="text-xl">💰</span>, color: 'bg-amber-500' },
            { label: 'Total Seats', value: flights.reduce((s, f) => s + f.totalSeats, 0).toLocaleString('en-IN'), icon: <span className="text-xl">💺</span>, color: 'bg-green-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${stat.color} text-white rounded-xl flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Flights Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Flight Management</h2>
            <span className="text-sm text-gray-500">Showing sample Delhi→Mumbai flights</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">Flight</th>
                  <th className="px-5 py-3 text-left">Airline</th>
                  <th className="px-5 py-3 text-left">Route</th>
                  <th className="px-5 py-3 text-left">Departure</th>
                  <th className="px-5 py-3 text-left">Seats</th>
                  <th className="px-5 py-3 text-left">Price</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flights.map(flight => (
                  <tr key={flight.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-bold text-gray-800">{flight.flightNumber}</td>
                    <td className="px-5 py-4">{flight.airline}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1">
                        {flight.originCode} <ArrowRight className="w-3 h-3 text-gray-400" /> {flight.destinationCode}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {new Date(flight.departureTime).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${flight.availableSeats > 50 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {flight.availableSeats}/{flight.totalSeats}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-blue-600">₹{Math.round(flight.basePrice).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => deleteFlight(flight.id)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
