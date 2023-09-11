import express, {Request, Response} from "express";
import {body} from 'express-validator';
import {Ticket} from "../src/models/ticket";
import {TicketUpdatedPublisher} from "../src/events/publishers/ticket-updated-publisher";
import {natsWrapper} from "../src/nats-wrapper";
import {
    validateRequest,
    NotFound,
    requireAuth,
    NotAuthrorizedError, BadRequestError
} from "@sggtickets/common";

const router = express.Router();

router.put('/api/tickets/:id',
    [
        body('title').not().isEmpty().withMessage('Provide Title'),
        body('price').isFloat({gt: 0}).withMessage('Price should be greater than 0')
    ],
    requireAuth,
    validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id)
        if (!ticket) {
            throw new NotFound();
        }
        if (ticket.orderId) {
            throw new BadRequestError("Ticket is reserved and you can not edit it now");
        }
        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthrorizedError();
        }
        ticket.set({
            title: req.body.title,
            price: req.body.price
        })

        new TicketUpdatedPublisher(natsWrapper.client).publish({
            // @ts-ignore
            orderId: ticket.orderId,
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        })
        await ticket.save();
        return res.status(201).send({message: `Ticket ${req.params.id} updated`})
    })

export {router as updateTicketRouter}