import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [myGroups, setMyGroups] = useState([]);
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [recentGroups, setRecentGroups] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const groupsRes = await API.get('/groups');
            const userGroups = groupsRes.data.filter(g =>
                g.members.some(m => m._id === user?.id)
            );
            setMyGroups(userGroups);
            setRecentGroups(groupsRes.data.slice(0, 5));

            const sessionsRes = await API.get('/sessions/my-sessions');
            setUpcomingSessions(sessionsRes.data.slice(0, 5));
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}!</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* My Groups */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">My Study Groups</h2>
                    {myGroups.length === 0 ? (
                        <p className="text-gray-600">You haven't joined any groups yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {myGroups.map(group => (
                                <li key={group._id}>
                                    <Link to={`/groups/${group._id}`} className="text-blue-600 hover:underline">
                                        {group.name} - {group.courseCode}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Upcoming Sessions */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Upcoming Study Sessions</h2>
                    {upcomingSessions.length === 0 ? (
                        <p className="text-gray-600">No upcoming sessions.</p>
                    ) : (
                        <ul className="space-y-2">
                            {upcomingSessions.map(session => (
                                <li key={session._id} className="border-b pb-2">
                                    <p className="font-medium">{session.title}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(session.date).toLocaleDateString()} at {session.time}
                                    </p>
                                    <p className="text-sm">Group: {session.group?.name}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Recently Created Groups */}
                <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Recently Created Groups</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recentGroups.map(group => (
                            <div key={group._id} className="border rounded p-3">
                                <h3 className="font-semibold">{group.name}</h3>
                                <p className="text-sm text-gray-600">{group.courseCode}</p>
                                <p className="text-sm">Members: {group.members.length}</p>
                                <Link to={`/groups/${group._id}`} className="text-blue-600 text-sm hover:underline">
                                    View Details →
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;