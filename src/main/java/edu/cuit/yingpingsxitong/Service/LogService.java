package edu.cuit.yingpingsxitong.Service;

import edu.cuit.yingpingsxitong.Config.SequenceGeneratorService;
import edu.cuit.yingpingsxitong.Entity.Log;
import edu.cuit.yingpingsxitong.Repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class LogService {
    private final LogRepository logRepository;
    private final SequenceGeneratorService sequenceGeneratorService;

    @Autowired
    public LogService(LogRepository logRepository, SequenceGeneratorService sequenceGeneratorService) {
        this.logRepository = logRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    public void saveLog(String methodName, String userName) {
        Log log = new Log();
        log.setId(sequenceGeneratorService.getNextSequence("log_sequence"));
        log.setMethodName(methodName);
        log.setUserName(userName);
        log.setTimestamp(new Date());
        logRepository.save(log);
    }

    public List<Log> findAllLog() {
        return logRepository.findAllByOrderByTimestampDesc();
    }
}
