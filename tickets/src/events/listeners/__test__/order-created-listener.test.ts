import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedEvent, OrderStatus} from "@sggtickets/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)
    const ticket = Ticket.build({
        title: 'test',
        price: 1,
        userId: 'lol'
    })
    await ticket.save()
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'lol',
        expiresAt: 'dksdkfsd',
        ticket: {
            id: ticket.id,
            price: ticket.price.toString()
        }
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return {listener, ticket, data, msg}
}


it('sets the userID of the ticket', async () => {
  const {listener, ticket, data, msg } = await setup()
  await listener.onMessage(data,msg)
  const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
    const {listener, ticket, data, msg } = await setup()
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled()
})