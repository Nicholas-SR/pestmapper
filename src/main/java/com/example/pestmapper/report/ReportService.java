package com.example.pestmapper.report;

import com.example.pestmapper.report.exception.BadRequestException;
import com.example.pestmapper.report.exception.ReportNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ReportService {

    private final ReportRepository reportRepository;

    public List<Report> getAllReports() {
          return reportRepository.findAll();
    }

    public void addReport(Report report) {
        reportRepository.save(report);
    }

    public void deleteReport(Long reportId) {
        if(!reportRepository.existsById(reportId)) {
            throw new ReportNotFoundException(
                    "Report with id " + reportId + " does not exists");
        }
        reportRepository.deleteById(reportId);
    }
}
