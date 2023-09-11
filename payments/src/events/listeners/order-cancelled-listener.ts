import {Listener, OrderCanceledEvent, OrderStatus, Subjects} from "@sggtickets/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Order} from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCanceledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCanceledEvent['data'], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        })
        if (!order) {
            throw new Error('Order not found')
        }
        order.set({status: OrderStatus.Cancelled})
        await order.save();
        msg.ack();
    }
}