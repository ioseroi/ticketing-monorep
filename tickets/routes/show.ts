import express, {Request, Response} from "express";
import {Ticket} from "../src/models/ticket";
const router = express.Router();
import {NotFound} from "@sggtickets/common";

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        throw new NotFound();
    }
    res.status(200).send(ticket)
})

export {router as showTicketRouter};