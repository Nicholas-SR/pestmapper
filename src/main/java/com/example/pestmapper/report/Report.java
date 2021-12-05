package com.example.pestmapper.report;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Email;
import java.time.LocalDateTime;

@ToString
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class Report {
    @Id
    @SequenceGenerator(
            name = "report_sequence",
            sequenceName = "report_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "report_sequence",
            strategy = GenerationType.SEQUENCE)
    private Long id;
    @NotBlank
    @Column(nullable = false)
    private String name;
    @Email
    @Column(nullable = false, unique = true) // to prevent the same user from filing many reports add: unique = true
    private String email;
    @NotBlank
    @Column(nullable = false)
    private String address;
    @NotBlank
    @Column(nullable = false)
    private String placeId;
    @NotNull
    @Column(nullable = false)
    private Double lat;
    @NotNull
    @Column(nullable = false)
    private Double lng;
    @NotNull
    @Column(nullable = false, columnDefinition = "VARCHAR(2040)")
    private String comment;
    @NotNull
    @Column(nullable = false)
    private Integer day;
    @NotNull
    @Column(nullable = false)
    private Integer month;
    @NotNull
    @Column(nullable = false)
    private Integer year;
    @NotNull
    @Column(nullable = false)
    private Integer score;
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    private Bug bug;

    public Report(String name, String email, String address, String placeId, Double lat, Double lng, String comment, Integer day, Integer month, Integer year, Integer score, Bug bug) {
        // could add postal code as well
        this.name = name;
        this.email = email;
        this.address = address;
        this.placeId = placeId;
        this.lat = lat;
        this.lng = lng;
        this.comment = comment;
        this.day = day;
        this.month = month;
        this.year = year;
        this.score = score;
        this.bug = bug;

    }
}
