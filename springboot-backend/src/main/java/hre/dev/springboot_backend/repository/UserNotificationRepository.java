package hre.dev.springboot_backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import hre.dev.springboot_backend.model.UserNotification;
import hre.dev.springboot_backend.model.UserNotificationId;

public interface UserNotificationRepository extends JpaRepository<UserNotification, UserNotificationId>, UserNotificationRepositoryCustom {
    @Query("""
            select un from UserNotification un
            join fetch un.notification n
            join fetch n.eventHistory eh
            where un.id.userId = :userId
            order by n.createdAt desc
            """)
    List<UserNotification> findAllByUserId(@Param("userId") Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            update UserNotification un
            set un.read = true, un.readAt = :now
            where un.id.userId = :userId and un.read = false
            """)
    int markAllAsRead(@Param("userId") Long userId, @Param("now") LocalDateTime now);
}
