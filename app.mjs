// app.mjs
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from 'morgan';
import { engine } from 'express-handlebars';

import { router as indexRouter } from './routes/index.mjs';
import { router as notesRouter } from './routes/notes.mjs'; // Import the notes router
import { InMemoryNotesStore } from './models/notes-memory.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize NotesStore
export const NotesStore = new InMemoryNotesStore();

// view engine setup
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'layout', layoutsDir: path.join(__dirname, 'views'), partialsDir: path.join(__dirname, 'views/partials') }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/notes', notesRouter); // Use the notes router for /notes routes

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.statusCode = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.statusCode || 500);
  res.render('error');
});

export default app;