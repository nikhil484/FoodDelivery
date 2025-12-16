import Delivery from "../models/delivery.model.js"
import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"
import User from "../models/user.model.js"
import { sendDeliveryOtpMail } from "../utils/mail.js"
import Razorpay from "razorpay";
import dotenv from "dotenv"
dotenv.config()
let instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})


export const placeOrder = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body
        if (cartItems.length == 0 || !cartItems) {
            return res
                .status(400)
                .json({ message: "Cart is empty" })
        }

        if (!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude) {
            return res
                .status(400)
                .json({ message: "Send Complete delivery address" })
        }

        const groupItemsByShop = {}
        cartItems.forEach(item => {
            const shopId = item.shop
            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = []
            }
            groupItemsByShop[shopId].push(item)
        })

        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {
            const shop = await Shop.findById(shopId).populate("owner")
            if (!shop) {
                return res
                    .status(400)
                    .json({ message: "shop not found" })
            }
            const items = groupItemsByShop[shopId]
            const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)
            return {
                shop: shop._id,
                owner: shop.owner._id,
                subTotal: subtotal,
                shopOrderItems: items.map((i) => ({
                    item: i.id,
                    price: i.price,
                    quantity: i.quantity,
                    name: i.name
                }))

            }
        }

        ))

        if (paymentMethod == "Online") {
            const razorOrder = await instance.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: 'INR',
                receipt: `receipt_${Date.now()}`

            })
            const newOrder = await Order.create({
                user: req.userId,
                paymentMethod,
                deliveryAddress,
                totalAmount,
                shopOrders,
                razorpayOrderId: razorOrder.id,
                payment: false
            })
            return res
                .status(200)
                .json({
                    razorOrder,
                    orderId: newOrder._id,


                })
        }


        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders
        })

        await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")
        await newOrder.populate("shopOrders.shop", "name")
        await newOrder.populate("shopOrders.owner", "name")

       return res
            .status(201)
            .json(newOrder)
    } catch (error) {
        return res
            .status(500)
            .json({ message: `place order error ${error}` })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, orderId } = req.body
        const payment = await instance.payments.fetch(razorpay_payment_id)
        if (!payment || payment.status !== "captured") {
            return res
                .status(400)
                .json({ message: "paymet noot captured " })
        }
        const order = await Order.findById(orderId)
        if (!order) {
            return res
                .status(400)
                .json({ message: "order not found" })
        }
        order.payment = true
        order.razorpayPaymentId = razorpay_payment_id
        await order.save()

        await order.populate("shopOrders.shopOrderItems.item", "name image price")
        await order.populate("shopOrders.shop", "name")

        return res
            .status(200)
            .json(order)
    } catch (error) {
        return res
            .status(500)
            .json({ message: `verify payment order error ${error}` })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (user.role == "user") {
            const orders = await Order.find({ user: req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("shopOrders.owner", "name email mobileNumber")
                .populate("shopOrders.shopOrderItems.item", "name image price")

            return res
                .status(200)
                .json(orders)
        } else if (user.role == "owner") {
            const orders = await Order.find({ "shopOrders.owner": req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("user")
                .populate("shopOrders.shopOrderItems.item", "name image price ")
                .populate("shopOrders.assignedDeliveryBoy", "fullName mobileNumber ")

            const filteredOrders = orders.map((order) => ({
                _id: order._id,
                paymentMethod: order.paymentMethod,
                user: order.user,
                shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
                deliveryAddress: order.deliveryAddress,
                createdAt: order.createdAt,
                payment: order.payment


            }))

            return res
                .status(200)
                .json(filteredOrders)

        }

    } catch (error) {
        return res
            .status(500)
            .json({ message: `get my orders error ${error}` })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params
        const { status } = req.body
        const order = await Order.findById(orderId)
        const shopOrder = order.shopOrders.find(o => o.shop == shopId)
        if (!shopOrder) {
            return res
                .status(400)
                .json({ message: "shop order not found" })
        }
        shopOrder.status = status
        let deliveryBoysPayload = []
        if (status == "out for delivery" && !shopOrder.assignment) {
            const { latitude, longitude } = order.deliveryAddress
            const nearByDeliveryBoys = await User.find({
                role: "deliveryBoy",
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
                        $maxDistance: 5000
                    }
                }
            })
            const nearbyRiderIds = nearByDeliveryBoys.map(b => b._id)
            const busyRidersIds = await Delivery.find({
                assignedRider: { $in: nearbyRiderIds },
                status: { $nin: ["broadcasted", "completed"] }
            }).distinct("assignedRider")

            const busyRiderGroup = new Set(busyRidersIds.map(id => String(id)))
            const availableRiders = nearByDeliveryBoys.filter(b => !busyRiderGroup.has(String(b._id)))
            const availableRidersIds = availableRiders.map(b => b._id)
            if (availableRidersIds.length == 0) {
                await order.save()
                return res
                    .json({ message: " Order status updated but no delivery riders available right now" })
            }

            const deliveryTask = await Delivery.create({
                order: order?._id,
                shop: shopOrder.shop,
                shopOrderId: shopOrder?._id,
                candidateRiders: availableRidersIds,
                status: "broadcasted"

            })
            shopOrder.assignedDeliveryBoy = deliveryTask.assignedRider
            shopOrder.assignment = deliveryTask._id
            deliveryBoysPayload = availableRiders.map(b => ({
                id: b._id,
                fullName: b.fullName,
                latitude: b.location.coordinates?.[1],
                longitude: b.location.coordinates?.[0],
                mobileNumber: b.mobileNumber
            }))        }

        await order.save()
        const updatedShopOrder = order.shopOrders.find(o => o.shop == shopId)

        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.assignedDeliveryBoy", "fullName mobileNumber email")


        return res
            .status(200)
            .json({
                shopOrder: updatedShopOrder,
                assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
                availableRiders: deliveryBoysPayload,
                assignment: updatedShopOrder?.assignment?._id

            })

    } catch (error) {
        return res
            .status(500)
            .json({ message: `Order status error ${error}` })
    }
}

export const getDeliveryTask = async (req, res) => {
    try {
        const deliveryBoyId = req.userId
        const deliveryTask = await Delivery.find({
            candidateRiders: deliveryBoyId,
            status: "broadcasted"
        })
            .populate("order")
            .populate("shop")

        const formated = deliveryTask.map(a => ({
            deliveryTaskid: a._id,
            orderId: a.order._id,
            shopName: a.shop.name,
            deliveryAddress: a.order.deliveryAddress,
            items: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId)).shopOrderItems || [],
            subTotal: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId))?.subTotal,

        }))
        return res
            .status(200)
            .json(formated)
    } catch (error) {
        return res
            .status(500)
            .json({ message: `get delivery task error ${error}` })
    }
}

export const acceptDeliveryTask = async (req, res) => {
    try {
        const { deliveryTaskId } = req.params
        const deliveryTask = await Delivery.findById(deliveryTaskId)
        if (!deliveryTask) {
            return res
                .status(400)
                .json({ message: "delivery task not found" })
        }
        if (deliveryTask.status !== "broadcasted") {
            return res
                .status(400)
                .json({ message: "delivery task not available" })
        }

        const alreadyAssigned = await Delivery.findOne({
            assignedRider: req.userId,
            status: { $nin: ["broadcasted", "completed"] }
        })
        if (alreadyAssigned) {
            return res
                .status(400)
                .json({ message: "You have already assigned delivery task" })
        }
        deliveryTask.assignedRider = req.userId
        deliveryTask.status = "assigned"
        deliveryTask.acceptedAt = new Date()
        await deliveryTask.save()

        const order = await Order.findById(deliveryTask.order)
        if (!order) {
            return res
                .status(400)
                .json({ message: "order not found" })
        }
        const shopOrder = order.shopOrders.id(deliveryTask.shopOrderId)
        shopOrder.assignedDeliveryBoy = req.userId
        await order.save()
        await order.populate("shopOrders.assignedDeliveryBoy")
        return res
            .status(200)
            .json({ message: "Delivery task accepted" })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `accept delivery task error ${error}` })
    }
}

export const getRiderOrders = async (req, res) => {
    try {
        const assignedOrders = await Delivery.findOne({
            assignedRider: req.userId,
            status: "assigned",         
        }
    )
            .populate("shop", "name")
            .populate("assignedRider", "fullName mobileNumber email location ")
            .populate({
                path: "order",
                populate: [{
                    path: "user", select: "fullName mobileNumber email location"
                }]

            })
        if (!assignedOrders) {
            return res
                .status(400)
                .json({ message: "no assigned orders found" })
        }
        if (!assignedOrders.order) {
            return res
                .status(400)
                .json({ message: "no assigned orders found" })
        }
        const shopOrder = assignedOrders.order.shopOrders.find(so => String(so._id) === String(assignedOrders.shopOrderId))
        if (!shopOrder) {
            return res
                .status(400)
                .json({ message: "no shop order found" })
        }

        let deliveryBoyLocation = { latitude: null, longitude: null }
        if (assignedOrders.assignedRider.location.coordinates.length == 2) {
            deliveryBoyLocation.latitude = assignedOrders.assignedRider.location.coordinates?.[1]
            deliveryBoyLocation.longitude = assignedOrders.assignedRider.location.coordinates?.[0]
        }

        let customerLocation = { latitude: null, longitude: null }
        if (assignedOrders.order.deliveryAddress.latitude && assignedOrders.order.deliveryAddress.longitude) {
            customerLocation.latitude = assignedOrders.order.deliveryAddress.latitude
            customerLocation.longitude = assignedOrders.order.deliveryAddress.longitude
        }
        return res
            .status(200)
            .json({
                deliveryTaskId: assignedOrders._id,
                orderId: assignedOrders.order._id,
                shopOrder,
                user: assignedOrders.order.user,
                deliveryAddress: assignedOrders.order.deliveryAddress,
                deliveryBoyLocation,
                customerLocation
            })

    } catch (error) {
        return res
            .status(500)
            .json({ message: `get rider orders error ${error}` })

    }
}

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findById(orderId)
            .populate("user")
            .populate({
                path: "shopOrders.shop",
                model: "Shop"
            })
            .populate({
                path: "shopOrders.assignedDeliveryBoy",
                model: "User"
            })
            .populate({
                path: "shopOrders.shopOrderItems.item",
                model: "Item"
            })
            .lean()

        if (!order) {
            return res
                .status(400)
                .json({ message: "order not found" })
        }
        return res
            .status(200)
            .json(order)

    } catch (error) {
        return res
            .status(500)
            .json({ message: `get order by id error ${error}` })
    }
}

export const sendDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body
        const order = await Order.findById(orderId)
            .populate("user")
        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!order || !shopOrder) {
            return res
                .status(400)
                .json({ message: "shop order/order  not found" })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        shopOrder.deliveryOtp = otp
        shopOrder.otpExpires = Date.now() + 5 * 60 * 1000
        await order.save()
        await sendDeliveryOtpMail(order.user.email, otp)
        return res
            .status(200)
            .json({ message: `Delivery OTP sent to ${order?.user?.fullName}` })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `send delivery otp error ${error}` })
    }
}

export const verifyDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId, otp } = req.body
        const order = await Order.findById(orderId)
            .populate("user")
        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!order || !shopOrder) {
            return res
                .status(400)
                .json({ message: "shop order/order  not found" })
        }
        if (shopOrder.deliveryOtp !== otp || !shopOrder.otpExpires || shopOrder.otpExpires < Date.now()) {
            return res
                .status(400)
                .json({ message: "Invalid?Expired OTP" })


        }
        shopOrder.status = "delivered"
        shopOrder.deliveredAt = Date.now()
        await order.save()
        await Delivery.deleteOne({
            shopOrderId: shopOrder._id,
            order: order._id,
            assignedRider: shopOrder.assignedDeliveryBoy
        })

        return res
            .status(200)
            .json({ message: "Order Delivered" })

    } catch (error) {
        return res
            .status(500)
            .json({ message: `verify delivery otp ${error}` })
    }
}