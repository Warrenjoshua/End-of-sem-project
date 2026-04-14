import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    name: '',
    courseName: '',
    courseCode: '',
    faculty: '',
    description: '',
    meetingLocation: '',
    meetingType: 'physical'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/groups', formData);
      navigate('/groups');
    } catch (err) {
      setError('Failed to create group. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Create Study Group</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Group Name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded" />
        <input name="courseName" placeholder="Course Name" value={formData.courseName} onChange={handleChange} className="w-full p-3 border rounded" />
        <input name="courseCode" placeholder="Course Code" value={formData.courseCode} onChange={handleChange} className="w-full p-3 border rounded" />
        <input name="faculty" placeholder="Faculty" value={formData.faculty} onChange={handleChange} className="w-full p-3 border rounded" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded" rows="4" />
        <input name="meetingLocation" placeholder="Meeting Location" value={formData.meetingLocation} onChange={handleChange} className="w-full p-3 border rounded" />
        <select name="meetingType" value={formData.meetingType} onChange={handleChange} className="w-full p-3 border rounded">
          <option value="physical">Physical</option>
          <option value="online">Online</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          Create Group
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
