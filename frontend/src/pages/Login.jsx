import { Link } from 'react-router-dom';

function Login() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Login</h2>
      <form style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto' }}>
        <input type="text" placeholder="Username" style={{ marginBottom: '1rem' }} />
        <input type="password" placeholder="Password" style={{ marginBottom: '1rem' }} />
        <button type="submit" style={{ marginBottom: '1rem' }}>Entrar</button>
        <Link to="/">
          <button type="button">Voltar</button>
        </Link>
      </form>
    </div>
  );
}

export default Login;
