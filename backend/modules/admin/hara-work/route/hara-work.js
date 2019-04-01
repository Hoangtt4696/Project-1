/**
 * @author Tran Dinh Hoang
 */

'use strict';

const express            = require('express');
const router             = express.Router();
const HaraWorkController = require('../controller/hara-work');

router.get('/departments', HaraWorkController.listDepartments);
router.get('/department/:id', HaraWorkController.getDepartment);

router.get('/departmentUnits', HaraWorkController.listDepartmentUnits);
router.get('/departmentUnits/:id', HaraWorkController.getDepartmentUnit);

router.get('/salaryElements', HaraWorkController.listSalaryElements);
router.get('/salaryElements/:id', HaraWorkController.getSalaryElement);

router.get('/employees', HaraWorkController.listEmployees);
router.get('/employees/:id', HaraWorkController.getEmployee);

router.get('/jobtitles', HaraWorkController.listJobTitles);
router.get('/jobtitles/department/:id', HaraWorkController.listJobTitlesByDepartmentId);

module.exports = router;