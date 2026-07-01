import { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | duplicate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('https://brush-it-off.onrender.com/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({ name, email }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })

      if (res.status === 409) {
        setStatus('duplicate');
        return;
      }

      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      setName('');
      setEmail('');
    } catch (err) {
      console.error(err);
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
          }}
        >
          Try our product below, btw violet is so cool
        </Typography>
        <Typography
          sx={{
            color: 'white',
            fontSize: '2rem',
            textShadow: '0px 2px 6px rgba(0,0,0,0.6)',
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
        {status === 'duplicate' && (
          <Typography color="warning.main">You're already on the waitlist!</Typography>
        )}
        {status === 'error' && (
          <Typography color="error.main">Something went wrong. Try again.</Typography>
        )}
      </Box>
    </div>
  );
}

export default App;