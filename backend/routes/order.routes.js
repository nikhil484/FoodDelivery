import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import {  getDeliveryTask, getMyOrders, placeOrder } from '../controllers/order.controllers.js'
import {udateOrderStatus} from '../controllers/order.controllers.js'
const orderRouter= express.Router()

orderRouter.post("/place-order",isAuth,placeOrder)
orderRouter.get("/my-orders",isAuth,getMyOrders)
orderRouter.get("/get-deliverytask",isAuth,getDeliveryTask)

orderRouter.post("/update-status/:orderId/:shopId",isAuth,udateOrderStatus)
export default orderRouter