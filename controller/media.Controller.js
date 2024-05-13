const { db } = require("../models/index");
const Media = db.Media;

module.exports = {
  addCarMedia: async (req, res) => {
    try {
      // Assuming req.body.media is an array of blob URLs
      // and you want to associate each blob URL with a CarId
      const mediaUrls = req.body; // Extract the media URLs from req.body
      console.log(req.body);
      // Map over the media URLs to create an array of objects
      // Each object should have a CarId and a file property containing the blob URL
      const mediaObjects = mediaUrls.map(url => ({
        CarId: req.params.id, // Associate each media with the CarId from req.params
        media: url // Use the blob URL as the file property
      }));

      // Now, mediaObjects is an array of objects that can be passed to Media.bulkCreate
      const media = await Media.bulkCreate(mediaObjects);

      // Send the response with the IDs of the newly added media
      res.status(201).json({ mediaAdded: media.map((file) => file.id) });
    } catch (err) {
      // Handle any errors that occur during the process
      res.status(500).json(err);
    }
  },

  getAllByCarId: async (req, res) => {
    try {
      const response = await Media.findAll({
        where: { CarId: req.params.id },
      });
      // Assuming response[0].media is a Blob object
      // Send the blob data directly in the response body
      res.status(200).send(response[0].media);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  addReqMedia: async (req, res) => {
    try {
      req.body.forEach((file) => (file.requestId = req.params.id));
      const media = await Media.bulkCreate(req.body);
      res.status(201).json({ mediaAdded: media.map((file) => file.id) });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAll: async (req, res) => {
    try {
      const response = await Media.findAll();
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllByRequestId: async (req, res) => {
    try {
      const response = await Media.findAll({
        where: { requestId: req.params.reqId },
      });
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
