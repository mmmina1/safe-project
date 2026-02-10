package com.safe.backend.domain.user.service;

import com.safe.backend.domain.user.dto.*;
import com.safe.backend.domain.user.entity.*;
import com.safe.backend.domain.user.repository.UserStateRepository;
import com.safe.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final UserStateRepository userStateRepository;

    @Transactional(readOnly = true)
    public List<UserResponse> searchUsers(UserSearchRequest request) {
        String keyword = (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) 
                ? request.getKeyword().trim() : null;
        
        List<User> users = userRepository.searchUsers(
                keyword,
                request.getStatus()
        );

        return users.stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAgents() {
        List<User> agents = userRepository.findByRoleIn(
                List.of(com.safe.backend.domain.user.entity.UserRole.ADMIN, 
                        com.safe.backend.domain.user.entity.UserRole.OPERATOR)
        );
        return agents.stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        return new UserResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserActionHistoryResponse> getUserActionHistory(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        }
        
        List<UserState> states = userStateRepository.findByUserIdOrderByStateDateDesc(userId);
        return states.stream()
                .map(UserActionHistoryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse applyUserAction(Long userId, UserActionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 이력 기록
        UserState state = UserState.of(
                userId,
                request.getAdminId(),
                request.getType(),
                request.getReason()
        );
        userStateRepository.save(state);

        // 상태 변경
        if (request.getType() == StateType.SUSPENDED || request.getType() == StateType.BANNED) {
            user.setStatus(UserStatus.SUSPENDED);
        }
        // WARNING은 상태 변경 없이 이력만 기록

        return new UserResponse(user);
    }

    @Transactional
    public UserResponse releaseUser(Long userId, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        
        // 현재 적용중인 제재 해제
        List<UserState> activeStates = userStateRepository.findByUserIdAndEndDateIsNull(userId);
        for (UserState state : activeStates) {
            state.release();
        }
        
        user.setStatus(UserStatus.ACTIVE);
        return new UserResponse(user);
    }

    @Transactional
    public void deleteUser(Long userId, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        
        // 이미 삭제된 회원인지 확인
        if (user.getStatus() == UserStatus.DELETED) {
            throw new IllegalArgumentException("이미 삭제된 회원입니다.");
        }
        
        // 삭제 이력 기록
        UserState state = UserState.of(
                userId,
                adminId,
                StateType.DELETED,
                "운영자에 의한 회원 삭제"
        );
        userStateRepository.save(state);
        
        // 상태를 DELETED로 변경 (소프트 삭제)
        user.setStatus(UserStatus.DELETED);
    }

    @Transactional
    public UserResponse restoreUser(Long userId, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        
        // 삭제된 회원이 아닌지 확인
        if (user.getStatus() != UserStatus.DELETED) {
            throw new IllegalArgumentException("삭제된 회원이 아닙니다.");
        }
        
        // 삭제 이력 종료 처리
        List<UserState> deletedStates = userStateRepository.findByUserIdAndTypeAndEndDateIsNull(userId, StateType.DELETED);
        for (UserState state : deletedStates) {
            state.release();
        }
        
        // 상태를 ACTIVE로 복구 (이전 상태를 알 수 없으므로 ACTIVE로 설정)
        user.setStatus(UserStatus.ACTIVE);
        
        return new UserResponse(user);
    }
}
