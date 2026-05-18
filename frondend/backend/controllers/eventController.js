import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      customer: req.user.id
    });

    await event.save();

    res.status(201).json({ message: "Event created", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("customer")
      .populate("applicants")
      .populate("approvedWorkers")
      .populate("rejectedWorkers");

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const applyEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event.applicants.includes(req.user.id)) {
      event.applicants.push(req.user.id);
      await event.save();
    }

    res.json({ message: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveWorker = async (req, res) => {
  try {
    const { workerId } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event.approvedWorkers.includes(workerId)) {
      event.approvedWorkers.push(workerId);
    }
    
    event.rejectedWorkers = event.rejectedWorkers.filter(id => id.toString() !== workerId);
    
    await event.save();

    const populatedEvent = await Event.findById(req.params.id)
      .populate("customer")
      .populate("applicants")
      .populate("approvedWorkers")
      .populate("rejectedWorkers");

    res.json({ event: populatedEvent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectWorker = async (req, res) => {
  try {
    const { workerId } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event.rejectedWorkers.includes(workerId)) {
      event.rejectedWorkers.push(workerId);
    }
    event.approvedWorkers = event.approvedWorkers.filter(id => id.toString() !== workerId);
    
    await event.save();

    const populatedEvent = await Event.findById(req.params.id)
      .populate("customer")
      .populate("applicants")
      .populate("approvedWorkers")
      .populate("rejectedWorkers");

    res.json({ event: populatedEvent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};