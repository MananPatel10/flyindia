import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Plane, Download, ArrowRight } from 'lucide-react';

interface Booking {
  bookingRef: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
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

export default function BookingConfirmation() {
  const { ref } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings/${ref}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then(data => { setBooking(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ref]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Booking not found</p>
      </div>
    );
  }

  const fmt = (dt: string) => new Date(dt).toLocaleString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Banner */}
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed! 🎉</h1>
          <p className="text-gray-500">Your flight has been booked successfully</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1a3a8a] to-[#1e40af] text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-200 text-sm">Booking Reference</p>
                <p className="text-3xl font-extrabold tracking-wider">{booking.bookingRef}</p>
              </div>
              <div className="text-right">
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold border border-green-400/30">
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          {/* Flight Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{booking.flight.airline}</p>
                  <p className="text-xs text-gray-400">{booking.flight.flightNumber}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">{booking.flight.aircraftType}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{booking.flight.originCode}</p>
                <p className="text-sm text-gray-400">{booking.flight.origin}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">{fmt(booking.flight.departureTime).split(',')[1]}</p>
              </div>
              <div className="flex flex-col items-center">
                <ArrowRight className="w-6 h-6 text-blue-500" />
                <p className="text-xs text-gray-400 mt-1">Non-stop</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{booking.flight.destinationCode}</p>
                <p className="text-sm text-gray-400">{booking.flight.destination}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">{fmt(booking.flight.arrivalTime).split(',')[1]}</p>
              </div>
            </div>
          </div>

          {/* Passenger & Seat */}
          <div className="p-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Passenger</p>
              <p className="font-bold text-gray-800">{booking.passengerName}</p>
              <p className="text-sm text-gray-500">{booking.passengerEmail}</p>
              {booking.passengerPhone && <p className="text-sm text-gray-500">{booking.passengerPhone}</p>}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Seat & Class</p>
              <p className="font-bold text-gray-800">Seat {booking.seatNumber}</p>
              <p className="text-sm text-gray-500">{booking.seatClass.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Travel Date</p>
              <p className="font-bold text-gray-800">{booking.travelDate ? fmt(booking.travelDate).split(',')[0] : 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Total Paid</p>
              <p className="font-bold text-blue-600 text-lg">₹{Math.round(booking.totalPrice).toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 flex justify-between items-center text-sm text-gray-500">
            <span>Booked on {fmt(booking.bookedAt)}</span>
            <span>Payment: {booking.paymentMethod}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8 justify-center">
          <Link to="/my-trips"
            className="bg-gradient-to-r from-[#1a56db] to-[#1e40af] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition">
            View My Trips
          </Link>
          <Link to="/"
            className="border border-gray-300 px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition">
            Book Another Flight
          </Link>
        </div>
      </div>
    </div>
  );
}
