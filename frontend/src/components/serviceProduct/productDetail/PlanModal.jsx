import { addToCart } from '../../../api/cartApi'
import '../../../assets/css/ServiceProduct/Planmodal.css'

function PlanModal({ open, onClose, product, agreed, setAgreed, onSubscribe }) {
  if (!open) return null

  const title = product?.name ?? '상품'
  const summary = product?.summary ?? ''
  const detailText = product?.description ?? ''

  const isFree = product?.priceType === 'FREE'

  // DB에서 내려준 plan 값 사용
  const period =
    product?.plan?.periodText ??
    (isFree ? '무료 · 즉시 적용' : '기간 정보 없음')

  const finalPrice = product?.plan?.finalPrice

  const priceLabel = isFree
    ? '무료'
    : (typeof finalPrice === 'number'
      ? `${finalPrice.toLocaleString()}원`
      : '가격 미정(문의 필요)')

  const canPay = isFree || typeof finalPrice === 'number'
  const canSubmit = agreed && canPay

  const primaryText = isFree ? '바로 적용하기' : '결제하기'

  // [신규] 장바구니 담기 버튼 핸들러
  const handleAddToCart = async () => {
    if (!product) return

    // 유료 상품인데 플랜 정보가 없으면 불가
    if (!isFree && !product.plan) {
      alert('준비된 플랜이 없습니다.')
      return
    }

    if (!agreed) {
      alert('약관에 동의해주세요.')
      return
    }

    try {
      await addToCart({
        productId: product.id,
        planId: product.plan?.planId,
        quantity: 1
      })
      alert('장바구니에 쏙! 담겼습니다. 🛒')
      onClose()
    } catch (err) {
      console.error(err)
      alert('장바구니 담기 실패: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className='sp-modal-backdrop' onClick={onClose}>
      <div className='sp-modal sp-modal-improved' onClick={(e) => e.stopPropagation()}>
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

        <div className='sp-modal-body sp-modal-body-improved'>
          {!product ? (
            <div className='sp-detail-error sp-empty-state'>
              <div className='sp-empty-icon'>📭</div>
              <p className='sp-empty-text'>상품 정보를 불러오지 못했습니다.</p>
            </div>
          ) : (
            <>
              <div className='sp-plan-intro'>
                <p className='sp-plan-intro-text'>
                  아래 내용을 확인한 뒤 {isFree ? '신청' : '결제'}를 진행해주세요.
                </p>
                {isFree && (
                  <p className='sp-plan-intro-text' style={{ opacity: 0.85, marginTop: 6 }}>
                    무료 상품이라 결제 없이 즉시 적용 가능합니다.
                  </p>
                )}
              </div>

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
                  <span className={`sp-summary-value ${!canPay ? 'is-warn' : ''}`}>
                    {priceLabel}
                  </span>
                </div>

                {summary && (
                  <div className='sp-summary-desc'>
                    <div className='sp-summary-desc-title'>요약</div>
                    <div className='sp-summary-desc-text'>{summary}</div>
                  </div>
                )}

                {detailText && (
                  <details className='sp-details'>
                    <summary className='sp-details-summary'>상세 안내 보기</summary>
                    <div className='sp-details-body'>{detailText}</div>
                  </details>
                )}

                {!canPay && (
                  <div className='sp-alert sp-alert-warn'>
                    유료 상품인데 가격 정보가 없습니다. 플랜 가격 또는 상세 가격을 등록해주세요.
                  </div>
                )}
              </div>
            </>
          )}

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

        <div className='sp-modal-footer sp-modal-footer-improved'>
          <button
            className={`sp-modal-btn sp-btn-subscribe sp-btn-subscribe-improved ${!canSubmit ? 'disabled' : ''}`}
            onClick={() => {
              if (!canSubmit) return
              onSubscribe?.()
            }}
            disabled={!canSubmit}
          >
            <span className='sp-btn-icon'>{isFree ? '✅' : '💳'}</span>
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
