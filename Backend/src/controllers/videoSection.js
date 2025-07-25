const cloudinary=require('cloudinary').v2;
const video =require('../models/Video');
const Problem = require("../models/problem");

const generateUploadSignature = async (req, res) => {
  try {
    const { problemId } = req.params;
    
    const userId = req.result._id;
    // Verify problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `leetcode-solutions/${problemId}/${userId}_${timestamp}`;
    cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });


  const uploadParams ={
    timestamp:timestamp,
    public_id:publicId,
  };

  //creating signature
  const signature =cloudinary.utils.api_sign_request(
    uploadParams,
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
     signature,
     timestamp,
     public_id:publicId,
     api_key:process.env.CLOUDINARY_API_KEY,
     cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
     upload_url:`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
  });

}
catch(error){
    console.log("error in generating upload signature")
}
}

const saveVideoMetadata = async (req, res) => {
  try {
    const {
      problemId,
      cloudinaryPublicId,
      secureUrl,
      duration,
    } = req.body;

    const userId = req.result._id;

    // Verify the upload with Cloudinary
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: 'video' }
    );
//     So this line is used to:
// 🔍 1. Validate Existence
// Check if a resource with cloudinaryPublicId actually exists in your Cloudinary storage.
// 🧾 2. Fetch Metadata
// Retrieve file info like:
// Duration
// Format (e.g. mp4)
// Width/height
// File size
// Secure URL
// This confirms:
// "Yes, the file is in Cloudinary, and here’s what it looks like."
     
      if (!cloudinaryResource) {
           return res.status(400).json({ error: 'Video not found on Cloudinary' });
         }
     
         // Check if video already exists for this problem and user
         const existingVideo = await video.findOne({
           problemId,
           userId,
           cloudinaryPublicId
         });
     
         if (existingVideo) {
           return res.status(409).json({ error: 'Video already exists' });
         }
          const thumbnailUrl = cloudinary.image(cloudinaryResource.public_id,{resource_type: "video"})

             const videoSolution = await video.create({
               problemId,
               userId,
               cloudinaryPublicId,
               secureUrl,
               duration: cloudinaryResource.duration || duration,
               thumbnailUrl
             });
         
             res.status(201).json({
                message: 'Video solution saved successfully',
                videoSolution: {
                  id: videoSolution._id,
                  thumbnailUrl: videoSolution.thumbnailUrl,
                  duration: videoSolution.duration,
                  uploadedAt: videoSolution.createdAt
                }
              });
  }
  catch(error){
    console.error('Error saving video metadata:', error);
    res.status(500).json({ error: 'Failed to save video metadata' });
  }
};


const deleteVideo = async (req, res) => {
  try {
    const { problemId } = req.params;

    const videoDel = await video.findOneAndDelete({problemId:problemId});
    if (!videoDel) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await cloudinary.uploader.destroy(videoDel.cloudinaryPublicId, { resource_type: 'video' , invalidate: true });
    
    
    // Without invalidate: true
    // You delete the video from Cloudinary storage ✅
    // BUT the CDN still has a cached copy 🛑
    // So if someone visits the same URL again, they still see the deleted video!
    
    
    res.json({ message: 'Video deleted successfully' });

  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};


module.exports = {generateUploadSignature,saveVideoMetadata,deleteVideo};

