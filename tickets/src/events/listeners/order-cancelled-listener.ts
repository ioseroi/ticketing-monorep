import {Listener, OrderCanceledEvent, Subjects} from "@sggtickets/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";
import {natsWrapper} from "../../nats-wrapper";

export class OrderCancelledListener extends Listener<OrderCanceledEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    async onMessage(data: OrderCanceledEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error("Ticket not found")
        }
        ticket.set({orderId: undefined});
        await ticket.save()

        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            // @ts-ignore
            orderId: ticket.orderId,
            version: ticket.version
        })
        msg.ack();
    }
}