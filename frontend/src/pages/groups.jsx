import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [filters, setFilters] = useState({ search: '', courseName: '', faculty: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, [filters]);

  const fetchGroups = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await API.get(`/groups?${params}`);
      setGroups(res.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (groupId) => {
    try {
      await API.post(`/groups/${groupId}/join`);
      fetchGroups();
    } catch (err) {
      alert('Error joining group');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Study Groups</h1>
        <Link to="/groups/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create New Group
        </Link>
      </div>

      {/* Search Filters */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name or course..."
            className="p-2 border rounded"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <input
            type="text"
            placeholder="Filter by course name"
            className="p-2 border rounded"
            value={filters.courseName}
            onChange={(e) => setFilters({ ...filters, courseName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Filter by faculty"
            className="p-2 border rounded"
            value={filters.faculty}
            onChange={(e) => setFilters({ ...filters, faculty: e.target.value })}
          />
        </div>
      </div>

      {/* Groups List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <div key={group._id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
              <p className="text-gray-600 mb-2">
                {group.courseCode} - {group.courseName}
              </p>
              <p className="text-sm text-gray-500 mb-2">{group.faculty}</p>
              <p className="text-sm mb-3">{group.description.substring(0, 100)}...</p>
              <div className="flex justify-between items-center">
                <span className="text-sm">👥 {group.members.length} members</span>
                <div className="space-x-2">
                  <Link to={`/groups/${group._id}`} className="text-blue-600 hover:underline text-sm">
                    View
                  </Link>
                  <button
                    onClick={() => handleJoin(group._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups;