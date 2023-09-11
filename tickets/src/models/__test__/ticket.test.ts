import {Ticket} from "../ticket";

it('implements optimistic concurrency control', async () => {
    const ticket = Ticket.build({
        title: 'Test1',
        price: 10,
        userId: '123'
    })
    await ticket.save();
    const firstCopy = await Ticket.findById(ticket.id);
    const secondCopy= await Ticket.findById(ticket.id);
    firstCopy!.set({price: 15})
    secondCopy!.set({price: 25})
    await firstCopy!.save();
    try {
        await secondCopy!.save();
    } catch (e) {
        return;
    }
    throw new Error('Should not go there')
})

it('increments version on multiple save', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 1,
        userId: '12345'
    })
    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)
})