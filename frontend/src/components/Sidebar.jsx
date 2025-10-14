// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

// Placeholder icons - we can replace these later
const HomeIcon = () => <span>🏠</span>;
const ChatIcon = () => <span>💬</span>;
const JournalIcon = () => <span>📓</span>;

const navLinks = [
  { icon: <HomeIcon />, name: 'Home', path: '/dashboard' },
  { icon: <ChatIcon />, name: 'Chat', path: '/chat' },
  { icon: <JournalIcon />, name: 'Journal', path: '/journal' },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white h-screen p-4 flex flex-col border-r">
      <h1 className="text-2xl font-bold text-primary mb-10">MindEase</h1>
      <nav>
        <ul>
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center p-3 my-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'hover:bg-background text-text-secondary'
                  }`
                }
              >
                <span className="mr-4">{link.icon}</span>
                <span className="font-semibold">{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;