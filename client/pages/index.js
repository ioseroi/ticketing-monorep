import Link from "next/link";

const LandingPage = ({currentUser, tickets}) => {
    console.log(tickets)
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
               <td>{ticket.title}</td>
               <td>{ticket.price}</td>
               <td>
                   <Link className="nav-link" href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                       View
                   </Link>
               </td>
            </tr>
        )
    })
    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Link</th>
                </tr>
                </thead>
                <tbody>
                {ticketList}
                </tbody>
            </table>
        </div>
    )
    // return currentUser ? <h1>Signed in</h1> : <h1>You are not signed in</h1>
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const {data} = await client.get('/api/tickets')
    return {tickets: data}
}


export default LandingPage