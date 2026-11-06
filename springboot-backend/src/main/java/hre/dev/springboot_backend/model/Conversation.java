package hre.dev.springboot_backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "conversations")
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creator_id")
    private User creator;

    @Column
    private String name;

    @Column
    private LocalDateTime started;

    @Column
    private String state;

    @Column
    private int approval;

    @Column
    private int disapproval;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    private void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        started = now;
        state = "OPEN";
        approval = 0;
        disapproval = 0;
        createdAt = now;
        updatedAt = now;
        isActive = true;
        deletedAt = null;
    }

    protected Conversation() {
    }

    public Conversation(User creator, String name) {
        this.creator = creator;
    }

    public void softDelete() {
        this.isActive = false;
        this.deletedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getStarted() {
        return started;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public int getApproval() {
        return approval;
    }

    public void setApproval(int approval) {
        this.approval = approval;
    }

    public int getDisapproval() {
        return disapproval;
    }

    public void setDisapproval(int disapproval) {
        this.disapproval = disapproval;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
}
