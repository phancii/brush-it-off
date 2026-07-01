import { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('https://brush-it-off.onrender.com/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({ name, email }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMessage(data?.error || 'Something went wrong. Try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setName('');
      setEmail('');
    } catch (err) {
      console.error(err);
      setErrorMessage('Something went wrong. Try again.');
      setStatus('error');
    }
  };

  return (
    <div>
      <div
        style={{
          width: '100%',
          height: '100vh',
          backgroundImage: 'url(https://picsum.photos/seed/landing/1600/900)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: '4rem',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            textShadow: '0px 2px 6px rgba(0,0,0,0.6)',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          Try our product below, btw violet is so cool
        </Typography>
        <Typography
          sx={{
            color: 'white',
            fontSize: '2rem',
            textShadow: '0px 2px 6px rgba(0,0,0,0.6)',
            textAlign: 'center',
          }}
        >
          ↓
        </Typography>
      </div>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 400,
          margin: '4rem auto',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5">Join the waitlist</Typography>

        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" variant="contained" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting...' : 'Join waitlist'}
        </Button>

        {status === 'success' && (
          <Typography color="success.main">You're on the list!</Typography>
        )}
        {status === 'error' && (
          <Typography color="error.main">{errorMessage}</Typography>
        )}
      </Box>
    </div>
  );
}

export default App;