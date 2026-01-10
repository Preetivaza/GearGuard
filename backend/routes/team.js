const express = require('express');
const router = express.Router();
const {
    getTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
} = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getTeams)
    .post(protect, authorize('Manager'), createTeam);

router.route('/:id')
    .get(protect, getTeamById)
    .put(protect, authorize('Manager'), updateTeam)
    .delete(protect, authorize('Manager'), deleteTeam);

router.put('/:id/members', protect, authorize('Manager'), addTeamMember);
router.delete('/:id/members/:userId', protect, authorize('Manager'), removeTeamMember);

module.exports = router;
