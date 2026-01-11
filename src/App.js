import logo from './logo.svg';
import './App.css';
import Main from './Pages/Main';
import { AlertsProvider } from './Context/AlertsContext';
import { TagsProvider } from './Context/TagsContext';
function App() {
  return (
    <div className="App">
      <TagsProvider>
        <AlertsProvider>
          <Main />
        </AlertsProvider>
      </TagsProvider>
    </div >
  );
}

export default App;
