import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Contact } from "../models/conatctus.model.js"; // Correct the import
import { sendMail } from "../utils/send.email.js";


const contactUs = AsyncHandler(async (req, res) => {
  const { firstName, lastName, phone, email, message } = req.body;
 console.log(req.body);
  // Check if all required fields are present
  if (!firstName || !lastName || !phone || !email || !message) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if there is an existing pending contact request from the same email
  const isSubmitted = await Contact.findOne({ email, status: "pending" });
  if (isSubmitted) {
    throw new ApiError(
      400,
      "You have already submitted a request. Please wait for our response."
    );
  }

  // Create a new Contact instance and save it
  const newContact = new Contact({
    firstName,
    lastName,
    phone,
    email,
    message,
  });

  const savedContact = await newContact.save(); // Save the new contact
  if (!savedContact) {
    throw new ApiError(500, "Failed to send message");
  }
  // Send email notification to the admin
  await sendMail(`${firstName} ${lastName}`, message, phone, email);

  res
    .status(200)
    .json(new ApiResponse(200, "Message sent successfully", savedContact));
});

//  GET ALL cONTACT 
  const GetAllContactUsMessage = AsyncHandler(async(req, res)=>{
    const AllContactUsMessage =  await Contact.find();
     if(!AllContactUsMessage){
      throw new ApiError(404, " No Query Found ");

     }
     res.status(200).json(new ApiResponse(200, "All Contact Us Message", AllContactUsMessage));

  })


const ResolveQuery = AsyncHandler(async (req, res) => {
    const { id } = req.body;
  
    // Check if ID is provided
    if (!id) {
      throw new ApiError(400, "Id is required");
    }
  
    // Find the contact by ID
    const resolved = await Contact.findById(id);
    if (!resolved) {
      throw new ApiError(404, "Contact not found");
    }
  
    // Update the status to "resolved"
    const resolvedContact = await Contact.findByIdAndUpdate(
      id,
      { status: "resolved" },
      { new: true } // Return the updated document
    );
  
    // Check if the update was successful
    if (!resolvedContact) {
      throw new ApiError(500, "Failed to resolve contact");
    }
  
    // Return success response
    res.status(200).json(new ApiResponse(200, "Contact resolved successfully", resolvedContact));
  });

const RejectQuery = AsyncHandler(async (req, res) => {
    const { id } = req.body;
  
    // Check if ID is provided
    if (!id) {
      throw new ApiError(400, "Id is required");
    }
  
    // Find the contact by ID
    const resolved = await Contact.findById(id);
    if (!resolved) {
      throw new ApiError(404, "Contact not found");
    }
  
    // Update the status to "resolved"
    const resolvedContact = await Contact.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true } // Return the updated document
    );
  
    // Check if the update was successful
    if (!resolvedContact) {
      throw new ApiError(500, "Failed to reject contact");
    }
  
    // Return success response
    res.status(200).json(new ApiResponse(200, "Contact Rejected successfully", resolvedContact));
  });
const PendingQuery = AsyncHandler(async (req, res) => {
    const { id } = req.body;
  
    // Check if ID is provided
    if (!id) {
      throw new ApiError(400, "Id is required");
    }
  
    // Find the contact by ID
    const pending = await Contact.findById(id);
    if (!pending) {
      throw new ApiError(404, "Contact not found");
    }
  
    // Update the status to "resolved"
    const pendingContact = await Contact.findByIdAndUpdate(
      id,
      { status: "pending" },
      { new: true } // Return the updated document
    );
  
    // Check if the update was successful
    if (!pendingContact) {
      throw new ApiError(500, "Failed to Pending contact");
    }
  
    // Return success response
    res.status(200).json(new ApiResponse(200, "Contact marked Pending successfully", pendingContact));
  });
  
export { contactUs, ResolveQuery, RejectQuery ,GetAllContactUsMessage , PendingQuery};
