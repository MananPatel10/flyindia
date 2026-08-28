import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Plane, ArrowRight, IndianRupee, CreditCard, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Flight {
  id: number; flightNumber: string; airline: string; origin: string; destination: string;
  originCode: string; destinationCode: string; departureTime: string; arrivalTime: string;
  basePrice: number; aircraftType: string; duration: string; availableSeats: number;
}

interface Seat {
  id: number; seatNumber: string; seatClass: string; available: boolean; price: number;
  row: number; column: string;
}

export default function FlightDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [flight, setFlight] = useState<Flight | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [seatClassFilter, setSeatClassFilter] = useState('ECONOMY');
  const [step, setStep] = useState(1); // 1=seats, 2=passenger, 3=payment
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  const [passenger, setPassenger] = useState({
    name: user?.name || '', email: user?.email || '', phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');

  useEffect(() => {
    Promise.all([
      fetch(`/api/flights/${id}`).then(r => r.json()),
      fetch(`/api/flights/${id}/seats`).then(r => r.json()),
    ]).then(([f, s]) => { setFlight(f); setSeats(s); setLoading(false); });
  }, [id]);

  const filteredSeats = seats.filter(s => s.seatClass === seatClassFilter);

  const formatTime = (dt: string) => new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (dt: string) => new Date(dt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const totalPrice = selectedSeat?.price || flight?.basePrice || 0;

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedSeat) return;
    setBooking(true);
    setError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          flightId: flight?.id,
          seatNumber: selectedSeat.seatNumber,
          seatClass: selectedSeat.seatClass,
          passengerName: passenger.name,
          passengerEmail: passenger.email,
          passengerPhone: passenger.phone,
          paymentMethod,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Booking failed');
      }
      const data = await res.json();
      navigate(`/booking/${data.bookingRef}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Flight not found</p>
      </div>
    );
  }

  const classColors: Record<string, string> = {
    'BUSINESS': 'bg-purple-100 text-purple-700 border-purple-300',
    'PREMIUM_ECONOMY': 'bg-amber-100 text-amber-700 border-amber-300',
    'ECONOMY': 'bg-blue-100 text-blue-700 border-blue-300',
  };

  const seatBg = (s: Seat) => {
    if (!s.available) return 'bg-gray-300 cursor-not-allowed';
    if (selectedSeat?.seatNumber === s.seatNumber) return 'bg-green-500 text-white ring-2 ring-green-700';
    return 'bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-16">
      {/* Flight Summary Banner */}
      <div className="bg-gradient-to-r from-[#1a3a8a] to-[#1e40af] text-white py-5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold">
                <span>{flight.origin}</span>
                <ArrowRight className="w-5 h-5" />
                <span>{flight.destination}</span>
              </div>
              <p className="text-blue-200 text-sm mt-1">{flight.airline} • {flight.flightNumber} • {flight.aircraftType}</p>
            </div>
            <div className="flex items-center gap-6 mt-3 md:mt-0">
              <div className="text-center">
                <p className="text-lg font-bold">{formatTime(flight.departureTime)}</p>
                <p className="text-xs text-blue-200">{flight.originCode}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-blue-200">{flight.duration}</p>
                <div className="w-20 h-px bg-blue-300 my-1"></div>
                <p className="text-xs text-blue-300">Non-stop</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{formatTime(flight.arrivalTime)}</p>
                <p className="text-xs text-blue-200">{flight.destinationCode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          {['Select Seat', 'Passenger Details', 'Payment & Confirm'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${step === i + 1 ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
              {i < 2 && <div className={`w-12 h-px ${step > i + 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Step 1: Seat Selection */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Your Seat</h2>
                <div className="flex gap-2 mb-6">
                  {['BUSINESS', 'PREMIUM_ECONOMY', 'ECONOMY'].map(cls => (
                    <button key={cls} onClick={() => { setSeatClassFilter(cls); setSelectedSeat(null); }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${seatClassFilter === cls ? classColors[cls] + ' border' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {cls.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Aircraft Layout */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
                      <Plane className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-600">Nose → {flight.aircraftType}</span>
                    </div>
                  </div>

                  {/* Column Labels */}
                  <div className="flex justify-center gap-1 mb-2">
                    {['A', 'B', 'C'].map(col => (
                      <div key={col} className="w-10 text-center text-xs font-bold text-gray-400">{col}</div>
                    ))}
                    <div className="w-6"></div>
                    {['D', 'E', 'F'].map(col => (
                      <div key={col} className="w-10 text-center text-xs font-bold text-gray-400">{col}</div>
                    ))}
                  </div>

                  {/* Seats */}
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {Array.from(new Set(filteredSeats.map(s => s.row))).sort((a, b) => a - b).map(row => (
                      <div key={row} className="flex justify-center gap-1">
                        {['A', 'B', 'C'].map(col => {
                          const seat = filteredSeats.find(s => s.row === row && s.column === col);
                          return seat ? (
                            <button key={col} disabled={!seat.available}
                              onClick={() => setSelectedSeat(seat)}
                              className={`w-10 h-10 rounded-lg text-xs font-bold flex items-center justify-center transition ${seatBg(seat)}`}>
                              {seat.seatNumber}
                            </button>
                          ) : <div key={col} className="w-10 h-10"></div>;
                        })}
                        <div className="w-6 flex items-center justify-center text-xs text-gray-400 font-medium">{row}</div>
                        {['D', 'E', 'F'].map(col => {
                          const seat = filteredSeats.find(s => s.row === row && s.column === col);
                          return seat ? (
                            <button key={col} disabled={!seat.available}
                              onClick={() => setSelectedSeat(seat)}
                              className={`w-10 h-10 rounded-lg text-xs font-bold flex items-center justify-center transition ${seatBg(seat)}`}>
                              {seat.seatNumber}
                            </button>
                          ) : <div key={col} className="w-10 h-10"></div>;
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div> Available</span>
                    <span className="flex items-center gap-1"><div className="w-4 h-4 bg-green-500 rounded"></div> Selected</span>
                    <span className="flex items-center gap-1"><div className="w-4 h-4 bg-gray-300 rounded"></div> Booked</span>
                  </div>
                </div>

                {selectedSeat && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="font-bold text-blue-800">Seat {selectedSeat.seatNumber} selected — ₹{Math.round(selectedSeat.price).toLocaleString('en-IN')}</p>
                  </div>
                )}

                <button onClick={() => selectedSeat && setStep(2)} disabled={!selectedSeat}
                  className="mt-4 w-full bg-gradient-to-r from-[#1a56db] to-[#1e40af] text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue to Passenger Details →
                </button>
              </div>
            )}

            {/* Step 2: Passenger Details */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Passenger Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name (as on ID)</label>
                    <input type="text" value={passenger.name} onChange={e => setPassenger({ ...passenger, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      placeholder="Enter full name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                      <input type="email" value={passenger.email} onChange={e => setPassenger({ ...passenger, email: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
                      <input type="tel" value={passenger.phone} onChange={e => setPassenger({ ...passenger, phone: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition">← Back</button>
                  <button onClick={() => passenger.name && passenger.email && setStep(3)}
                    disabled={!passenger.name || !passenger.email}
                    className="flex-1 bg-gradient-to-r from-[#1a56db] to-[#1e40af] text-white font-bold py-3 rounded-xl transition disabled:opacity-50">
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallets'].map(method => (
                    <label key={method}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === method ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value={method} checked={paymentMethod === method}
                        onChange={e => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600" />
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-700">{method}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Base Fare ({flight.airline})</span>
                    <span>₹{Math.round(flight.basePrice).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Seat {selectedSeat?.seatNumber} ({selectedSeat?.seatClass?.replace('_', ' ')})</span>
                    <span>₹{Math.round((selectedSeat?.price || 0) - flight.basePrice).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t mt-2 pt-2 flex justify-between font-bold text-gray-800">
                    <span>Total Amount</span>
                    <span className="text-blue-600 text-lg">₹{Math.round(totalPrice).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition">← Back</button>
                  <button onClick={handleBook} disabled={booking}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 shadow-lg">
                    {booking ? 'Booking...' : `Pay ₹${Math.round(totalPrice).toLocaleString('en-IN')} & Confirm`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar - Fare Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">Fare Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Route</span><span className="font-medium">{flight.originCode} → {flight.destinationCode}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{formatDate(flight.departureTime)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Departure</span><span className="font-medium">{formatTime(flight.departureTime)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Arrival</span><span className="font-medium">{formatTime(flight.arrivalTime)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Aircraft</span><span className="font-medium">{flight.aircraftType}</span></div>
                {selectedSeat && (
                  <>
                    <div className="border-t pt-3 flex justify-between"><span className="text-gray-500">Seat</span><span className="font-bold">{selectedSeat.seatNumber}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Class</span><span className="font-medium">{selectedSeat.seatClass.replace('_', ' ')}</span></div>
                  </>
                )}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="text-xl font-extrabold text-blue-600 flex items-center">
                  <IndianRupee className="w-4 h-4" />{Math.round(totalPrice).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
