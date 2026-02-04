package com.safe.backend.domain.admin.blindreason;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BlindReasonService {

    private final BlindReasonRepository blindReasonRepository;

    @Transactional(readOnly = true)
    public List<BlindReason> findAll() {
        return blindReasonRepository.findAll();
    }

    @Transactional
    public BlindReason create(String reasonName) {
        String name = reasonName == null ? "" : reasonName.trim();
        if (name.length() < 2) throw new IllegalArgumentException("사유명은 2자 이상입니다.");
        if (name.length() > 100) throw new IllegalArgumentException("사유명은 100자 이내입니다.");

        if (blindReasonRepository.existsByReasonName(name)) {
            throw new IllegalArgumentException("이미 존재하는 사유입니다.");
        }

        return blindReasonRepository.save(BlindReason.of(name));
    }

    @Transactional
    public BlindReason toggle(Long id) {
        BlindReason r = blindReasonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사유입니다."));
        r.toggle();
        return blindReasonRepository.save(r);
    }

    @Transactional
    public BlindReason update(Long id, String reasonName) {
        String name = reasonName == null ? "" : reasonName.trim();
        if (name.length() < 2) throw new IllegalArgumentException("사유명은 2자 이상입니다.");
        if (name.length() > 100) throw new IllegalArgumentException("사유명은 100자 이내입니다.");

        BlindReason r = blindReasonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사유입니다."));
        r.updateName(name);
        return blindReasonRepository.save(r);
    }

    @Transactional
    public void delete(Long id) {
        if (!blindReasonRepository.existsById(id)) {
            throw new IllegalArgumentException("존재하지 않는 사유입니다.");
        }
        blindReasonRepository.deleteById(id);
    }
}
