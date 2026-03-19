// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todayData, setTodayData] = useState({
    sleep: 'Not recorded',
    steps: 'Not recorded',
    mood: 'Not recorded'
  });
  const [chartData, setChartData] = useState([]);
  const [insights, setInsights] = useState([]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || 'mock-token';
      
      // Fetch only essential data (recent entries) with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const fetchWithTimeout = (url) => 
        fetch(url, { 
          headers: { 'Authorization': `Bearer ${token}` },
          signal: controller.signal
        }).catch(() => null);
      
      try {
        const [moodRes, sleepRes, stepsRes] = await Promise.all([
          fetchWithTimeout('http://localhost:8000/api/health/mood?limit=7'),
          fetchWithTimeout('http://localhost:8000/api/health/sleep?limit=7'),
          fetchWithTimeout('http://localhost:8000/api/health/metrics?metric_type=steps&limit=7')
        ]);

        clearTimeout(timeoutId);

        // Process data sequentially to reduce CPU load
        if (moodRes?.ok) {
          const moodData = await moodRes.json();
          if (moodData.length > 0) {
            const latest = moodData[0];
            const moodLabels = { 1: 'Very Poor', 2: 'Poor', 3: 'Fair', 4: 'Fair', 5: 'Neutral', 
                                6: 'Good', 7: 'Good', 8: 'Very Good', 9: 'Excellent', 10: 'Excellent' };
            setTodayData(prev => ({
              ...prev,
              mood: moodLabels[latest.mood_score] || 'Recorded'
            }));
            
            // Set chart data
            const formatted = moodData
              .reverse()
              .slice(0, 7)
              .map((entry, index) => ({
                day: index + 1,
                mood: entry.mood_score
              }));
            setChartData(formatted);
          }
        }

        if (sleepRes?.ok) {
          const sleepData = await sleepRes.json();
          if (sleepData.length > 0) {
            const latest = sleepData[0];
            setTodayData(prev => ({
              ...prev,
              sleep: latest.sleep_duration_hours ? `${latest.sleep_duration_hours}h` : 'Recorded'
            }));
          }
        }

        if (stepsRes?.ok) {
          const stepsData = await stepsRes.json();
          if (stepsData.length > 0) {
            const latest = stepsData[0];
            setTodayData(prev => ({
              ...prev,
              steps: latest.value ? latest.value.toLocaleString() : '0'
            }));
          }
        }

      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          console.error('Fetch error:', fetchError);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Show UI immediately without waiting for all data
  if (loading && todayData.sleep === 'Not recorded') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-white/70">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = user?.first_name || user?.username || "User";

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
            <Link to="/journal" className="bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-full">
              Add Journal Entry
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Today's Insights */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Today's Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon="😴" 
            label="Sleep" 
            value={todayData.sleep} 
            goal="Track your sleep quality"
          />
          <StatCard 
            icon="👟" 
            label="Steps" 
            value={todayData.steps} 
            goal="Goal: 10,000 steps"
          />
          <StatCard 
            icon="😊" 
            label="Mood" 
            value={todayData.mood} 
            goal="Track your daily mood"
          />
        </div>
      </section>

      {/* Section 3: Mood Tracker & Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Mood Tracker</h3>
              <p className="text-white/70 mt-1">Mood Over the Last 7 Days</p>
            </div>
            <Link to="/journal" className="text-white/50 hover:text-brand-green">Add Entry →</Link>
          </div>
          <div className="mt-6 h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="day" 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    domain={[0, 10]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#10b981' }}
                    name="Mood Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-white/50">
                <div className="text-center">
                  <p className="text-lg mb-2">No data yet</p>
                  <Link to="/journal" className="text-brand-green hover:underline">Start tracking →</Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xl font-bold">Quick Actions</h3>
          <Link to="/chat" className="block text-center w-full bg-gradient-to-r from-brand-green to-brand-teal text-white font-semibold p-4 rounded-xl">
            Chat with AI
          </Link>
          <Link to="/journal" className="block text-center w-full bg-white/10 border border-white/20 text-white font-semibold p-4 rounded-xl">
            Add Journal Entry
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
          {loading ? (
            <div className="col-span-3 text-center text-white/50 py-8">Loading insights...</div>
          ) : insights.length > 0 ? (
            insights.slice(0, 3).map((insight, index) => (
              <InsightCard 
                key={insight.id || index}
                icon={["📈", "🌙", "🔥"][index] || "💡"}
                title={insight.title || "Insight"}
                text={insight.description || "Keep tracking your wellness journey!"}
              />
            ))
          ) : (
            <>
              <InsightCard 
                icon="📈" 
                title="Mood Pattern" 
                text="Start tracking your mood to see patterns and insights."
              />
              <InsightCard 
                icon="🌙" 
                title="Sleep Quality" 
                text="Record your sleep to get personalized recommendations."
              />
              <InsightCard 
                icon="🔥" 
                title="Wellness Journey" 
                text="Begin your wellness journey by adding journal entries."
              />
            </>
          )}
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