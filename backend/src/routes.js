import express from "express";
import Place from "./models/Place.js";

const router = express.Router();

/**
 * GET all places
 */
router.get("/places", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch places" });
  }
});

/**
 * POST add a new place
 */
router.post("/places", async (req, res) => {
  try {
    const place = new Place(req.body);
    const savedPlace = await place.save();
    res.status(201).json(savedPlace);
  } catch (err) {
    res.status(400).json({ message: "Failed to add place" });
  }
});

export default router;
