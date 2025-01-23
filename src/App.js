import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '895284fb2d2c50a520ea537456963d9c';

  const searchLocation = async (event) => {
    if (event.key === 'Enter') {
      if (!location.trim()) {
        setError('Please enter a location');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
        );
        setData(response.data);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('City not found. Please try another location.');
        } else {
          setError('Error fetching weather data. Please try again.');
        }
        setData(null);
      } finally {
        setLoading(false);
        setLocation('');
      }
    }
  };

  const fetchCurrentLocation = async (position) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${API_KEY}`
      );
      setData(response.data);
    } catch (err) {
      setError('Error fetching weather data. Please try searching for a city instead.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        fetchCurrentLocation,
        () => {
          setError('Location access denied. Please search for a city.');
        }
      );
    }
  }, []);

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location and Press Enter"
          type="text"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {data && (
        <div className="container">
          <div className="top">
            <div className="location">
              <h2>{data.name}, {data.sys.country}</h2>
            </div>
            <div className="time">
              <p>{new Date().toLocaleString()}</p>
            </div>
            <div className="temp-container">
              <div className="temp-box">
                <h3>Temperature</h3>
                <h1>{data.main.temp.toFixed(1)}°C</h1>
              </div>
            </div>
            <div className="weather-condition">
              <img
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                alt={data.weather[0].description}
              />
              <p>{data.weather[0].description}</p>
            </div>
          </div>

          <div className="bottom">
            <div className="details">
              <div className="col">
                <div className="label">Humidity</div>
                <div className="value">{data.main.humidity}%</div>
              </div>
              <div className="col">
                <div className="label">Wind Speed</div>
                <div className="value">{data.wind.speed.toFixed(1)} m/s</div>
              </div>
              <div className="col">
                <div className="label">Feels Like</div>
                <div className="value">{data.main.feels_like.toFixed(1)}°C</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
