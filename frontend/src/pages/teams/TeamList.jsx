import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamService } from '../../services/teamService';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const data = await teamService.getAll();
            setTeams(data);
        } catch (error) {
            toast.error('Failed to fetch teams');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px' }}>Maintenance Teams</h1>
                <Link to="/teams/new" className="btn btn-primary">
                    + Add Team
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {teams.length === 0 ? (
                    <Card>
                        <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px 0' }}>
                            No teams found
                        </div>
                    </Card>
                ) : (
                    teams.map((team) => (
                        <Card key={team._id}>
                            <div style={{ marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                                    {team.name}
                                </h3>
                                <span className="badge" style={{ background: 'var(--primary)', color: 'white' }}>
                                    {team.type}
                                </span>
                            </div>

                            {team.description && (
                                <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '16px' }}>
                                    {team.description}
                                </p>
                            )}

                            <div style={{ marginBottom: '12px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                    Team Lead
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                    {team.teamLead?.name || 'No Lead Assigned'}
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                    Members
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                    {team.members?.length || 0} Technicians
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Link
                                    to={`/teams/${team._id}`}
                                    className="btn btn-secondary"
                                    style={{ fontSize: '12px', padding: '8px 16px' }}
                                >
                                    View Details
                                </Link>
                                <Link
                                    to={`/teams/edit/${team._id}`}
                                    className="btn btn-primary"
                                    style={{ fontSize: '12px', padding: '8px 16px' }}
                                >
                                    Edit
                                </Link>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeamList;
