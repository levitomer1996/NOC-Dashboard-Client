import './App.css';
import Main from './Pages/Main';
import { AlertsProvider } from './Context/AlertsContext';
import { TagsProvider } from './Context/TagsContext';

// 1. Import the Provider and the Manager
import { ModalProvider } from './Context/ModalContext';
import GModal from './Components/Modal/GModal';
// Ensure this path matches where you created the file

function App() {
  return (
    <div className="App">
      <TagsProvider>
        <AlertsProvider>
          <ModalProvider>
            <GModal />
            <Main />
          </ModalProvider>
        </AlertsProvider>
      </TagsProvider>
    </div >
  );
}

export default App;