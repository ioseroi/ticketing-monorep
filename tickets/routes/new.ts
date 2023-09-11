import express, {raw, Request, Response} from 'express';
import {requireAuth, validateRequest} from "@sggtickets/common";
import {body} from 'express-validator';

import {natsWrapper} from "../src/nats-wrapper";
import {Ticket} from "../src/models/ticket";
import {TicketCreatedPublisher} from "../src/events/publishers/ticket-created-publisher";

const router = express.Router();

router.post('/api/tickets', requireAuth,
    body('title').not().isEmpty().withMessage('Title required'),
    body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0'),
    validateRequest,
    async (req: Request, res: Response) => {
        const {title, price} = req.body;
        const ticket = Ticket.build({
                title,
                price,
                userId: req.currentUser!.id
            }
        )
        await ticket.save()
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            // @ts-ignore
            id: ticket.id,
            // @ts-ignore
            version: ticket.version,
            // @ts-ignore
            price: ticket.price,
            // @ts-ignore
            title: ticket.title,
            // @ts-ignore
            userId: ticket.userId
        })
        res.status(201).send(ticket)
    })

export {router as createTicketRouter}