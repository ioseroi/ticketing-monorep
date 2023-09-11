import express, {Request, Response} from "express";
import {BadRequestError, NotFound, OrderStatus, requireAuth} from "@sggtickets/common";
import {body} from 'express-validator';
import mongoose from "mongoose";
import {Ticket} from "../src/models/ticket";
import {Order} from "../src/models/order";
import {OrderCreatedPublisher} from "../src/events/publishers/order-created-publisher";
import {natsWrapper} from "../src/nats-wrapper";

const EXPIRATION_WINDOW_SECONDS = 30;

const router = express.Router();

router.post('/api/orders',
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Provide ticket id')
    ], requireAuth,
    async (req: Request, res: Response) => {
        const {ticketId} = req.body;
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFound();
        }
        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError('Ticket is reserved');
        }
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        })
        await order.save()
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            version: order.version,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price.toString()
            }
        })
        res.status(201).send(order)
    })

export {router as newOrderRouter};