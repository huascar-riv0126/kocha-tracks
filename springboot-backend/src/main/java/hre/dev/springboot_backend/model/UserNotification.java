package hre.dev.springboot_backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "users_notifications")
public class UserNotification {
    @EmbeddedId
    private UserNotificationId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @MapsId("notificationId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "notification_id")
    private Notification notification;

    @Column(name = "is_read", nullable = false)
    private boolean read;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void onCreate() {
        read = false;
        readAt = null;
        createdAt = LocalDateTime.now();
    }

    protected UserNotification() {
    }

    public UserNotification(Long userId, Notification notification) {
        this.id = new UserNotificationId(userId, notification != null ? notification.getId() : null);
        this.notification = notification;
    }

    public UserNotification(User user, Notification notification) {
        this.user = user;
        this.notification = notification;
        this.id = new UserNotificationId(
                user != null ? user.getId() : null,
                notification != null ? notification.getId() : null);
    }

    public void markAsRead() {
        if (!read) {
            read = true;
            readAt = LocalDateTime.now();
        }
    }

    public UserNotificationId getId() {
        return id;
    }

    public void setId(UserNotificationId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Notification getNotification() {
        return notification;
    }

    public void setNotification(Notification notification) {
        this.notification = notification;
    }

    public boolean isRead() {
        return read;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
