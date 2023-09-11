import {OrderCanceledEvent, Publisher, Subjects} from "@sggtickets/common";

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
