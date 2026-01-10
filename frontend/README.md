# 🔧 Maintenance Management System

A complete MERN stack maintenance management system inspired by Odoo's workflow.

## ✨ Features

### Core Functionality (Odoo-Inspired)
1. **Dashboard KPIs** - Real-time metrics (total requests, avg resolution time, downtime)
2. **Auto-Assignment** - Automatically assigns requests to teams based on equipment category and workload
3. **Kanban Board** - Drag-and-drop work management (New → In Progress → Done)
4. **Smart Buttons** - Equipment detail pages showing maintenance history and statistics
5. **Scrap Management** - End-of-life equipment lifecycle with request blocking
6. **Status Workflow** - Automatic timestamps and equipment updates

### Technical Features
- JWT authentication with role-based access (admin, manager, technician, viewer)
- RESTful API with comprehensive endpoints
- MongoDB with Mongoose schemas
- React with modern hooks and context API
- Responsive, modern UI with gradient designs

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Clone and Install
```bash
cd backend
npm install

cd ../frontend
npm install
```

#### 2. Configure Backend
Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/maintenance-db
JWT_SECRET=your_secret_key_here
```

#### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### 4. Access Application
- Frontend: http://localhost:5173 (or 3000)
- Backend API: http://localhost:5000

---

## 📖 Complete Project Flow (Demo Script)

### "After login, the user lands on a dashboard showing maintenance KPIs."
✅ **Dashboard** displays:
- Total requests, open requests, completed requests
- Average resolution time
- Preventive vs corrective maintenance ratio
- Team workload distribution
- Equipment downtime statistics

### "Users create maintenance requests linked to equipment."
✅ **Create Request Form**:
1. Select equipment from dropdown
2. Choose request type (Preventive/Corrective/Emergency)
3. Set priority (Low/Medium/High/Very High)
4. Enter title and description
5. Schedule date/time
6. Submit → Creates request in database

### "The system auto-assigns the correct maintenance team."
✅ **Auto-Assignment Logic**:
```javascript
// Finds teams matching equipment category
// Calculates current workload for each team
// Assigns to team with LOWEST workload
```

### "Technicians manage work through a Kanban board."
✅ **Kanban Board**:
- Drag cards between columns: **New → In Progress → Done**
- Status change triggers automatic updates:
  - → In Progress: Sets `startDate`
  - → Done: Sets `completionDate`, calculates duration

### "Preventive jobs appear on a calendar."
⚠️ **Calendar View**: Not yet implemented (future enhancement)

### "Smart buttons connect equipment to its maintenance history."
✅ **Equipment Detail Page**:
- Click equipment → View detail page
- **Smart Buttons** show:
  - 📊 Total maintenance requests
  - ✅ Completed requests
  - ⚙️ Active requests
  - ⏱️ Total downtime (hours)
  - 💰 Total maintenance cost
- Full maintenance history timeline below

### "Scrap logic marks end-of-life assets."
✅ **Scrap Management**:
- Click "Mark as Scrap" button on equipment
- System blocks creation of new maintenance requests
- Cannot scrap equipment with active requests
- Equipment status changes to "Scrap"

---

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js                  # Role-based users
│   ├── Team.js                  # Teams with specialization
│   ├── Equipment.js             # Equipment with schedules
│   └── MaintenanceRequest.js    # Requests with auto-ID
├── controllers/
│   ├── authController.js
│   ├── teamController.js
│   ├── equipmentController.js   # Smart buttons, scrap logic
│   └── requestController.js     # Auto-assignment, KPIs
├── routes/
│   ├── authRoutes.js
│   ├── teamRoutes.js
│   ├── equipmentRoutes.js
│   └── requestRoutes.js
├── middleware/
│   ├── auth.js                  # JWT verification
│   └── roleMiddleware.js        # Role-based access
└── server.js

frontend/
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx            # KPI dashboard
│   ├── KanbanBoard.jsx          # Drag-and-drop
│   ├── EquipmentList.jsx        # Filterable grid
│   ├── EquipmentDetail.jsx      # Smart buttons
│   └── CreateRequest.jsx        # Auto-assignment form
├── services/
│   └── api.js                   # Axios API client
└── App.jsx                      # Routing
```

---

## 🔌 API Endpoints

### Dashboard
- `GET /api/maintenance-requests/dashboard/kpis` - Get KPIs

### Maintenance Requests
- `GET /api/maintenance-requests` - List all (with filters)
- `POST /api/maintenance-requests` - Create (auto-assigns team)
- `PATCH /api/maintenance-requests/:id/status` - Update status
- `POST /api/maintenance-requests/:id/notes` - Add work note

### Equipment
- `GET /api/equipment` - List all (with filters)
- `GET /api/equipment/:id` - Get with history (smart buttons)
- `PATCH /api/equipment/:id/scrap` - Mark as scrap

### Teams
- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team with workload

Full API documentation: [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

---

## 🎯 Key Features Explained

### 1. Auto-Assignment Algorithm
```javascript
// When creating a maintenance request:
1. Get equipment category (e.g., "Electrical")
2. Find all teams with matching category
3. Calculate active requests for each team
4. Assign to team with minimum workload
```

### 2. Kanban Status Workflow
- **New** → Request created, waiting for technician
- **In Progress** → Work started, `startDate` recorded
- **Done** → Work completed, `completionDate` set, duration calculated

### 3. Smart Buttons (Equipment History)
Each equipment detail page shows clickable metrics:
- Total requests from this equipment
- How many completed
- How many currently active
- Total downtime caused
- Total maintenance cost

### 4. Scrap Lifecycle
- Marks equipment as end-of-life
- Blocks new request creation
- Preserves historical data
- Requires no active maintenance

---

## 👥 User Roles

- **Admin**: Full access, can delete teams/equipment
- **Manager**: Create/update teams and equipment, mark as scrap
- **Technician**: View equipment, create requests, update status
- **Viewer**: Read-only access

---

## 🎨 UI Highlights

- **Modern gradient designs** with glassmorphism effects
- **Drag-and-drop** Kanban board with smooth animations
- **Color-coded** priority and status badges
- **Responsive** layout for mobile and desktop
- **Real-time** updates when status changes

---

## 📊 Demo Data Setup (Recommended)

Create sample data for demo:

1. **Register users** with different roles
2. **Create 2-3 teams** (Electrical, Mechanical, HVAC)
3. **Add equipment** for each category
4. **Create maintenance requests** to see auto-assignment
5. **Use Kanban board** to move requests through workflow

---

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # nodemon with auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server
```

---

## 📝 License

MIT License - Free to use for learning and production

---

## 🎬 Ready for Demo!

The system is fully functional for demonstrating the complete Odoo-inspired maintenance workflow. Start both servers and walk through the flow:

1. Login → Dashboard KPIs
2. Create Request → Auto-assignment
3. Kanban → Drag-and-drop status updates
4. Equipment Detail → Smart buttons showing history
5. Mark as Scrap → End-of-life management

**Happy Maintenance Management! 🚀**
