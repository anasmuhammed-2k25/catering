const Application = require("../models/Application");

exports.applyJob = async (req, res) => {
  const app = await Application.create({
    event: req.body.eventId,
    worker: req.user.id
  });

  res.json(app);
};

exports.getApplications = async (req, res) => {
  const apps = await Application.find()
    .populate("event")
    .populate("worker");

  res.json(apps);
};