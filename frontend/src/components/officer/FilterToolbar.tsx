import React from 'react';
import { Filter, Search } from 'lucide-react';

interface FilterToolbarProps {
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
  selectedPriority: string;
  onSelectPriority: (priority: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const DEPARTMENTS = ['ALL', 'Water Supply & Sewerage', 'Roads & Traffic', 'Sanitation & Waste', 'Electricity & Lighting', 'Public Health'];
const PRIORITIES = ['ALL', 'EMERGENCY', 'HIGH', 'MEDIUM', 'LOW'];

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  selectedDepartment,
  onSelectDepartment,
  selectedPriority,
  onSelectPriority,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="neo-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="neo-input"
            placeholder="Search master incidents by title, keyword, or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--accent-ai)' }} />
        </div>

        {/* Department Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="neo-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: 0 }}>
            <Filter size={14} /> DEPT:
          </span>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => onSelectDepartment(dept)}
              className={`neo-btn ${selectedDepartment === dept ? 'neo-btn-ai' : ''}`}
              style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Priority Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="neo-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: 0 }}>
            <Filter size={14} /> URGENCY:
          </span>
          {PRIORITIES.map((priority) => (
            <button
              key={priority}
              onClick={() => onSelectPriority(priority)}
              className={`neo-btn ${selectedPriority === priority ? (priority === 'EMERGENCY' ? 'neo-btn-emergency' : 'neo-btn-primary') : ''}`}
              style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
