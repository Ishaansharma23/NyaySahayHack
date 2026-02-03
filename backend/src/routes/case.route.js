import express from "express";
import { protectRoute, clientOnly, advocateOnly } from "../middlewares/auth.middleware.js";
import {
    createCase,
    getCases,
    getCaseById,
    updateCaseStatus,
    acceptCase,
    rejectCase,
    addDocument,
    getCaseStats
} from "../controllers/case.controller.js";

const router = express.Router();

// All routes are protected
router.use(protectRoute);

// Stats route (must be before :id routes)
router.get("/stats", getCaseStats);

// Case CRUD
router.route("/")
    .get(getCases)
    .post(clientOnly, createCase);

router.route("/:id")
    .get(getCaseById);

// Case actions (Advocate only)
router.post("/:id/accept", advocateOnly, acceptCase);
router.post("/:id/reject", advocateOnly, rejectCase);
router.patch("/:id/status", advocateOnly, updateCaseStatus);

// Documents (both can add)
router.post("/:id/documents", addDocument);

export default router;
