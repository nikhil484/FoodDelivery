import mongoose, { mongo } from "mongoose"
const shopOrderItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    price: {
        type: Number,
    },
    qunatity: {
        type: Number
    }
}, { timestamps: true })


const shopOrderSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subTotal: {
        type: Number
    },
    shopOrderItems: [shopOrderItemSchema]

}, { timestamps: true })


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    paymentMethod: {
        type: String,
        enum: ['cod', "online"],
        required: true
    },
    deliveryAddress: {
        text: String,
        longitude: Number,
        latitude: Number
    },
    totalAmount: {
        type: Number
    },
    shopOrder: [shopOrderSchema]
}, { timestamps: true })


const Order = mongoose.model("Order", orderSchema)
export default Order