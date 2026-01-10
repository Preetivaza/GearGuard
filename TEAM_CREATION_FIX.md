# Team Creation Troubleshooting Guide

## Issue
Teams are not being created in the database without showing any error.

## Root Cause Analysis

### 1. **Authorization Requirement**
The team creation endpoint requires **Manager role**:
- Route: `POST /api/teams`
- Required Role: **Manager only**
- Location: `backend/routes/team.js` line 16

### 2. **Possible Causes**

#### A. User Role Issue
If you're logged in as a **User** or **Technician**, the request will fail with:
```json
{
  "message": "User role 'User' is not authorized to access this route"
}
```

#### B. Error Not Displayed
The frontend should show this error in a toast notification (line 95 in TeamForm.jsx), but if the error doesn't have the expected structure, it might not display.

## Solutions

### Solution 1: Login as Manager (Recommended)
Use one of the Manager accounts from the seeded data:

**Manager Credentials:**
- Email: `sarah.johnson@gearguard.com`
- Password: `password123`
- Role: Manager
- Department: Operations

OR

- Email: `michael.chen@gearguard.com`
- Password: `password123`
- Role: Manager
- Department: IT

OR

- Email: `emily.rodriguez@gearguard.com`
- Password: `password123`
- Role: Manager
- Department: Manufacturing

### Solution 2: Add Better Error Handling (Optional)
If you want to see errors more clearly, update the TeamForm.jsx error handling:

```javascript
// In TeamForm.jsx, line 94-95, replace with:
} catch (error) {
    console.error('Team creation error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Operation failed';
    toast.error(errorMessage);
    alert(`Error: ${errorMessage}`); // Additional alert for debugging
} finally {
```

### Solution 3: Allow All Roles to Create Teams (If Needed)
If you want any user to create teams, modify the route:

**File:** `backend/routes/team.js`

**Change line 16 from:**
```javascript
.post(protect, authorize('Manager'), createTeam);
```

**To:**
```javascript
.post(protect, createTeam); // Allows all authenticated users
```

## Testing Steps

### Step 1: Check Current User Role
1. Open browser console (F12)
2. Go to Application > Local Storage
3. Find the `user` item
4. Check the `role` field - it should be "Manager"

### Step 2: Login as Manager
1. Logout from current account
2. Go to login page
3. Use Manager credentials (see above)
4. Navigate to Teams > Add New Team

### Step 3: Create a Test Team
Fill in the form:
- **Team Name:** Test Electrical Team
- **Team Type:** Electricians
- **Description:** Testing team creation
- **Specialization:** Wiring, Panels
- Click "Create Team"

### Step 4: Verify in Database
If successful, you should:
- See success toast: "Team created successfully"
- Be redirected to /teams page
- See the new team in the list

## Quick Terminal Test

To test if the backend is working, run this from a terminal with a valid Manager token:

```bash
# First, login as manager to get a token
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"sarah.johnson@gearguard.com\",\"password\":\"password123\"}"

# Copy the token from response, then test team creation
# Replace YOUR_TOKEN_HERE with the actual token
curl -X POST http://localhost:5000/api/teams -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN_HERE" -d "{\"name\":\"Test Team\",\"type\":\"Mechanics\",\"description\":\"Test\"}"
```

## Common Errors and Solutions

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Not authorized, no token" | Not logged in | Login first |
| "User role 'User' is not authorized..." | Wrong role | Login as Manager |
| "User role 'Technician' is not authorized..." | Wrong role | Login as Manager |
| "Team validation failed: name..." | Missing required field | Fill in team name |
| "E11000 duplicate key error" | Team name already exists | Use a different name |

## Expected Behavior

**When creating a team successfully:**
1. Form submits without page refresh
2. Toast notification appears: "Team created successfully"
3. Page redirects to `/teams`
4. New team appears in the teams list
5. Team is saved in MongoDB `maintenanceteams` collection

**When unauthorized:**
1. Form submits
2. Toast notification appears: "User role 'X' is not authorized to access this route"
3. Page stays on form
4. Team is NOT created in database

## Next Steps

1. ✅ **Logout** from current account
2. ✅ **Login as Manager** using the credentials above
3. ✅ **Try creating a team** again
4. ✅ **Check the browser console** for any errors
5. ✅ **Verify the team appears** in the teams list

If issues persist after logging in as Manager, check:
- Browser console for JavaScript errors
- Network tab for failed API requests
- Backend terminal for server errors
