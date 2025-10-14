// src/pages/DashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// A reusable Stat Card component for "Today's Insights"
const StatCard = ({ icon, label, value, goal }) => (
  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-white/70">{label}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="bg-white/10 p-2 rounded-full">
        <span className="text-xl">{icon}</span>
      </div>
    </div>
    {goal && <p className="text-sm text-white/50 mt-2">{goal}</p>}
  </div>
);

// A reusable Insight Card component for "Mindy's Insights"
const InsightCard = ({ icon, title, text }) => (
  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
    <div className="flex items-center space-x-4">
      <div className="bg-brand-teal/50 p-3 rounded-full">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
    <p className="mt-4 text-white/70">{text}</p>
  </div>
);


const DashboardPage = () => {
  const userName = "Sophia"; // Placeholder name

  return (
    <div className="space-y-12">
      {/* Section 1: Welcome Header */}
      <section>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold">Welcome back, {userName} 👋</h1>
            <p className="text-lg mt-2 text-white/70">How are you feeling today?</p>
          </div>
          <div className="flex space-x-4">
            <Link to="/chat" className="bg-gradient-to-r from-brand-green to-brand-teal text-white font-semibold px-6 py-3 rounded-full">
              Chat with AI
            </Link>
            <Link to="/resources" className="bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-full">
              Explore Resources
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Today's Insights */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Today's Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon="😴" label="Sleep" value="7h 30m" goal="Good quality sleep" />
          <StatCard icon="👟" label="Steps" value="5,200" goal="Goal: 10,000 steps" />
          <StatCard icon="😊" label="Mood" value="Good" goal="Feeling positive today" />
        </div>
      </section>

      {/* Section 3: Mood Tracker & Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Mood Tracker</h3>
            <button className="text-white/50">...</button>
          </div>
          <p className="text-white/70 mt-1">Mood Over Time</p>
          <div className="mt-6 h-64 flex items-center justify-center text-white/50 bg-black/10 rounded-lg">
            [Chart Component will go here]
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xl font-bold">Quick Actions</h3>
          <Link to="/chat" className="block text-center w-full bg-gradient-to-r from-brand-green to-brand-teal text-white font-semibold p-4 rounded-xl">
            Chat with AI
          </Link>
          <Link to="/resources" className="block text-center w-full bg-white/10 border border-white/20 text-white font-semibold p-4 rounded-xl">
            Explore Resources
          </Link>
        </div>
      </section>

      {/* Section 4: Mindy's Insights For You */}
       <section>
        <h2 className="text-2xl font-bold mb-6">Mindy's Insights for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard icon="📈" title="Mood Pattern" text="Your mood has been consistently positive this week! Keep up the great work."/>
          <InsightCard icon="🌙" title="Sleep Quality" text="You've maintained a healthy sleep schedule. Mindy suggests continuing this routine."/>
          <InsightCard icon="🔥" title="Wellness Streak" text="12 days of consistent check-ins! You're building great habits."/>
        </div>
      </section>

      {/* Section 5: CTA */}
      <section className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Ready to continue your wellness journey?</h3>
          <p className="text-white/70 mt-1">Mindy is here to support you every step of the way.</p>
        </div>
        <div className="flex space-x-4">
           <Link to="/chat" className="bg-gradient-to-r from-brand-green to-brand-teal text-white font-semibold px-6 py-3 rounded-full">
              Start Conversation
            </Link>
            <Link to="/journal" className="bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-full">
              View Journal
            </Link>
             <Link to="/profile" className="bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-full">
              Preferences
            </Link>
        </div>
      </section>

    </div>
  );
};

export default DashboardPage;