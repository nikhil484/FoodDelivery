import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import {  acceptDeliveryTask, getDeliveryTask, getMyOrders, getOrderById, getRiderOrders, placeOrder, sendDeliveryOtp, verifyDeliveryOtp, verifyPayment } from '../controllers/order.controllers.js'
import {udateOrderStatus} from '../controllers/order.controllers.js'
const orderRouter= express.Router()

orderRouter.post("/place-order",isAuth,placeOrder)
orderRouter.post("/verify-payment",isAuth,verifyPayment)
orderRouter.post("/send-delivery-otp",isAuth,sendDeliveryOtp)
orderRouter.post("/verify-delivery-otp",isAuth,verifyDeliveryOtp)
orderRouter.get("/my-orders",isAuth,getMyOrders)
orderRouter.get("/get-deliverytask",isAuth,getDeliveryTask)
orderRouter.get("/accept-DeliveryTask/:deliveryTaskId",isAuth,acceptDeliveryTask)
orderRouter.get("/get-riderOrders",isAuth,getRiderOrders)
orderRouter.get("/get-order-by-id/:orderId",isAuth,getOrderById)

orderRouter.post("/update-status/:orderId/:shopId",isAuth,udateOrderStatus)
export default orderRouter