import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { tex2svg, svg2png, toMathml } from './adaptor';

const app = express();

// Helmet
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/mathml', async (req, res, next) => {
  const mode = Object.keys(req.query).includes('from')
    ? 'block'
    : Object.keys(req.query).includes('inline')
    ? 'inline'
    : null;
  if (!mode) {
    return next();
  }
  const isInline = mode === 'inline';
  const equation = (isInline ? req.query.inline : req.query.from).toString();
  if (equation.match(/\.ico$/)) {
    return next();
  }
  
  const normalizedEquation = equation.replace(/\.(svg|png)$/, '');

  try {
    let type = (req.query.type || 'text').toString();
    const svgString = toMathml(normalizedEquation, type, isInline);

    res.setHeader('cache-control', 's-maxage=604800, maxage=604800');

    res.contentType('text/plane');
    res.end(svgString);
  } catch (err) {
    res.status(500);
    res.write(err);
    res.end();
  }
});

app.get('/img', async (req, res, next) => {
    const mode = Object.keys(req.query).includes('from')
      ? 'block'
      : Object.keys(req.query).includes('inline')
      ? 'inline'
      : null;
    if (!mode) {
      return next();
    }
    const isInline = mode === 'inline';
    const equation = (isInline ? req.query.inline : req.query.from).toString();
    if (equation.match(/\.ico$/)) {
      return next();
    }

    let color = (req.query.color || 'black').toString();
    if (/[^a-zA-Z0-9#]/.test(color)) {
      return next();
    } 
    const isPNG = /\.png$/.test(equation);
    const normalizedEquation = equation.replace(/\.(svg|png)$/, '');
  
    try {
      let type = (req.query.type || 'text').toString();
      const svgString = tex2svg(normalizedEquation, type, isInline, color);
      const imageData = isPNG ? await svg2png(svgString) : svgString;
  
      res.setHeader('cache-control', 's-maxage=604800, maxage=604800');
      if (isPNG) {
        res.contentType('image/png');
      } else {
        res.contentType('image/svg+xml');
        res.write(`<?xml version="1.0" standalone="no" ?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
    `);
      }  
      res.end(imageData);
    } catch (err) {
      res.status(500);
      res.write(
        '<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-size="15">',
      );
      res.write(err);
      res.end('</text></svg>');
    }
});

// welcome page
// app.get('/', function(req, res) {
//   res.redirect(301, '/home');
// });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
     console.log(`Server is running in http://localhost:${PORT}`)
})

export default app;
