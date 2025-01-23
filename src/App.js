import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Card, CardContent, Typography, Grid } from '@mui/material';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = ''; // You'll need to get an API key from OpenWeatherMap
  
  const fetchWeather = async () => {
    try {
      setError('');
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (err) {
      setError('City not found. Please try again.');
      setWeather(null);
    }
  };

  return (
    <Container maxWidth="sm" className="App">
      <Typography variant="h3" gutterBottom style={{ marginTop: '2rem' }}>
        Weather App
      </Typography>
      
      <Grid container spacing={2} alignItems="center" style={{ marginBottom: '2rem' }}>
        <Grid item xs={8}>
          <TextField
            fullWidth
            variant="outlined"
            label="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={fetchWeather}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Typography color="error" style={{ marginBottom: '1rem' }}>
          {error}
        </Typography>
      )}

      {weather && (
        <Card>
          <CardContent>
            <Typography variant="h4">
              {weather.name}, {weather.sys.country}
            </Typography>
            <Typography variant="h2" style={{ margin: '1rem 0' }}>
              {Math.round(weather.main.temp)}°C
            </Typography>
            <Typography variant="h6">
              {weather.weather[0].description}
            </Typography>
            <Grid container spacing={2} style={{ marginTop: '1rem' }}>
              <Grid item xs={6}>
                <Typography>
                  Humidity: {weather.main.humidity}%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  Wind: {weather.wind.speed} m/s
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default App;
