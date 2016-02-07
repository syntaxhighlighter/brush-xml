var BrushBase = require('brush-base');
var regexLib = require('syntaxhighlighter-regex').commonRegExp;
var XRegExp = require('syntaxhighlighter-regex').XRegExp;
var Match = require('syntaxhighlighter-match').Match;

function Brush() {
  function process(match, regexInfo) {
    var code = match[0],
      tag = XRegExp.exec(code, XRegExp('(&lt;|<)[\\s\\/\\?!]*(?<name>[:\\w-\\.]+)', 'xg')),
      result = [];

    if (match.attributes != null) {
      var attributes,
        pos = 0,
        regex = XRegExp('(?<name> [\\w:.-]+)' +
          '\\s*=\\s*' +
          '(?<value> ".*?"|\'.*?\'|\\w+)',
          'xg');

      while ((attributes = XRegExp.exec(code, regex, pos)) != null) {
        result.push(new Match(attributes.name, match.index + attributes.index, 'color1'));
        result.push(new Match(attributes.value, match.index + attributes.index + attributes[0].indexOf(attributes.value), 'string'));
        pos = attributes.index + attributes[0].length;
      }
    }

    if (tag != null)
      result.push(
        new Match(tag.name, match.index + tag[0].indexOf(tag.name), 'keyword')
      );

    return result;
  }

  this.regexList = [
    {
      regex: XRegExp('(\\&lt;|<)\\!\\[[\\w\\s]*?\\[(.|\\s)*?\\]\\](\\&gt;|>)', 'gm'),
      css: 'color2'
    },
    {
      regex: regexLib.xmlComments,
      css: 'comments'
    },
    {
      regex: XRegExp('(&lt;|<)[\\s\\/\\?!]*(\\w+)(?<attributes>.*?)[\\s\\/\\?]*(&gt;|>)', 'sg'),
      func: process
    }
	];
};

Brush.prototype = new BrushBase();
Brush.aliases = ['xml', 'xhtml', 'xslt', 'html', 'plist'];
module.exports = Brush;