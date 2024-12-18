import {useState} from "react";
import useRequest from '../../hooks/use-req';
import Router from "next/router";

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {doRequest, errors} = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {email, password},
        onSuccess: () => Router.push('/')
    })
    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
    }
    return <form onSubmit={onSubmit}>
        <h1>Sign In</h1>
        <div className="form-group">
            <label htmlFor="">Email</label>
            <input type="text"
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="form-control"/>
        </div>
        <div className="form-group">
            <label htmlFor="">Password</label>
            <input type="password"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="form-control"/>
        </div>
        {errors}
        <button className="btn btn-primary">Sign In</button>
    </form>
}