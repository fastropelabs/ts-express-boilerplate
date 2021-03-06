import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as logger from 'morgan';
import { HttpError } from './errors';
import router from './routes';
const app: express.Express = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('[:date[iso]] :method :url :status - :response-time ms'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new HttpError('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((error: any, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      message: error.message,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((error: any, req, res, next) => {
  res.status(error.status || 500);
  res.json('error', {
    message: error.message,
  });
  return null;
});

export default app;
