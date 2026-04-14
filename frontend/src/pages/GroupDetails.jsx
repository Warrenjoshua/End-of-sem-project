import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await API.get(`/groups/${id}`);
        setGroup(res.data);
      } catch (err) {
        console.error('Error loading group details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  if (loading) return <div>Loading group details...</div>;
  if (!group) return <div>Group not found.</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{group.name}</h1>
      <p className="text-gray-600 mb-2">{group.courseCode} - {group.courseName}</p>
      <p className="text-gray-600 mb-2">Faculty: {group.faculty}</p>
      <p className="mb-4">{group.description}</p>
      <p className="text-sm text-gray-500">Meeting: {group.meetingLocation} ({group.meetingType})</p>
    </div>
  );
};

export default GroupDetails;
