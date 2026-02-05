/**
 * Client Home Dashboard (Light Theme)
 */

import { useAuthStatus } from '../../hooks/useAuthQuery';
import { DashboardStats, RecentActivity, QuickActions } from '../../components/dashboard';
import { Avatar } from '../../components/ui/Avatar';
import {
  Scale,
  Shield,
  Clock,
  TrendingUp,
  AlertTriangle,
  Bot
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientHome = () => {
  const { data: authData } = useAuthStatus();
  const user = authData?.user;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="p-8 max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mb-10 flex items-center gap-4">
          <Avatar
            src={user?.profilePicture}
            name={user?.fullName}
            size="lg"
          />

          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {getGreeting()}, {user?.fullName?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back to your legal dashboard
            </p>
          </div>
        </div>


        {/* ================= STATS ================= */}
        <DashboardStats userRole="client" />


        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* ================= AI CARD (GLASS HERO) ================= */}
            <div className="
              relative
              rounded-3xl
              p-8
              bg-white
              border border-gray-200
              shadow-sm
              hover:shadow-lg
              hover:-translate-y-0.5
              transition-all
            ">
              <div className="flex items-center justify-between">

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Bot className="h-7 w-7 text-indigo-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Nyay-Sahay AI</h3>
                  </div>

                  <p className="text-gray-600 max-w-md mb-6">
                    Get instant legal advice, understand your rights,
                    and talk to our AI assistant anytime.
                  </p>

                  <Link
                    to="/client/ai-chat"
                    className="
                      inline-flex items-center gap-2
                      bg-indigo-600 text-white
                      px-5 py-2.5
                      rounded-xl
                      font-medium
                      hover:bg-indigo-700
                      transition
                    "
                  >
                    Start Consultation
                    <TrendingUp className="h-4 w-4" />
                  </Link>
                </div>

                <div className="hidden md:flex w-24 h-24 rounded-full bg-indigo-50 items-center justify-center">
                  <Scale className="h-12 w-12 text-indigo-400" />
                </div>

              </div>
            </div>


            {/* ================= ACTIVITY ================= */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <RecentActivity userRole="client" />
            </div>


            {/* ================= FEATURE CARDS ================= */}
            <div className="grid md:grid-cols-3 gap-6">

              {[
                { icon: Bot, title: "AI Assistance", desc: "24/7 legal help" },
                { icon: Shield, title: "Secure Platform", desc: "Your data protected" },
                { icon: Clock, title: "Fast Response", desc: "Instant advocate connect" }
              ].map((item, i) => (
                <div
                  key={i}
                  className="
                    p-6
                    text-center
                    rounded-2xl
                    bg-white
                    border border-gray-200
                    shadow-sm
                    hover:shadow-md
                    hover:-translate-y-0.5
                    transition
                  "
                >
                  <item.icon className="mx-auto mb-3 text-indigo-500" />
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>


          {/* RIGHT SIDE */}
          <div className="space-y-8">

            {/* PRICING BUBBLE */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-3xl border border-indigo-100 p-6 shadow-sm">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-indigo-200/40 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-sm animate-pulse">
                  First 5 Consultations Free
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mt-3">Talk to an Advocate</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Your first 5 consultations are free. After that, each consultation is
                  <span className="font-semibold text-indigo-700"> ₹199</span>.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  <span>5 free sessions per client account</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <QuickActions userRole="client" />
            </div>


            {/* HELP CARD */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex gap-3">
                <AlertTriangle className="text-amber-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Need urgent help?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Contact our emergency legal helpline immediately.
                  </p>
                  <a href="tel:1800NYAYAHELP" className="text-amber-700 text-sm underline">
                    📞 1800-NYAYA-HELP
                  </a>
                </div>
              </div>
            </div>


            {/* TIP CARD */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h4 className="font-semibold mb-2 text-gray-900">💡 Legal Tip</h4>
              <p className="text-sm text-gray-600">
                Always keep copies of contracts and receipts.
                They can be critical evidence.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
