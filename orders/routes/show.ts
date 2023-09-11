import express, {Request, Response} from "express";
import {NotAuthrorizedError, NotFound, requireAuth} from "@sggtickets/common";
import {Order} from "../src/models/order";

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId)
        .populate('ticket');
    if (!order) {
        throw new NotFound()
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthrorizedError();
    }
    res.status(200).send(order)
})

export {router as showOrderRouter};