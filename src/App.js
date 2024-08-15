import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [numberId, setNumberId] = useState('');
  const [previousState, setPreviousState] = useState([]);
  const [currentState, setCurrentState] = useState([]);
  const [average, setAverage] = useState(null);
  const windowSize = 10;

  const fetchNumber = async (id) => {
    try {
      const response = await axios.get('https://thirdparty.api/numbers/${id}', { timeout: 500 });
      return response.data.number;
    } catch (error) {
      console.log('Error fetching number:', error);
      return null;
    }
  };

  const handleFetchAndCalculate = async () => {
    const number = await fetchNumber(numberId);
    if (number !== null && !currentState.includes(number)) {
      let updatedState = [...currentState, number];
      if (updatedState.length > windowSize) {
        updatedState.shift(); // Remove the oldest number to maintain window size
      }
      setPreviousState(currentState);
      setCurrentState(updatedState);

      const avg = updatedState.reduce((sum, val) => sum + val, 0) / updatedState.length;
      setAverage(avg);
    }
  };

  const handleChange = (event) => {
    setNumberId(event.target.value);
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>
      <input
        type="number"
        value={numberId}
        onChange={handleChange}
        placeholder="Enter Number ID"
      />
      <button onClick={handleFetchAndCalculate}>Fetch and Calculate</button>

      <div>
        <h2>Previous State:</h2>
        <p>{JSON.stringify(previousState)}</p>
      </div>

      <div>
        <h2>Current State:</h2>
        <p>{JSON.stringify(currentState)}</p>
      </div>

      <div>
        <h2>Average:</h2>
        <p>{average !== null ? average : 'N/A'}</p>
      </div>
    </div>
  );
}

export default App;