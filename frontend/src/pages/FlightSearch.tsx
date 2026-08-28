import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plane, Clock, ArrowRight, Filter, ChevronDown, IndianRupee, Luggage } from 'lucide-react';

interface Flight {
  id: number;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  totalSeats: number;
  basePrice: number;
  aircraftType: string;
  duration: string;
}

const airlineLogos: Record<string, string> = {
  'IndiGo': '#2B5BA7', 'Air India': '#E42313', 'Vistara': '#5C2D91',
  'SpiceJet': '#FF6600', 'AirAsia India': '#E81932', 'GoFirst': '#00A650',
};

export default function FlightSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('departure');
  const [filterAirline, setFilterAirline] = useState('all');

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';

  useEffect(() => {
    setLoading(true);
    fetch(`/api/flights/search?origin=${from}&destination=${to}&date=${date}`)
      .then(r => r.json())
      .then(data => { setFlights(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [from, to, date]);

  const filtered = flights
    .filter(f => filterAirline === 'all' || f.airline === filterAirline)
    .sort((a, b) => {
      if (sortBy === 'price') return a.basePrice - b.basePrice;
      if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
      return a.departureTime.localeCompare(b.departureTime);
    });

  const uniqueAirlines = [...new Set(flights.map(f => f.airline))];

  const formatTime = (dt: string) => {
    const d = new Date(dt);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (dt: string) => {
    const d = new Date(dt);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a3a8a] to-[#1e40af] text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 text-2xl font-bold">
            <span>{from}</span>
            <ArrowRight className="w-6 h-6" />
            <span>{to}</span>
          </div>
          <p className="text-blue-200 text-sm mt-1">{date && formatDate(date + 'T00:00:00')} • {filtered.length} flights found</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-800">Filters</h3>
              </div>

              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 uppercase">Sort By</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50">
                  <option value="departure">Departure Time</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="duration">Duration</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Airline</label>
                <select value={filterAirline} onChange={e => setFilterAirline(e.target.value)}
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50">
                  <option value="all">All Airlines</option>
                  {uniqueAirlines.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <button onClick={() => { setFilterAirline('all'); setSortBy('departure'); }}
                className="mt-4 w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                Clear Filters
              </button>
            </div>
          </div>

          {/* Flight Results */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Searching flights across India...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">No flights found</h3>
                <p className="text-gray-400">Try changing your travel dates or routes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(flight => (
                  <div key={flight.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden group">
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Airline Info */}
                        <div className="flex items-center gap-3 md:w-44">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{ backgroundColor: airlineLogos[flight.airline] || '#666' }}>
                            {flight.airline.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{flight.airline}</p>
                            <p className="text-xs text-gray-400">{flight.flightNumber} • {flight.aircraftType}</p>
                          </div>
                        </div>

                        {/* Flight Times */}
                        <div className="flex items-center gap-6 flex-1 justify-center">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-800">{formatTime(flight.departureTime)}</p>
                            <p className="text-xs text-gray-400">{flight.originCode}</p>
                          </div>
                          <div className="flex flex-col items-center px-4">
                            <p className="text-xs text-gray-400 mb-1">{flight.duration}</p>
                            <div className="w-32 h-px bg-gray-300 relative">
                              <Plane className="w-4 h-4 text-blue-500 absolute -top-1.5 left-1/2 -translate-x-1/2 rotate-0" />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Non-stop</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-800">{formatTime(flight.arrivalTime)}</p>
                            <p className="text-xs text-gray-400">{flight.destinationCode}</p>
                          </div>
                        </div>

                        {/* Price & Book */}
                        <div className="flex items-center gap-4 md:w-52 justify-end">
                          <div className="text-right">
                            <p className="text-xs text-gray-400">{flight.availableSeats} seats left</p>
                            <div className="flex items-center justify-end">
                              <IndianRupee className="w-4 h-4 text-gray-400" />
                              <span className="text-2xl font-extrabold text-gray-800">{Math.round(flight.basePrice).toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-xs text-gray-400">per person</p>
                          </div>
                          <button onClick={() => navigate(`/flight/${flight.id}?date=${date}`)}
                            className="bg-gradient-to-r from-[#1a56db] to-[#1e40af] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:from-[#1e40af] hover:to-[#1a56db] transition shadow hover:shadow-lg">
                            Select →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
