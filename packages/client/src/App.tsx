import CameraModal from 'components/CameraModal';
import { useState } from 'react';

import './App.scss';

function App() {
  const [isVisibleCamera, setVisibleCamera] = useState(false);

  const handleOpen = () => {
    setVisibleCamera(true);
  };

  const handleClose = () => {
    setVisibleCamera(false);
  };

  return (
    <div className="app">
      <button onClick={handleOpen}>Scan</button>

      <CameraModal visible={isVisibleCamera} onClose={handleClose} />
    </div>
  );
}

export default App;
