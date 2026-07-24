const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  patchStatus,
  removeTask,
} = require('../controllers/taskController');

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/status', patchStatus);
router.delete('/:id', removeTask);

module.exports = router;
