import{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'

export default function LoginPage (){
  const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
    const[error,setError] = useState(null);
  const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try{
            const data = await login(email,password);
            localStorage.setItem('token',data.token);
            localStorage.setItem('role',data.role)
            navigate(data.role === 'Customer' ? '/my-loans' : '/');
        }catch(err){
            setError(err.response?.status === 401
              ? 'Email or password is incorrect.'
              : 'Could not reach the sign-in service. Please try again.');
        }
    };

    return (
        <div className="login-page">
        <div className="login-card">
         <h1 className="login-title">Login</h1>
         <form onSubmit={handleSubmit}>
         <div className="login-field">
         <label htmlFor = "email">Email</label>
         <input id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)}
              required
            />
            </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button">Log in</button>
        </form>
      </div>
    </div>
  );
}

