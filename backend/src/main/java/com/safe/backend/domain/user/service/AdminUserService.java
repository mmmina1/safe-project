package com.safe.backend.domain.user.service;

import com.safe.backend.domain.user.dto.*;
import com.safe.backend.domain.user.entity.*;
import com.safe.backend.domain.user.repository.UserStateRepository;
import com.safe.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final UserStateRepository userStateRepository;

    /**
     * 관리자용 회원 검색
     * - keyword, status 기준으로 필터링
     * - 반환은 UserAdminResponse (riskScore, riskStatus 포함)
     */
    @Transactional(readOnly = true)
    public List<UserAdminResponse> searchUsers(UserSearchRequest request) {
        String keyword = (request.getKeyword() != null && !request.getKeyword().trim().isEmpty())
                ? request.getKeyword().trim()
                : null;

        List<User> users = userRepository.searchUsers(
                keyword,
                request.getStatus()
        );

        return users.stream()
                .map(UserAdminResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 관리자용 회원 단건 조회
     */
    @Transactional(readOnly = true)
    public UserAdminResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        return UserAdminResponse.from(user);
    }

    /**
     * 특정 회원의 제재/상태 이력 조회
     */
    @Transactional(readOnly = true)
    public List<UserActionHistoryResponse> getUserActionHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        List<UserState> states =
                userStateRepository.findByUserIdOrderByStateDateDesc(userId);

        return states.stream()
                .map(state -> new UserActionHistoryResponse(state, user))
                .toList();
    }

    /**
     * 관리자 조치 적용 (WARNING / SUSPENDED / BANNED 등)
     */
    @Transactional
    public UserAdminResponse applyUserAction(Long userId, UserActionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 1) 이력 기록
        UserState state = UserState.of(
                userId,
                request.getAdminId(),
                request.getType(),
                request.getReason()
        );
        userStateRepository.save(state);

        // 2) 계정 상태 변경 로직
        if (request.getType() == StateType.SUSPENDED) {
            user.setStatus(UserStatus.SUSPENDED);
        }
        // WARNING은 상태 변경 없이 이력만 기록

        return UserAdminResponse.from(user);
    }

    /**
     * 관리자에 의한 제재 해제
     */
    @Transactional
    public UserAdminResponse releaseUser(Long userId, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 1) 현재 적용중인 제재들 종료 (endDate 세팅)
        List<UserState> activeStates = userStateRepository.findByUserIdAndEndDateIsNull(userId);
        for (UserState state : activeStates) {
            state.release();  // endDate 등 세팅
        }

        // 2) 제재 해제 이력 신규 추가
        UserState releaseState = UserState.of(
                userId,
                adminId,
                StateType.UNBLOCK,
                "관리자에 의한 제재 해제"   // 필요하면 파라미터로 reason 받도록 확장
        );
        userStateRepository.save(releaseState);

        // 3) 계정 상태 복구
        user.setStatus(UserStatus.ACTIVE);

        return UserAdminResponse.from(user);
    }


    /**
     * 전체 운영 이력 조회 (모든 사용자)
     */
    @Transactional(readOnly = true)
    public List<UserActionHistoryResponse> getAllActionHistory() {
        List<UserState> states = userStateRepository.findAllByOrderByStateDateDesc();

        // 1) userId만 추출
        Set<Long> userIds = states.stream()
                .map(UserState::getUserId)
                .collect(Collectors.toSet());

        // 2) userId → User 매핑
        Map<Long, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getUserId, u -> u));

        // 3) state + user 묶어서 DTO 생성
        return states.stream()
                .map(state -> {
                    User user = userMap.get(state.getUserId()); // 없을 수도 있으니 null 허용
                    return new UserActionHistoryResponse(state, user);
                })
                .toList();
    }

}
