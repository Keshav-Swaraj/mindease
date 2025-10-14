// src/pages/ProfilePage.jsx
import React from 'react';
import ToggleSwitch from '../components/ToggleSwitch';

// A small reusable component for the stat cards
const StatCard = ({ value, label }) => (
  <div className="bg-white/5 p-4 rounded-lg text-center">
    <p className="text-4xl font-bold">{value}</p>
    <p className="text-sm text-white/70 mt-1">{label}</p>
  </div>
);

const ProfilePage = () => {
  return (
    // The main content container now takes up the full space
    <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10">
      {/* --- Personal Information Section --- */}
      <section>
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-white/70 mt-1">Manage your personal information, preferences, and privacy settings</p>

        <div className="mt-6 border-t border-white/10 pt-6">
          <h3 className="font-semibold">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="text-sm text-white/70">Name</label>
              <input type="text" defaultValue="Sophia Chen" className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20" />
            </div>
            <div>
              <label className="text-sm text-white/70">Email</label>
              <input type="email" defaultValue="sophia.chen@email.com" className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-white/70">Phone Number</label>
              <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20" />
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-6">
          <h3 className="font-semibold">Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="text-sm text-white/70">Language</label>
              <select className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 appearance-none">
                <option>English</option>
                <option>Spanish</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-white/70">Time Zone</label>
              <select className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 appearance-none">
                <option>(UTC-08:00) Pacific Time</option>
                <option>(UTC-05:00) Eastern Time</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* --- Privacy Settings Section --- */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Privacy Settings</h2>
        <div className="mt-6 p-4 bg-black/20 rounded-lg flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Profile Visibility</h4>
            <p className="text-sm text-white/70">Control who can see your profile information.</p>
          </div>
          <ToggleSwitch enabled={true} />
        </div>
        <div className="mt-4 p-4 bg-black/20 rounded-lg flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Notifications</h4>
            <p className="text-sm text-white/70">Manage your notification preferences.</p>
          </div>
          <button className="bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold">Manage</button>
        </div>
      </section>

      {/* --- Engagement Overview --- */}
      <section className="mt-12">
          <h2 className="text-2xl font-bold">Engagement Overview</h2>
          <div className="mt-6 grid grid-cols-2 gap-6">
              <StatCard value="3" label="Programs Completed" />
              <StatCard value="15" label="Resources Saved" />
          </div>
      </section>

      {/* --- Save Button --- */}
      <div className="mt-8 flex justify-end">
          <button className="bg-gradient-to-r from-brand-green to-brand-teal text-white font-semibold px-8 py-3 rounded-full">
              Save Changes
          </button>
      </div>
    </div>
  );
};

export default ProfilePage;