 import mongoose, {Schema} from "mongoose";

const shippingSchema = new Schema({
    userId: { type :  mongoose.Schema.Types.ObjectId , ref : "User", required: true},
    fullName :{ type: String , required: true},
    email :{ type: String , required: true},
    address :{ type: String , required: true},
    streetAddress :{ type: String , required: false},
    landmarksAndApartments :{ type: String , required:false},
    city :{ type: String , required: true},
    state :{ type: String , required: true},
    zipCode :{ type: String , required: true},
  });

   export const UserShippingAddress = mongoose.model("UserShippingAddress", shippingSchema)