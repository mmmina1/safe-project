import { addToCart } from '../../../api/cartApi'
import '../../../assets/css/ServiceProduct/Planmodal.css'

function PlanModal({ open, onClose, product, agreed, setAgreed, onSubscribe }) {
  if (!open) return null

  // 1) 기간 추출: service_level의 "기간=..." 규칙을 최우선으로 사용
  const extractPeriod = () => {
    const serviceLevel = product?.detail?.service_level ?? ''
    const m = serviceLevel.match(/기간\s*=\s*([^;,\n]+)/)
    if (m && m[1]) return m[1].trim()

    // fallback: 텍스트에서 간단 파싱(단기용)
    const text = `${product?.name ?? ''} ${product?.summary ?? ''} ${serviceLevel} ${product?.detail?.detail_desc ?? ''}`

    if (text.includes('1년') || text.toLowerCase().includes('annual')) return '1년'
    if (text.includes('12개월')) return '12개월'
    if (text.includes('6개월')) return '6개월'
    if (text.includes('3개월')) return '3개월'
    if (text.includes('1개월')) return '1개월'

    return '기간 정보 없음'
  }

  // 2) 가격/결제 상태 정리
  const resolvePrice = () => {
    const priceType = product?.price_type // 'FREE' | 'PAID'
    const price = product?.detail?.price

    if (priceType === 'FREE') return { label: '무료', amount: 0, canPay: true }
    if (typeof price === 'number') return { label: `${price.toLocaleString()}원`, amount: price, canPay: true }

    // PAID인데 가격이 없으면 결제 진행 막는게 UX상 안전
    return { label: '가격 미정(문의 필요)', amount: null, canPay: false }
  }

  const period = extractPeriod()
  const priceInfo = resolvePrice()

  const title = product?.name ?? '상품'
  const summary = product?.summary ?? ''
  const detailText = product?.description ?? product?.detail?.detail_desc ?? ''
  const serviceLevel = product?.detail?.service_level ?? ''

  // 버튼 문구
  const primaryText =
    product?.price_type === 'FREE' ? '신청하기' : '결제하기'

  // 체크 조건: 동의 + (유료면 가격 확정)
  const canSubmit = agreed && !!product && priceInfo.canPay

  // [신규] 장바구니 담기 버튼 핸들러
  const handleAddToCart = async () => {
    if (!product) return
    if (!product.plans || product.plans.length === 0) {
      alert('준비된 플랜이 없습니다.')
      return
    }
    if (!selectedPlan) {
      alert('옵션(플랜)을 선택해주세요.')
      return
    }
    if (!agreed) {
      alert('약관에 동의해주세요.')
      return
    }

    try {
      await addToCart({
        productId: product.productId,
        planId: selectedPlan.planId,
        quantity: 1
      })
      alert('장바구니에 쏙! 담겼습니다. 🛒')
      onClose()
    } catch (err) {
      console.error(err)
      alert('장바구니 담기 실패: ' + (err.response?.data || err.message))
    }
  }

  return (
    <div className='sp-modal-backdrop' onClick={onClose}>
      <div className='sp-modal sp-modal-improved' onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className='sp-modal-header sp-modal-header-improved'>
          <h3>
            <span className='sp-modal-icon'>🧾</span>
            <span>구매 정보 확인</span>
          </h3>
          <button
            className='sp-modal-close sp-modal-close-improved'
            onClick={onClose}
            aria-label='닫기'
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className='sp-modal-body sp-modal-body-improved'>
          {!product ? (
            <div className='sp-detail-error sp-empty-state'>
              <div className='sp-empty-icon'>📭</div>
              <p className='sp-empty-text'>상품 정보를 불러오지 못했습니다.</p>
              <p className='sp-empty-subtext'>잠시 후 다시 시도해주세요.</p>
            </div>
          ) : (
            <>
              {/* 안내 배너 */}
              <div className='sp-plan-intro'>
                <p className='sp-plan-intro-text'>
                  아래 내용을 확인한 뒤 {product?.price_type === 'FREE' ? '신청' : '결제'}를 진행해주세요.
                </p>
              </div>

              {/* 핵심 요약 카드 */}
              <div className='sp-summary-card'>
                <div className='sp-summary-row'>
                  <span className='sp-summary-label'>상품</span>
                  <span className='sp-summary-value'>{title}</span>
                </div>

                <div className='sp-summary-row'>
                  <span className='sp-summary-label'>적용기간</span>
                  <span className={`sp-summary-value ${period === '기간 정보 없음' ? 'is-warn' : ''}`}>
                    {period}
                  </span>
                </div>

                <div className='sp-summary-row'>
                  <span className='sp-summary-label'>가격</span>
                  <span className={`sp-summary-value ${!priceInfo.canPay ? 'is-warn' : ''}`}>
                    {priceInfo.label}
                  </span>
                </div>

                {/* 서비스 레벨/적용 방식(있으면 짧게 보여주기) */}
                {serviceLevel && (
                  <div className='sp-summary-desc'>
                    <div className='sp-summary-desc-title'>적용 방식</div>
                    <div className='sp-summary-desc-text'>{serviceLevel}</div>
                  </div>
                )}

                {/* 요약 */}
                {summary && (
                  <div className='sp-summary-desc'>
                    <div className='sp-summary-desc-title'>요약</div>
                    <div className='sp-summary-desc-text'>{summary}</div>
                  </div>
                )}

                {/* 상세는 길어지면 접기(HTML details 사용) */}
                {detailText && (
                  <details className='sp-details'>
                    <summary className='sp-details-summary'>상세 안내 보기</summary>
                    <div className='sp-details-body'>{detailText}</div>
                  </details>
                )}

                {/* 가격/기간 미정 안내 */}
                {!priceInfo.canPay && (
                  <div className='sp-alert sp-alert-warn'>
                    유료 상품인데 가격 정보가 없습니다. 결제 진행 대신 문의/가격 등록 후 진행을 권장합니다.
                  </div>
                )}

                {period === '기간 정보 없음' && (
                  <div className='sp-alert sp-alert-warn'>
                    적용기간이 명확하지 않습니다. 상품 설명(요약/상세 또는 service_level)에 기간을 명시해주세요.
                  </div>
                )}
              </div>
            </>
          )}

          {/* 동의 */}
          <div className='sp-agreement-section'>
            <label className='sp-checkbox-label sp-checkbox-label-improved'>
              <input
                type='checkbox'
                className='sp-checkbox-improved'
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className='sp-agreement-text'>
                <span className='sp-agreement-main'>결제 및 이용약관에 동의합니다</span>
                <span className='sp-agreement-sub'>(해지요금 없음)</span>
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className='sp-modal-footer sp-modal-footer-improved'>
          <button
            className={`sp-modal-btn sp-btn-subscribe sp-btn-subscribe-improved ${!canSubmit ? 'disabled' : ''}`}
            onClick={() => {
              if (!canSubmit) return
              onSubscribe?.()
            }}
            disabled={!canSubmit}
          >
            <span className='sp-btn-icon'>{product?.price_type === 'FREE' ? '✅' : '💳'}</span>
            <span>{primaryText}</span>
          </button>

          {/* [신규] 장바구니 버튼 */}
          <button
            className={`sp-modal-btn sp-btn-cart ${!canSubmit ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!canSubmit}
            style={{ backgroundColor: '#f0f0f0', color: '#333', marginRight: '8px' }}
          >
            <span className='sp-btn-icon'>🛒</span>
            <span>담기</span>
          </button>

          <button
            className='sp-modal-btn sp-btn-cancel sp-btn-cancel-improved'
            onClick={onClose}
          >
            <span className='sp-btn-icon'>✕</span>
            <span>취소</span>
          </button>

        </div>
      </div>
    </div>
  )
}

export default PlanModal
