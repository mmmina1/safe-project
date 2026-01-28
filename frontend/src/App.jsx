import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer.jsx';
import './App.css';
import MainPage from './components/main/MainPage.jsx';

function App() {
  
  return (
      <div id="root">
      <div className="content-wrapper">
        <MainPage/>
      </div>
      <Footer />
    </div>
  )
}

export default App;
