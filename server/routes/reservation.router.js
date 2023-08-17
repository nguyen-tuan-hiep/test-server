import express from "express";
import reservationController from "../controllers/reservation.controller.js";

const router = express.Router();

router.route("/").get(reservationController.getAllReservations);

router.route("/create").post(reservationController.createReservation);

router.delete("/:id", reservationController.deleteByReservationId);

export default router;
