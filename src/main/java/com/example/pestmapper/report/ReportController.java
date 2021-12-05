package com.example.pestmapper.report;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/report")
@AllArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public List<Report> getAllReports() {
        return reportService.getAllReports();
    }

    @PostMapping
    public void addReport(@Valid @RequestBody Report report) {
        reportService.addReport(report);
    }

    @DeleteMapping(path = "{reportId}")
    public void deleteReport(
            @PathVariable("reportId") Long reportId) {
        reportService.deleteReport(reportId);
    }
}
