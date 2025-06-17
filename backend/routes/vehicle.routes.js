const express=require('express');
const router=express.Router();
const vehicleController=require('../controllers/vehicle.controller');
const authMiddleware=require('../middlewares/auth.midleware');

router.post("/api/vehicle",[authMiddleware.verifToken,authMiddleware.isAdmin],vehicleController.createVehicle);
router.get("/api/vehicle/:id",[authMiddleware.verifToken,authMiddleware.isAdmin],vehicleController.getVehicleById);

router.put("/api/vehicle/",[authMiddleware.verifToken,authMiddleware.isAdmin],vehicleController.updateVehicle);

router.get("/api/vehicle/customer/:customer_id",[authMiddleware.verifToken,authMiddleware.isAdmin],vehicleController.getVehicleByCustomerId);

module.exports=router;