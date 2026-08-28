import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plane, ArrowRight, XCircle, Clock, MapPin } from 'lucide-react';

interface Booking {
  id: number;
  bookingRef: string;
  passengerName: string;
  seatNumber: string;
  seatClass: string;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  travelDate: string;
  bookedAt: string;
  flight: {
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    originCode: string;
    destinationCode: string;
    departureTime: string;
    arrivalTime: string;
    aircraftType: string;
  };
}

export default function MyTrips() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetch('/api/bookings', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then(data => { setBookings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const cancelBooking = async (ref: string) => {
    setCancelling(ref);
    try {
      const res = await fetch(`/api/bookings/${ref}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.bookingRef === ref ? { ...b, status: 'CANCELLED' } : b));
      }
    } finally {
      setCancelling(null);
    }
  };

  const fmt = (dt: string) => new Date(dt).toLocaleString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
  });

  const activeBookings = bookings.filter(b => b.status !== 'CANCELLED');
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-16">
      <div className="bg-gradient-to-r from-[#1a3a8a] to-[#1e40af] text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-blue-200 mt-1">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total • {activeBookings.length} active</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No trips yet</h3>
            <p className="text-gray-400 mb-6">Book your first flight and it will appear here</p>
            <button onClick={() => navigate('/search')}
              className="bg-gradient-to-r from-[#1a56db] to-[#1e40af] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition">
              Search Flights
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {activeBookings.length > 0 && (
              <>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-600" /> Active Bookings
                </h2>
                {activeBookings.map(booking => (
                  <div key={booking.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Plane className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                              <span>{booking.flight.originCode}</span>
                              <ArrowRight className="w-4 h-4 text-blue-500" />
                              <span>{booking.flight.destinationCode}</span>
                            </div>
                            <p className="text-sm text-gray-500">{booking.flight.airline} • {booking.flight.flightNumber}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-sm">
                            <p className="text-gray-400 text-xs">Departure</p>
                            <p className="font-medium text-gray-800">{fmt(booking.flight.departureTime)}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-400 text-xs">Seat</p>
                            <p className="font-bold text-blue-600">{booking.seatNumber}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-400 text-xs">PNR</p>
                            <p className="font-bold text-gray-800">{booking.bookingRef}</p>
                          </div>
                          <div className="text-sm text-right">
                            <p className="text-gray-400 text-xs">Total</p>
                            <p className="font-bold text-blue-600">₹{Math.round(booking.totalPrice).toLocaleString('en-IN')}</p>
                          </div>
                          <button onClick={() => cancelBooking(booking.bookingRef)} disabled={cancelling === booking.bookingRef}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {cancelledBookings.length > 0 && (
              <>
                <h2 className="text-lg font-bold text-gray-400 flex items-center gap-2 mt-8">
                  <Clock className="w-5 h-5" /> Cancelled
                </h2>
                {cancelledBookings.map(booking => (
                  <div key={booking.id}
                    className="bg-gray-50 rounded-2xl border border-gray-200 p-5 opacity-60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-800 font-bold">{booking.flight.originCode} → {booking.flight.destinationCode}</span>
                        <span className="text-sm text-gray-500">{booking.flight.airline}</span>
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold">CANCELLED</span>
                      </div>
                      <span className="text-sm text-gray-400">PNR: {booking.bookingRef}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
