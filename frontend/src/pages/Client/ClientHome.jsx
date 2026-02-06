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
    <div className="min-h-screen text-white">
      <div className="p-8 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {getGreeting()}, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Welcome back to your dashboard
          </p>
        </div>


        {/*STATS */}
        <DashboardStats userRole="client" />


        {/*  GRID  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* AI CARD (GLASS HERO) */}
            <div className="
              relative
              rounded-3xl
              p-8
              bg-white/5
              border border-white/10
              shadow-xl
              hover:shadow-2xl
              hover:-translate-y-0.5
              transition-all
            ">
              <div className="flex items-center justify-between">

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Bot className="h-7 w-7 text-indigo-300" />
                    <h3 className="text-xl font-semibold text-white">Nyay-Sahay AI</h3>
                  </div>

                  <p className="text-gray-300 max-w-md mb-6">
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

                <div className="hidden md:flex w-24 h-24 rounded-full bg-white/10 border border-white/10 items-center justify-center">
                  <Scale className="h-12 w-12 text-indigo-300" />
                </div>

              </div>
            </div>


            {/* ================= ACTIVITY ================= */}
            <div className="bg-white/5 rounded-3xl border border-white/10 p-6 shadow-xl">
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
                    bg-white/5
                    border border-white/10
                    shadow-xl
                    hover:shadow-2xl
                    hover:-translate-y-0.5
                    transition
                  "
                >
                  <item.icon className="mx-auto mb-3 text-indigo-300" />
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>


          {/* RIGHT SIDE */}
          <div className="space-y-8">

            {/* PRICING BUBBLE */}
            <div className="relative overflow-hidden bg-white/5 rounded-3xl border border-white/10 p-6 shadow-xl">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-10 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold border border-indigo-500/30 shadow-sm">
                  First 5 Consultations Free
                </div>
                <h4 className="text-xl font-semibold text-white mt-3">Talk to an Advocate</h4>
                <p className="text-sm text-gray-300 mt-2">
                  Your first 5 consultations are free. After that, each consultation is
                  <span className="font-semibold text-indigo-200"> ₹199</span>.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>5 free sessions per client account</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-3xl border border-white/10 p-6 shadow-xl">
              <QuickActions userRole="client" />
            </div>


            {/* HELP CARD */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
              <div className="flex gap-3">
                <AlertTriangle className="text-amber-300" />
                <div>
                  <h4 className="font-semibold text-white">Need urgent help?</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Contact our emergency legal helpline immediately.
                  </p>
                  <a href="tel:9999872340" className="text-amber-200 text-sm underline">
                    📞 9999872340
                  </a>
                </div>
              </div>
            </div>


            {/* TIP CARD */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5 shadow-xl">
              <h4 className="font-semibold mb-2 text-white">💡 Legal Tip</h4>
              <p className="text-sm text-gray-300">
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
