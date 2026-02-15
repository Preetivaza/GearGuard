require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const equipmentRoutes = require('./routes/equipment');
const teamRoutes = require('./routes/team');
const requestRoutes = require('./routes/request');
const statsRoutes = require('./routes/stats');
const userRoutes = require('./routes/user');
const seedRoutes = require('./routes/seed');
const attachmentRoutes = require('./routes/attachment');
const notificationRoutes = require('./routes/notification');
const sparePartRoutes = require('./routes/sparePart');
const slaRoutes = require('./routes/sla');
const budgetRoutes = require('./routes/budget');
const auditLogRoutes = require('./routes/auditLog');
const testActivityRoutes = require('./routes/testActivities');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // In development, allow all localhost origins
        if (origin.startsWith('http://localhost:')) {
            return callback(null, true);
        }

        // In production, check against CLIENT_URL
        if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'GearGuard API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/spare-parts', sparePartRoutes);
app.use('/api/slas', slaRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/test-activities', testActivityRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
