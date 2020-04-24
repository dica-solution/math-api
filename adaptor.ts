import svg2img from 'svg2img';

import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { MathML } from 'mathjax-full/js/input/mathml';
import { AsciiMath } from 'mathjax-full/js/input/asciimath';
import { SVG } from 'mathjax-full/js/output/svg';
import { LiteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor';
import { HTMLDocument } from 'mathjax-full/js/handlers/html/HTMLDocument';
// MathJax bootstrap
const adaptor = new LiteAdaptor();
RegisterHTMLHandler(adaptor);

export function tex2svg(equation: string, type: string, isInline: boolean, color: string): string {
  let input = {}
  if (type=="mathml") {
    input = new MathML({})
  } else if (type=="asciimath") {
    input = new AsciiMath({});
  } else {
    input = new TeX({ packages: AllPackages })
  }
  const html = mathjax.document('', {
    InputJax: input,
    OutputJax: new SVG({ fontCache: 'none' }),
  });

  const svg = adaptor
    .innerHTML(html.convert(equation, { display: !isInline }))
    .replace(/fill="currentColor"/, `fill="${color}"`);
  if (svg.includes("merror")) {
    return svg.replace(/<rect.+?><\/rect>/, '');
  }
  return svg;
}

export function svg2png(svgString: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const [width, height] = svgString
      .match(/width="([\d.]+)ex" height="([\d.]+)ex"/)!
      .slice(1)
      .map(s => parseFloat(s));
    const args = {
      width: `${width * 3}ex`,
      height: `${height * 3}ex`,
    };
    svg2img(svgString, args, function(error: Error, buffer: Buffer) {
      if (error) {
        return reject(error);
      }
      resolve(buffer);
    });
  });
}

export function toMathml(equation: string, type: string, isInline: boolean): string {
  let input = {}
  if (type=="asciimath") {
    input = new AsciiMath({});
  } else {
    input = new TeX({})
  }

  const html = new HTMLDocument('', adaptor, {InputJax: input});
  const visitor = new SerializedMmlVisitor();

  const toMathML = (node: any):string => visitor.visitDefault(node,"");
 
  return toMathML(html.convert(equation, {display: !isInline}));
}