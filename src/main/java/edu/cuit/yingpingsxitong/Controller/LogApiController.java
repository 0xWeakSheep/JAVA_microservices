package edu.cuit.yingpingsxitong.Controller;

import edu.cuit.yingpingsxitong.Entity.Log;
import edu.cuit.yingpingsxitong.Service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class LogApiController {
    private final LogService logService;

    @Autowired
    public LogApiController(LogService logService) {
        this.logService = logService;
    }

    @GetMapping
    public List<Log> listLogs() {
        return logService.findAllLog();
    }
}
