import Delivery from "../models/delivery.model.js"
import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"
import User from "../models/user.model.js"


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
        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders


        })

        await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")
        await newOrder.populate("shopOrders.shop", "name")
        return res
            .status(201)
            .json(newOrder)
    } catch (error) {
        return res
            .status(500)
            .json({ message: `place order error ${error}` })
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

            const filteredOrders = orders.map((order) => ({
                _id: order._id,
                paymentMethod: order.paymentMethod,
                user: order.user,
                shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
                deliveryAddress: order.deliveryAddress,
                createdAt: order.createdAt


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

export const udateOrderStatus = async (req, res) => {
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
                        $geometry: { type: "Point", coordinates: [Number(latitude), Number(longitude)] },
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
                order: order._id,
                shop: shopOrder.shop,
                shopOrderId: shopOrder._id,
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
            }))
        }

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
                assignment: updatedShopOrder?.assignment._id

            })

    } catch (error) {
        return res
            .status(500)
            .json({ message: `Order status error ${error}` })
    }
}

export const getDeliveryTask= async(req,res)=>{
    try {
        const deliveryBoyId=req.userId
        const deliveryTask= await Delivery.find({
            candidateRiders:deliveryBoyId,
            status:"broadcasted"
        })
        .populate("order")
        .populate("shop")
        
        const formated= deliveryTask.map(a=>({
            deliveryTaskid:a._id,
            orderId:a.order._id,
            shopName:a.shop.name,
            deliveryAddress:a.order.deliveryAddress,
            items:a.order.shopOrders.find(so=>so._id.equals(a.shopOrderId)).shopOrderItems || [],
            subTotal:a.order.shopOrders.find(so=>so._id.equals(a.shopOrderId))?.subTotal,

        }))
        return res
        .status(200)
        .json(formated)
    } catch (error) {
        return res
        .status(500)
        .json({message:`get delivery task error ${error}`})
    }
}

