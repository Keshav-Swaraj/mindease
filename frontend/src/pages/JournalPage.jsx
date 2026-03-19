// src/pages/JournalPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const JournalPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('view');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingEntry, setEditingEntry] = useState(null);

  // Data states
  const [journalEntries, setJournalEntries] = useState({ sleep: [], mood: [], steps: [] });
  const [loadingEntries, setLoadingEntries] = useState(true);

  // Form data - simplified
  const [formData, setFormData] = useState({
    type: 'mood',
    date: new Date().toISOString().split('T')[0],
    // Mood fields
    mood_score: 5,
    notes: '',
    // Sleep fields
    sleep_duration_hours: '',
    sleep_quality_score: 5,
    // Steps fields
    steps: ''
  });

  const loadJournalEntries = async () => {
    try {
      setLoadingEntries(true);
      const token = localStorage.getItem('token') || 'mock-token';
      
      // Use timeout to prevent long waits
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const fetchWithTimeout = (url) => 
        fetch(url, { 
          headers: { 'Authorization': `Bearer ${token}` },
          signal: controller.signal
        }).catch(() => null);
      
      try {
        const [sleepRes, stepsRes, moodRes] = await Promise.all([
          fetchWithTimeout('http://localhost:8000/api/health/sleep?limit=20'),
          fetchWithTimeout('http://localhost:8000/api/health/metrics?metric_type=steps&limit=20'),
          fetchWithTimeout('http://localhost:8000/api/health/mood?limit=20')
        ]);

        clearTimeout(timeoutId);

        const [sleepData, stepsData, moodData] = await Promise.all([
          sleepRes?.ok ? sleepRes.json() : Promise.resolve([]),
          stepsRes?.ok ? stepsRes.json() : Promise.resolve([]),
          moodRes?.ok ? moodRes.json() : Promise.resolve([])
        ]);

        setJournalEntries({ sleep: sleepData, steps: stepsData, mood: moodData });
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          console.error('Fetch error:', fetchError);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setLoadingEntries(false);
    }
  };

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token') || 'mock-token';
      let url = '';
      let body = {};

      if (formData.type === 'sleep') {
        url = editingEntry 
          ? `http://localhost:8000/api/health/sleep/${editingEntry.id}`
          : 'http://localhost:8000/api/health/sleep';
        body = {
          date: formData.date + 'T00:00:00',
          sleep_duration_hours: formData.sleep_duration_hours ? parseFloat(formData.sleep_duration_hours) : null,
          sleep_quality_score: formData.sleep_quality_score,
          sleep_notes: formData.notes
        };
      } else if (formData.type === 'mood') {
        url = editingEntry
          ? `http://localhost:8000/api/health/mood/${editingEntry.id}`
          : 'http://localhost:8000/api/health/mood';
        body = {
          date: formData.date + 'T00:00:00',
          mood_score: formData.mood_score,
          notes: formData.notes
        };
      } else if (formData.type === 'steps') {
        url = 'http://localhost:8000/api/health/metrics';
        body = {
          date: formData.date + 'T00:00:00',
          metric_type: 'steps',
          value: parseFloat(formData.steps),
          notes: formData.notes
        };
      }

      const method = editingEntry ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: editingEntry ? 'Entry updated successfully!' : 'Entry saved successfully!' });
        setFormData({
          type: formData.type,
          date: new Date().toISOString().split('T')[0],
          mood_score: 5,
          notes: '',
          sleep_duration_hours: '',
          sleep_quality_score: 5,
          steps: ''
        });
        setEditingEntry(null);
        loadJournalEntries();
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.detail || 'Failed to save entry' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving entry' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry, type) => {
    setEditingEntry({ ...entry, type });
    setActiveTab('add');
    setFormData({
      type,
      date: new Date(entry.date).toISOString().split('T')[0],
      mood_score: entry.mood_score || 5,
      sleep_duration_hours: entry.sleep_duration_hours || '',
      sleep_quality_score: entry.sleep_quality_score || 5,
      steps: entry.value || '',
      notes: entry.notes || entry.sleep_notes || ''
    });
  };

  const handleDelete = async (id, type) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const token = localStorage.getItem('token') || 'mock-token';
      let url = '';
      
      if (type === 'sleep') {
        url = `http://localhost:8000/api/health/sleep/${id}`;
      } else if (type === 'mood') {
        url = `http://localhost:8000/api/health/mood/${id}`;
      } else if (type === 'steps') {
        url = `http://localhost:8000/api/health/metrics/${id}`;
      }

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Entry deleted successfully!' });
        loadJournalEntries();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting entry' });
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="mb-6">You need to be signed in to access your journal.</p>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  const EntryCard = ({ entry, type }) => (
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-white/50">
              {new Date(entry.date).toLocaleDateString()}
            </span>
          </div>
          {type === 'mood' && (
            <div>
              <div className="text-sm text-white/70 mb-1">Mood Score</div>
              <div className="text-2xl font-bold text-brand-green">{entry.mood_score}/10</div>
            </div>
          )}
          {type === 'sleep' && (
            <div>
              <div className="text-sm text-white/70 mb-1">Sleep</div>
              <div className="text-2xl font-bold text-brand-teal">
                {entry.sleep_duration_hours ? `${entry.sleep_duration_hours}h` : 'N/A'}
              </div>
              <div className="text-xs text-white/50 mt-1">Quality: {entry.sleep_quality_score}/10</div>
            </div>
          )}
          {type === 'steps' && (
            <div>
              <div className="text-sm text-white/70 mb-1">Steps</div>
              <div className="text-2xl font-bold text-brand-purple">{entry.value}</div>
            </div>
          )}
          {entry.notes && (
            <div className="text-sm text-white/60 mt-2">{entry.notes}</div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(entry, type)}
            className="text-brand-green hover:text-brand-teal text-sm px-3 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(entry.id, type)}
            className="text-red-400 hover:text-red-300 text-sm px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Daily Journal 📝</h1>
              <p className="text-white/70 mt-1">Track your daily wellness</p>
            </div>
            <Link to="/dashboard" className="text-white/70 hover:text-white">← Back to Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex space-x-4 border-b border-white/10 mb-6">
          <button
            onClick={() => { setActiveTab('view'); setEditingEntry(null); }}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'view'
                ? 'border-b-2 border-brand-green text-brand-green'
                : 'text-white/70 hover:text-white'
            }`}
          >
            📋 View Entries
          </button>
          <button
            onClick={() => { setActiveTab('add'); setEditingEntry(null); }}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'add'
                ? 'border-b-2 border-brand-green text-brand-green'
                : 'text-white/70 hover:text-white'
            }`}
          >
            ➕ Add Entry
          </button>
        </div>

        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}>
            {message.text}
          </div>
        )}

        {activeTab === 'view' && (
          <div className="space-y-8">
            {/* Mood Entries */}
            <div>
              <h2 className="text-2xl font-bold mb-4">😊 Mood Entries</h2>
              {loadingEntries ? (
                <div className="text-center text-white/50 py-8">Loading...</div>
              ) : journalEntries.mood.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {journalEntries.mood.map(entry => (
                    <EntryCard key={entry.id} entry={entry} type="mood" />
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/50 py-8">No mood entries yet</div>
              )}
            </div>

            {/* Sleep Entries */}
            <div>
              <h2 className="text-2xl font-bold mb-4">😴 Sleep Entries</h2>
              {journalEntries.sleep.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {journalEntries.sleep.map(entry => (
                    <EntryCard key={entry.id} entry={entry} type="sleep" />
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/50 py-8">No sleep entries yet</div>
              )}
            </div>

            {/* Steps Entries */}
            <div>
              <h2 className="text-2xl font-bold mb-4">👟 Steps Entries</h2>
              {journalEntries.steps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {journalEntries.steps.map(entry => (
                    <EntryCard key={entry.id} entry={entry} type="steps" />
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/50 py-8">No steps entries yet</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">
              {editingEntry ? '✏️ Edit Entry' : '➕ Add New Entry'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-white/70">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20"
                  required
                >
                  <option value="mood">Mood</option>
                  <option value="sleep">Sleep</option>
                  <option value="steps">Steps</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-white/70">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20"
                  required
                />
              </div>

              {formData.type === 'mood' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-white/70">
                      Mood Score: {formData.mood_score}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.mood_score}
                      onChange={(e) => setFormData({ ...formData, mood_score: parseInt(e.target.value) })}
                      className="w-full mt-2"
                    />
                  </div>
                </>
              )}

              {formData.type === 'sleep' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-white/70">Sleep Duration (hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={formData.sleep_duration_hours}
                      onChange={(e) => setFormData({ ...formData, sleep_duration_hours: e.target.value })}
                      className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20"
                      placeholder="e.g., 7.5"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70">
                      Sleep Quality: {formData.sleep_quality_score}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.sleep_quality_score}
                      onChange={(e) => setFormData({ ...formData, sleep_quality_score: parseInt(e.target.value) })}
                      className="w-full mt-2"
                    />
                  </div>
                </>
              )}

              {formData.type === 'steps' && (
                <div>
                  <label className="text-sm font-medium text-white/70">Number of Steps</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.steps}
                    onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                    className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20"
                    placeholder="e.g., 5000"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-white/70">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20"
                  rows="3"
                  placeholder="Add any notes..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-brand-green to-brand-teal text-white font-semibold py-3 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingEntry ? 'Update Entry' : 'Save Entry'}
                </button>
                {editingEntry && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEntry(null);
                      setFormData({
                        type: 'mood',
                        date: new Date().toISOString().split('T')[0],
                        mood_score: 5,
                        notes: '',
                        sleep_duration_hours: '',
                        sleep_quality_score: 5,
                        steps: ''
                      });
                    }}
                    className="px-6 bg-white/10 border border-white/20 text-white font-semibold py-3 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
