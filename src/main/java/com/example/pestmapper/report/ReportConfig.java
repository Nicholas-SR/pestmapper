package com.example.pestmapper.report;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
public class ReportConfig {
    @Bean
    CommandLineRunner commandLineRunner(
            ReportRepository repository) {
        return args -> {
            Report report1 = new Report(
                    "Maria Garcia",
                    "145 Queen St S, Hamilton, ON, Canada",
                    "ChIJWzlCy3CbLIgRjNiNNgl16rI",
                    43.2546596d,
                    -79.88030189999999d,
                    "Don't rent here, there are bedbugs on nearly every floor.",
                    3,
                    10,
                    2021,
                    1,
                    Bug.BEDBUG
            );
            Report report2 = new Report(
                    "Omar Aziz",
                    "160 Market St, Hamilton, ON L8R 3J6, Canada",
                    "ChIJtRSo0HibLIgRJqKqFyRZ6YY",
                    43.2600023d,
                    -79.8764523d,
                    "There are bedbugs on the 4th floor. Management doesn't do anything.",
                    2,
                    3,
                    2021,
                    2,
                    Bug.BEDBUG
            );
            Report report3 = new Report(
                    "Mike Miller",
                    "192 Hughson St. N, Hamilton, ON, Canada",
                    "ChIJ5ZFgNoabLIgRVkMbLjHRLGc",
                    43.2615571d,
                    -79.864946d,
                    "I've had my unit treated for bedbugs and roaches 6 times and they're still here.",
                    2,
                    6,
                    2021,
                    3,
                    Bug.BOTH
            );
            // Uncomment below to add fake users to the table
            // You'll have to comment it again after the first run because it will cause an error since you would be adding elements that already exist
            //repository.saveAll(List.of(report1, report2, report3));
        };
    }
}
