import React, { useState } from 'react';

function ProductQnaAnswer({ onSubmit, submitting }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, content, isPrivate });
    };

    return (
        <form onSubmit={handleSubmit} className="sp-qna-form">
            <input
                type="text"
                placeholder="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <label>
                <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                />
                비밀글 설정
            </label>
            <button type="submit" disabled={submitting}>
                {submitting ? '등록 중...' : '문의 등록'}
            </button>
        </form>
    );
}

export default ProductQnaAnswer;
