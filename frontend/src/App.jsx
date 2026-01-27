import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer.jsx';
import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState("연결 확인 중...")

  useEffect(() => {
    // 중요: /api 앞에 백엔드 주소를 붙이지 마세요! 
    // Vite Proxy가 대신 전달해 줍니다.
    axios.get('/api/test') 
      .then(res => {
        console.log("데이터 수신 완료:", res.data);
        setMessage(res.data);
      })
      .catch(err => {
        console.error("에러 발생:", err);
        setMessage("연결 실패 ㅠㅠ : " + err.message);
      })
  }, [])

  return (
    <div style={{textAlign: 'center', marginTop: '50px'}}>
      <h1>초기 세팅 확인</h1>
      <p style={{fontSize: '20px', color: 'blue'}}>{message}</p>
      <Footer />
    </div>
  )
}

export default App;