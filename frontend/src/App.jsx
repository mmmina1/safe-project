import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState("연결 확인 중...")

  useEffect(() => {
    // 백엔드 서버(8080포트)에 요청을 보냅니다.
    axios.get('http://localhost:8080/api/test')
      .then(res => setMessage(res.data))
      .catch(err => setMessage("연결 실패 ㅠㅠ : " + err.message))
  }, [])

  return (
    <div style={{textAlign: 'center', marginTop: '50px'}}>
      <h1>초기 세팅 확인</h1>
      <p style={{fontSize: '20px', color: 'blue'}}>{message}</p>
    </div>
  )
}

export default App;