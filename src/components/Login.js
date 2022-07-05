import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const Login = (props) => {

    const [credentials, setcredentials] = useState({
        email: "",
        password: ""
    });

    let navigate = useNavigate();

    const handleSubmit = async (e)=> {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:credentials.email, password: credentials.password})
          });
          const json = await response.json();
          console.log(json);
          if(json.success){
            // redirect
            localStorage.setItem('token',json.authToken)
            navigate("/");
            props.showAlert("User Logged In successfully","success")
          }
          else{
            props.showAlert("Invalid Credentials","danger")
          }
    }

    const onChange = (e)=> {
        setcredentials({...credentials, [e.target.name]:e.target.value})
    }

  return (
    <div className='my-2'>
        <h2 >Login to continue to iNotebook</h2>
        <form onSubmit={handleSubmit} >
            <div className="my-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp"/>
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" value={credentials.password} name='password' onChange={onChange}/>
            </div>
            <button type="submit" className="btn btn-primary" >Submit</button>
        </form>
    </div>
  )
}

export default Login