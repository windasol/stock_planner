package com.stockplanner.model.entity;

import com.stockplanner.model.enums.Market;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "stocks", uniqueConstraints = @UniqueConstraint(columnNames = {"ticker", "market"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String ticker;

    @Column(nullable = false)
    private String name;

    @Column(length = 100)
    private String sector;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Market market;

    @Column(length = 3)
    private String currency;

    private Long marketCap;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 20)
    private String exchange;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}
