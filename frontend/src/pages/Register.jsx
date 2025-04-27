import { Link } from 'react-router-dom';

function Register() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Cadastro</h2>
      <form style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto' }}>
        <input type="text" placeholder="Username" style={{ marginBottom: '1rem' }} />
        <input type="email" placeholder="Email" style={{ marginBottom: '1rem' }} />
        <input type="password" placeholder="Senha" style={{ marginBottom: '1rem' }} />
        <input type="password" placeholder="Confirmar Senha" style={{ marginBottom: '1rem' }} />
        <button type="submit" style={{ marginBottom: '1rem' }}>Cadastrar</button>
        <Link to="/">
          <button type="button">Voltar</button>
        </Link>
      </form>
    </div>
  );
}

export default Register;
