import { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';
import './CalendarView.css';

const CalendarView = () => {
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCalendarData();
    }, [currentDate]);

    const fetchCalendarData = async () => {
        try {
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            const data = await requestService.getCalendarData(month, year);
            setEvents(data);
        } catch (error) {
            toast.error('Failed to fetch calendar data');
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const getEventsForDay = (day) => {
        if (!day) return [];
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const dayDate = new Date(year, month, day);

        return events.filter((event) => {
            const eventDate = new Date(event.start);
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() === month &&
                eventDate.getFullYear() === year
            );
        });
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const monthYear = currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '24px', fontSize: '28px' }}>Preventive Maintenance Calendar</h1>

            <Card>
                <div className="calendar-header">
                    <button onClick={previousMonth} className="btn btn-secondary">
                        ← Previous
                    </button>
                    <h2>{monthYear}</h2>
                    <button onClick={nextMonth} className="btn btn-secondary">
                        Next →
                    </button>
                </div>

                <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="calendar-day-header">
                            {day}
                        </div>
                    ))}

                    {getDaysInMonth().map((day, index) => {
                        const dayEvents = getEventsForDay(day);
                        const isToday =
                            day &&
                            day === new Date().getDate() &&
                            currentDate.getMonth() === new Date().getMonth() &&
                            currentDate.getFullYear() === new Date().getFullYear();

                        return (
                            <div
                                key={index}
                                className={`calendar-day ${day ? '' : 'empty'} ${isToday ? 'today' : ''}`}
                            >
                                {day && (
                                    <>
                                        <div className="calendar-day-number">{day}</div>
                                        <div className="calendar-events">
                                            {dayEvents.map((event) => (
                                                <div
                                                    key={event.id}
                                                    className={`calendar-event priority-${event.priority.toLowerCase()}`}
                                                    title={`${event.title} - ${event.equipment}`}
                                                >
                                                    <div className="event-title">{event.title}</div>
                                                    <div className="event-equipment">{event.equipment}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            <div style={{ marginTop: '24px' }}>
                <Card title="Upcoming Preventive Maintenance">
                    {events.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px 0' }}>
                            No scheduled preventive maintenance
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {events.slice(0, 5).map((event) => (
                                <div
                                    key={event.id}
                                    style={{
                                        padding: '16px',
                                        background: 'var(--light)',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                            {event.title}
                                        </div>
                                        <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                                            📦 {event.equipment} • {event.team}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                                            {new Date(event.start).toLocaleDateString()}
                                        </div>
                                        <span className={`badge badge-${event.priority.toLowerCase()}`}>
                                            {event.priority}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default CalendarView;
