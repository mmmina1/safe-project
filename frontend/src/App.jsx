import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import './App.css';
import MainPage from './components/main/MainPage.jsx';

function App() {
  
  return (
      <div id="root">
      <Header />
      <MainPage/>
      <Footer />
    </div>
  )
}

export default App;
