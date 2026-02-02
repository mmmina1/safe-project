package com.safe.backend.domain.admin.notice;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * DB에 기존에 다른 값(한글, 구 enum 등)이 들어 있어도 조회 시 매핑 오류가 나지 않도록
 * 알 수 없는 값은 GENERAL로 변환합니다.
 */
@Converter(autoApply = true)
public class NoticeTypeConverter implements AttributeConverter<NoticeType, String> {

    @Override
    public String convertToDatabaseColumn(NoticeType attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public NoticeType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return NoticeType.GENERAL;
        }
        try {
            return NoticeType.valueOf(dbData.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return NoticeType.GENERAL;
        }
    }
}
