import React, { useState } from 'react'
import "../../assets/css/Main.css"
import { searchPhishing } from '../../api/mainApi'

export default function MainPage() {

    const [ phone, setPhone ] = useState("")
    const [ result, setResult ] = useState(null)
    const [ errorMsg, setErrorMsg ] = useState("")
    const [ loading, setLoading ] = useState(false)

    const onSearch = async() => {
        setErrorMsg("")
        setLoading(true)

        try {
            const res = await searchPhishing(phone)
            if(!res.success) {
                setResult(null)
                setErrorMsg(res.message || "조회에 실패했습니다.")
                return
            }
            
            setResult(res.data)
        } catch (e) {
            setResult(null)
            setErrorMsg("서버 연결에 실패했습니다.")
        } finally{
            setLoading(false)
        }
    }


  return (
    <div className='main-wrap'>
            
        </div>
  )
}

