import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  FaTractor,
  FaStore,
  FaLeaf,
  FaChartLine,
  FaServer,
  FaRobot,
  FaUser,
} from 'react-icons/fa';

const features = [
  {
    icon: <FaLeaf />,
    title: 'Natural-language Shop Records Access',
    desc:
      'Farmers can query shop records using natural language in their local dialect, without needing technical knowledge.',
    bullets: [
      'Query by shop name, date range, or period',
      'Get secure access to shop databases',
      'Simple language interface for illiterate farmers',
    ],
  },
  {
    icon: <FaStore />,
    title: 'Digital Register Management',
    desc:
      'Shops can maintain digital records of daily transactions, replacing manual paper registers with easy-to-use digital solutions.',
    bullets: [
      'Daily record management without paperwork',
      'Easy modification and access to historical data',
      'Secure and organized digital register system',
    ],
  },
  {
    icon: <FaChartLine />,
    title: 'Record History & Analytics',
    desc: 'Access complete historical records with simple analytics for better decision making.',
    bullets: [
      'View records by date ranges',
      'Simple visual representations',
      'Exportable record data',
    ],
  },
  {
    icon: <FaServer />,
    title: 'MCP + RAG Pipeline Architecture',
    desc:
      'Advanced backend system that processes natural language queries through a multimodal RAG pipeline for accurate results.',
    bullets: [
      'Query validation and processing',
      'Vector database retrieval system',
      'MCP server tool integration with backend APIs',
    ],
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth) || {};
  const user = auth.user || {};
  const { role = 'farmer', name = 'Farmer', emailId = 'user@example.com' } = user;

  const theme = useSelector((state) => state.theme.theme);

  // Background classes based on theme
  const bgClass = theme === 'dark' 
    ? "min-h-screen overflow-y-auto bg-gradient-to-b from-black via-gray-900 to-gray-800 text-gray-100"
    : "min-h-screen overflow-y-auto bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 text-gray-800";

  const cardClass = theme === 'dark' 
    ? "p-6 rounded-2xl bg-gradient-to-br from-gray-900/40 to-black/40 border border-gray-700 shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
    : "p-6 rounded-2xl bg-gradient-to-br from-white to-gray-100/80 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)]";

  const featureCardClass = theme === 'dark' 
    ? "p-6 rounded-xl bg-gradient-to-br from-black/40 to-gray-900/30 border border-gray-700 hover:scale-[1.02] transition transform shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
    : "p-6 rounded-xl bg-gradient-to-br from-white to-gray-100/80 border border-gray-200 hover:scale-[1.02] transition transform shadow-[0_4px_12px_rgba(0,0,0,0.08)]";

  const primaryButtonClass = theme === 'dark' 
    ? "px-6 py-3 bg-gray-100 text-black font-semibold rounded-lg shadow hover:scale-[1.02] transition"
    : "px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow hover:scale-[1.02] transition";

  const secondaryButtonClass = theme === 'dark' 
    ? "px-6 py-3 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-900/40 transition"
    : "px-6 py-3 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-200/60 transition";

  const sectionClass = theme === 'dark' 
    ? "mt-12 p-6 rounded-xl bg-gradient-to-br from-gray-900/30 to-black/20 border border-gray-700 shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
    : "mt-12 p-6 rounded-xl bg-gradient-to-br from-white to-gray-100/80 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)]";

  const testimonialClass = theme === 'dark' 
    ? "p-6 rounded-xl bg-gradient-to-br from-black/30 to-gray-900/20 border border-gray-700 shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
    : "p-6 rounded-xl bg-gradient-to-br from-white to-gray-100/80 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)]";

  const titleColorClass = theme === 'dark' ? "text-gray-100" : "text-gray-800";
  const subtitleColorClass = theme === 'dark' ? "text-gray-300" : "text-gray-600";
  const mutedTextClass = theme === 'dark' ? "text-gray-400" : "text-gray-500";

  // Determine primary action based on role
  const getPrimaryAction = () => {
    const roleLower = role?.toLowerCase?.() || 'farmer';
    if (roleLower === 'shop') {
      return { path: '/shop', label: 'Manage Shop Records' };
    } else if (roleLower === 'mandi') {
      return { path: '/mandi/dashboard', label: 'Mandi Dashboard' };
    } else {
      return { path: '/farmer-query', label: 'Farmer Query' };
    }
  };

  const primaryAction = getPrimaryAction();

  return (
    <div className={bgClass}>
      <div className="h-16" />
      
      <div className="fixed top-4 right-4 z-10">
        <button 
          onClick={() => navigate('/profile')}
          className={`flex items-center gap-2 px-3 py-2 rounded-full ${theme === 'dark' ? 'bg-gray-800/70 hover:bg-gray-700/70' : 'bg-white/80 hover:bg-white'} backdrop-blur-sm transition-all shadow-md`}
          aria-label="Profile settings"
        >
          <FaUser className={theme === 'dark' ? "text-gray-300" : "text-gray-600"} />
          <span className={`text-sm font-medium ${theme === 'dark' ? "text-gray-200" : "text-gray-700"}`}>
            {name.split(' ')[0]}
          </span>
        </button>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden px-6 py-8">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${titleColorClass} mb-2`}>
            Welcome to AgriConnect
          </h1>
          <p className={`mt-2 text-base ${subtitleColorClass} mb-4`}>
            Digital register management for shops and secure record access for farmers.
          </p>
          
          <div className={`mb-6 text-sm ${mutedTextClass}`}>
            <div>Welcome back, <strong className={titleColorClass}>{name}</strong></div>
            <div>User ID: <strong className={titleColorClass}>{user._id || 'N/A'}</strong></div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(primaryAction.path)}
              className={primaryButtonClass}
            >
              {primaryAction.label}
            </button>
            <button
              onClick={() => navigate('/learn-more')}
              className={secondaryButtonClass}
            >
              Learn How It Works
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className={`text-xl font-bold ${titleColorClass} text-center mb-6`}>What We Offer</h2>
          <div className="space-y-4">
            {features.map((f, i) => (
              <div key={i} className={featureCardClass}>
                <div className={`text-2xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-3`}>{f.icon}</div>
                <h3 className={`font-semibold text-base ${titleColorClass}`}>{f.title}</h3>
                <p className={`mt-1 text-xs ${subtitleColorClass}`}>{f.desc}</p>
                <ul className={`mt-3 text-xs ${subtitleColorClass} space-y-1`}>
                  {f.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400'} mt-1.5 inline-block flex-shrink-0`} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={sectionClass + " mb-8"}>
          <h3 className={`text-lg font-semibold ${titleColorClass} mb-4 text-center`}>How It Works</h3>
          <div className="space-y-3 text-xs">
            <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-black/40 border-gray-700 text-gray-300' : 'bg-white/60 border-gray-200 text-gray-700'}`}>
              <div className="flex items-center gap-2"><FaServer className="text-base" /> <strong>Query Processing</strong></div>
              <p className="mt-1">Natural language queries are validated for required parameters like shop details and date ranges.</p>
            </div>
            <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-black/40 border-gray-700 text-gray-300' : 'bg-white/60 border-gray-200 text-gray-700'}`}>
              <div className="flex items-center gap-2"><FaRobot className="text-base" /> <strong>RAG Pipeline</strong></div>
              <p className="mt-1">Multimodal RAG processes queries, converts them to structured format, and retrieves relevant shop information.</p>
            </div>
            <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-black/40 border-gray-700 text-gray-300' : 'bg-white/60 border-gray-200 text-gray-700'}`}>
              <div className="flex items-center gap-2"><FaTractor className="text-base" /> <strong>MCP Integration</strong></div>
              <p className="mt-1">MCP server handles tool calls to backend APIs, returning accurate shop record data to farmers.</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className={`text-lg font-semibold ${titleColorClass} text-center mb-4`}>What Users Say</h3>
          <div className="space-y-4">
            <div className={testimonialClass}>
              <h4 className={`font-semibold text-sm ${titleColorClass}`}>Farmer Use-case</h4>
              <p className={`mt-1 text-xs ${subtitleColorClass}`}>"I can now check shop records from home using simple Hindi queries. No need to travel to the mandi for information."</p>
            </div>
            <div className={testimonialClass}>
              <h4 className={`font-semibold text-sm ${titleColorClass}`}>Shop Use-case</h4>
              <p className={`mt-1 text-xs ${subtitleColorClass}`}>"Digital registers have made record-keeping effortless. I can easily manage and modify my daily transactions."</p>
            </div>
            <div className={testimonialClass}>
              <h4 className={`font-semibold text-sm ${titleColorClass}`}>Marketplace Impact</h4>
              <p className={`mt-1 text-xs ${subtitleColorClass}`}>"Efficient, transparent, and accessible to all farmers regardless of literacy level. A game-changer for rural commerce."</p>
            </div>
          </div>
        </div>

        <footer className={`py-6 text-center text-xs border-t ${theme === 'dark' ? 'border-gray-800 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
          <div>© {new Date().getFullYear()} AgriConnect — Secure • Accessible • Efficient</div>
          <div className="mt-1">Version 1.0</div>
        </footer>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <header className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className={`text-5xl font-extrabold leading-tight ${titleColorClass} mb-4`}>
            AgriConnect
          </h1>
          <p className={`text-xl ${subtitleColorClass} max-w-2xl mx-auto mb-8`}>
            Digital register management for shops and natural language record access for farmers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(primaryAction.path)}
              className={primaryButtonClass}
            >
              {primaryAction.label}
            </button>
            <button
              onClick={() => navigate('/learn-more')}
              className={secondaryButtonClass}
            >
              Learn How It Works
            </button>
          </div>

          <div className={`mt-6 text-sm ${mutedTextClass}`}>
            Welcome back, <strong className={titleColorClass}>{name}</strong>
          </div>
          
          <div className={`mt-2 text-sm ${mutedTextClass}`}>
            User ID: <strong className={titleColorClass}>{user._id || 'N/A'}</strong>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-12">
          <section className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${titleColorClass} mb-4`}>What We Offer</h2>
            <p className={`${subtitleColorClass} max-w-2xl mx-auto`}>Digital register management for shops and natural language record access for farmers.</p>
          </section>

          <section className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div key={i} className={featureCardClass}>
                <div className={`text-3xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-4`}>{f.icon}</div>
                <h3 className={`font-semibold text-lg ${titleColorClass}`}>{f.title}</h3>
                <p className={`mt-2 text-sm ${subtitleColorClass}`}>{f.desc}</p>
                <ul className={`mt-4 text-sm ${subtitleColorClass} space-y-2`}>
                  {f.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400'} mt-2 inline-block`} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className={sectionClass}>
            <h3 className={`text-xl font-semibold ${titleColorClass} text-center mb-6`}>How It Works</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-black/40 border-gray-700 text-gray-300' : 'bg-white/60 border-gray-200 text-gray-700'}`}>
                <div className="flex items-center gap-3 justify-center mb-2"><FaServer className="text-lg" /> <strong>Query Processing</strong></div>
                <p className="mt-2 text-center">Natural language queries are validated for required parameters like shop details and date ranges.</p>
              </div>
              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-black/40 border-gray-700 text-gray-300' : 'bg-white/60 border-gray-200 text-gray-700'}`}>
                <div className="flex items-center gap-3 justify-center mb-2"><FaRobot className="text-lg" /> <strong>RAG Pipeline</strong></div>
                <p className="mt-2 text-center">Multimodal RAG processes queries, converts them to structured format, and retrieves relevant shop information.</p>
              </div>
              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-black/40 border-gray-700 text-gray-300' : 'bg-white/60 border-gray-200 text-gray-700'}`}>
                <div className="flex items-center gap-3 justify-center mb-2"><FaTractor className="text-lg" /> <strong>MCP Integration</strong></div>
                <p className="mt-2 text-center">MCP server handles tool calls to backend APIs, returning accurate shop record data to farmers.</p>
              </div>
            </div>
          </section>

          <section className="mt-12">
            <h3 className={`text-xl font-semibold ${titleColorClass} text-center mb-6`}>What Users Say</h3>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <div className={testimonialClass}>
                <h4 className={`font-semibold ${titleColorClass}`}>Farmer Use-case</h4>
                <p className={`mt-2 text-sm ${subtitleColorClass}`}>"I can now check shop records from home using simple Hindi queries. No need to travel to the mandi for information."</p>
              </div>
              <div className={testimonialClass}>
                <h4 className={`font-semibold ${titleColorClass}`}>Shop Use-case</h4>
                <p className={`mt-2 text-sm ${subtitleColorClass}`}>"Digital registers have made record-keeping effortless. I can easily manage and modify my daily transactions."</p>
              </div>
              <div className={testimonialClass}>
                <h4 className={`font-semibold ${titleColorClass}`}>Marketplace Impact</h4>
                <p className={`mt-2 text-sm ${subtitleColorClass}`}>"Efficient, transparent, and accessible to all farmers regardless of literacy level. A game-changer for rural commerce."</p>
              </div>
            </div>
          </section>

          <footer className={`mt-12 py-8 flex flex-col md:flex-row items-center justify-between text-sm border-t ${theme === 'dark' ? 'border-gray-800 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
            <div>© {new Date().getFullYear()} AgriConnect — Secure • Accessible • Efficient</div>
            <div className="mt-3 md:mt-0">Version 1.0</div>
          </footer>
        </main>
      </div>
    </div>
  );
}