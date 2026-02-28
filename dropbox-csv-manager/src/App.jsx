import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import ConfigScreen from './components/ConfigScreen';
import DataTable from './components/DataTable';

function App() {
  const { isAuthenticated } = useContext(AppContext);

  return (
    <div className="app-wrapper">
      {isAuthenticated ? <DataTable /> : <ConfigScreen />}
    </div>
  );
}

export default App;
