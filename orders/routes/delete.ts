import express, {Request, Response} from "express";
import {Order, OrderStatus} from "../src/models/order";
import {NotAuthrorizedError, NotFound, requireAuth} from "@sggtickets/common";
import {OrderCanceledPublisher} from "../src/events/publishers/order-cancelled-publisher";
import {natsWrapper} from "../src/nats-wrapper";

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const {orderId} = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFound()
    }
    if (order.userId !== req.currentUser!.id){
        throw new NotAuthrorizedError()
    }
    order.status = OrderStatus.Cancelled;
    await order.save()
    new OrderCanceledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    })
    res.status(204).send(order)
})

export {router as deleteOrderRouter};