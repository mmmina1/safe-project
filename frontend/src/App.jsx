import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer.jsx';
import './App.css';

function App() {
  
  return (
      <div id="root">
      <div className="content-wrapper">
        {/* 여기에 나중에 메인 내용을 넣으시면 됩니다 */}
        <h1 className="mt-5 text-center">초기 세팅 확인</h1>
        <p className="text-center text-primary">스프링이랑 연결 성공했다!</p>
      </div>
      <Footer />
    </div>
  )
}

export default App;