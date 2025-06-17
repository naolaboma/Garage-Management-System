const express=require("express");
const router=express.Router();
const employeeController=require('../controllers/Eployee.controller');

const authMiddleware=require('../middlewares/auth.midleware');

router.post('/api/employee',[authMiddleware.verifToken,authMiddleware.isAdmin],employeeController.createEmployee);

router.get("/api/employees",[authMiddleware.verifToken,authMiddleware.isAdmin],employeeController.getEmployees);

router.get("/api/employee/:id",[authMiddleware.verifToken,authMiddleware.isAdmin],employeeController.getEmployeeById);

router.put("/api/employee",[authMiddleware.verifToken,authMiddleware.isAdmin],employeeController.updateEmployee);

router.delete("/api/employee/:id",[authMiddleware.verifToken,authMiddleware.isAdmin],employeeController.deleteEmployee);

module.exports=router;