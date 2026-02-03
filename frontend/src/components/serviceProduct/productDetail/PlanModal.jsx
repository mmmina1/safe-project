function PlanModal({ open,onClose,plans,selectedPlan,setSelectedPlan,agreed,setAgreed,onSubscribe}) {
  if (!open) return null

  return (
    <div className='sp-modal-backdrop' onClick={onClose}>
      <div className='sp-modal' onClick={(e) => e.stopPropagation()}>
        <div className='sp-modal-header'>
          <h3>
            <span className='sp-modal-icon'>📋</span>
            기간 플랜 선택
          </h3>
          <button className='sp-modal-close' onClick={onClose}>×</button>
        </div>

        <div className='sp-modal-body'>
          {(!plans || plans.length === 0) ? (
            <div className='sp-detail-error'>
              <p>현재 플랜 정보가 없습니다.</p>
            </div>
          ) : (
            <div className='sp-plan-options'>
              {plans.map(plan => (
                <label
                  key={plan.id}
                  className={`sp-plan-option ${
                    selectedPlan?.id === plan.id ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedPlan?.id === plan.id}
                    onChange={() => setSelectedPlan(plan)}
                  />

                  <div className='sp-plan-info'>
                    <div className='sp-plan-name'>{plan.name}</div>
                    <div className='sp-plan-price'>
                      {plan.price
                        ? `${plan.price.toLocaleString()}원 / ${plan.period}`
                        : '상담 필요'}
                    </div>
                  </div>

                  {plan.discount && (
                    <div className='sp-plan-badge'>
                      <span className='sp-discount-badge'>
                        {plan.discount}% 할인
                      </span>
                    </div>
                  )}
                </label>
              ))}
            </div>
          )}

          <label className='sp-checkbox-label'>
            <input
              type='checkbox'
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>자동 정기결제 동의 (해지요금 없음)</span>
          </label>
        </div>

        <div className='sp-modal-footer'>
          <button
            className={`sp-modal-btn sp-btn-subscribe ${
              !agreed ? 'disabled' : ''
            }`}
            onClick={onSubscribe}
            disabled={!agreed}
          >
            가입하기
          </button>
          <button
            className='sp-modal-btn sp-btn-cancel'
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlanModal
