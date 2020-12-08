const winston = require('winston')

const loggerFormat = winston.format.printf(info => {
  return `${info.timestamp} | ${info.level} | ${info.message}`;
});

class LoggingService {
    constructor(options) {
      const logger_local = winston.createLogger(options);

      // Pass through the arguments
      this.info = (msg) => logger_local.info(this.traceCaller() + " | " + msg);
      this.error = (msg) => logger_local.error(this.traceCaller() + " | " + msg);
      this.debug = (msg) => logger_local.debug(this.traceCaller() + " | " + msg);
      this.warn = (msg) => logger_local.warn(this.traceCaller() + " | " + msg);

      /**
        * examines the call stack and returns a string indicating
        * the file and line number of the n'th previous ancestor call.
        * this works in chrome, and should work in nodejs as well.
        *
        * @param n : int (default: n=1) - the number of calls to trace up the
        *   stack from the current call.  `n=0` gives you your current file/line.
        *  `n=1` gives the file/line that called you.
        */
      this.traceCaller = function(n) {
        if( isNaN(n) || n<0) n=1;
        n+=1;
        var s = (new Error()).stack
          , a=s.indexOf('\n',5);
        while(n--) {
          a=s.indexOf('\n',a+1);
          if( a<0 ) { a=s.lastIndexOf('\n',s.length); break;}
        }
        let b = s.indexOf('\n',a+1); if( b<0 ) b=s.length;
        a=Math.max(s.lastIndexOf(' ',b), s.lastIndexOf('/',b));
        b=s.lastIndexOf(':',b);
        s=s.substring(a+1,b);
        return s;
      }

    }
  }

module.exports = new LoggingService({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    loggerFormat
  ),
  transports: [
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true,
      timestamp: true,
      json: false
    })
  ]
});