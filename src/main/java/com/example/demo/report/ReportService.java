package com.example.demo.report;

import com.example.demo.report.exception.BadRequestException;
import com.example.demo.report.exception.ReportNotFoundException;
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
        Boolean existsEmail = reportRepository
                .selectExistsEmail(report.getEmail());
        if (existsEmail) {
            throw new BadRequestException(
                    "Email " + report.getEmail() + " already exists in the table!");
        }
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
