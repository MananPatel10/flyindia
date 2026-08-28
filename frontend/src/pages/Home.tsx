import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Clock, Shield, CreditCard, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [airports, setAirports] = useState<{city: string; code: string}[]>([]);

  useEffect(() => {
    fetch('/api/flights/airports').then(r => r.json()).then(setAirports);
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to && date) {
      navigate(`/search?from=${from}&to=${to}&date=${date}`);
    }
  };

  const swapCities = () => {
    setFrom(to);
    setTo(from);
  };

  const airlines = [
    { name: 'IndiGo', color: '#2B5BA7', flights: '1800+ daily', tagline: 'On Time. Every Time.' },
    { name: 'Air India', color: '#E42313', flights: '900+ daily', tagline: 'Maharaja\'s Hospitality' },
    { name: 'Vistara', color: '#5C2D91', flights: '600+ daily', tagline: 'Fly the New Feeling' },
    { name: 'SpiceJet', color: '#FF6600', flights: '500+ daily', tagline: 'At SpiceJet, It\'s Low Fares Made Easy' },
  ];

  const features = [
    { icon: <Shield className="w-6 h-6" />, title: 'Secure Booking', desc: '256-bit SSL encrypted transactions' },
    { icon: <CreditCard className="w-6 h-6" />, title: 'Easy Payments', desc: 'UPI, Cards, Net Banking & Wallets' },
    { icon: <Clock className="w-6 h-6" />, title: 'Instant Confirmation', desc: 'E-ticket delivered in seconds' },
    { icon: <Star className="w-6 h-6" />, title: 'Best Prices', desc: 'Compare across 100+ airlines' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#0f1b4c] via-[#1a3a8a] to-[#1e40af] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20"><Plane className="w-96 h-96 -rotate-12" /></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32">
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
              Fly Across <span className="text-amber-300">India</span>
            </h1>
            <p className="text-lg text-blue-200 max-w-xl mx-auto">
              Search, compare and book flights across 20+ Indian cities with the best airlines at unbeatable prices
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">From</label>
                <select value={from} onChange={e => setFrom(e.target.value)} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50">
                  <option value="">Select City</option>
                  {airports.map(a => <option key={a.code} value={a.city}>{a.city} ({a.code})</option>)}
                </select>
              </div>

              <div className="flex justify-center">
                <button type="button" onClick={swapCities}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-2 transition -my-2 z-10">
                  <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">To</label>
                <select value={to} onChange={e => setTo(e.target.value)} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50">
                  <option value="">Select City</option>
                  {airports.map(a => <option key={a.code} value={a.city}>{a.city} ({a.code})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Travel Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
              </div>
            </div>
            <button type="submit"
              className="mt-4 w-full bg-gradient-to-r from-[#1a56db] to-[#1e40af] text-white font-bold py-3.5 rounded-xl hover:from-[#1e40af] hover:to-[#1a56db] transition-all shadow-lg hover:shadow-xl text-lg">
              Search Flights ✈
            </button>
          </form>
        </div>
      </div>

      {/* Airlines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {airlines.map(a => (
            <div key={a.name} className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition group cursor-pointer">
              <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: a.color }}>
                {a.name.charAt(0)}
              </div>
              <h3 className="font-bold text-gray-800">{a.name}</h3>
              <p className="text-sm text-gray-500">{a.tagline}</p>
              <p className="text-xs text-blue-600 font-semibold mt-2">{a.flights}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Book With Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Routes */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Popular Routes in India</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { from: 'Delhi', to: 'Mumbai', price: '₹3,499' },
              { from: 'Bangalore', to: 'Goa', price: '₹2,799' },
              { from: 'Delhi', to: 'Bangalore', price: '₹4,199' },
              { from: 'Mumbai', to: 'Kolkata', price: '₹3,899' },
              { from: 'Chennai', to: 'Delhi', price: '₹4,599' },
              { from: 'Hyderabad', to: 'Mumbai', price: '₹3,299' },
            ].map((r, i) => (
              <div key={i} onClick={() => {
                setFrom(r.from); setTo(r.to); navigate(`/search?from=${r.from}&to=${r.to}&date=${date}`);
              }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition cursor-pointer border border-gray-100">
                <div>
                  <p className="font-bold text-gray-800">{r.from} → {r.to}</p>
                  <p className="text-sm text-gray-500">Multiple airlines</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-bold">From {r.price}</p>
                  <p className="text-xs text-gray-400">one way</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
                <Plane className="w-6 h-6" /> Fly<span className="text-amber-300">India</span>
              </div>
              <p className="text-sm">India's most trusted flight booking platform. Book domestic flights across 20+ cities with all major airlines.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white cursor-pointer transition">Domestic Flights</li>
                <li className="hover:text-white cursor-pointer transition">International Flights</li>
                <li className="hover:text-white cursor-pointer transition">Flight Status</li>
                <li className="hover:text-white cursor-pointer transition">Check-in</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Airlines</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white cursor-pointer transition">IndiGo</li>
                <li className="hover:text-white cursor-pointer transition">Air India</li>
                <li className="hover:text-white cursor-pointer transition">Vistara</li>
                <li className="hover:text-white cursor-pointer transition">SpiceJet</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2026 FlyIndia. All rights reserved. Made in India 🇮🇳
          </div>
        </div>
      </footer>
    </div>
  );
}
