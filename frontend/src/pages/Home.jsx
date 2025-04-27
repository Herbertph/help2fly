import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Help2Fly</h1>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/login">
          <button style={{ margin: '1rem' }}>Login</button>
        </Link>
        <Link to="/register">
          <button style={{ margin: '1rem' }}>Cadastro</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
