'use strict';

const { unescapeHTML, escapeHTML } = require('hexo-util');
const { decodeHTML } = require('entities');
const { codeToHtml } = require('shiki');
const shikiHtmlCache = new Map();

function toSafeLanguage(rawLanguage) {
  if (!rawLanguage) return 'text';
  const normalized = String(rawLanguage).toLowerCase();
  const aliasMap = {
    plaintext: 'text',
    plain: 'text',
    text: 'text',
    txt: 'text',
    shell: 'bash',
    sh: 'bash',
    zsh: 'bash',
    shellscript: 'bash',
    yml: 'yaml',
    md: 'markdown',
    js: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    tsx: 'typescript',
    jsx: 'javascript'
  };
  return aliasMap[normalized] || normalized;
}

hexo.extend.filter.register('after_render:html', async function renderWithShiki(str, data) {
  if (!str || (!str.includes('<pre><code class="language-') && !str.includes('<figure class="highlight '))) return str;
  if (!data || !data.path || !data.path.endsWith('.html')) return str;

  const convertToShiki = async (code, languageRaw) => {
    const safeLanguage = toSafeLanguage(languageRaw);
    const cacheKey = `${safeLanguage}\n${code}`;
    if (shikiHtmlCache.has(cacheKey)) {
      return shikiHtmlCache.get(cacheKey);
    }

    let shikiHtml;
    try {
      shikiHtml = await codeToHtml(code, {
        lang: safeLanguage,
        themes: {
          light: 'github-light-default',
          dark: 'dark-plus'
        }
      });
    } catch (error) {
      shikiHtml = await codeToHtml(code, {
        lang: 'text',
        themes: {
          light: 'github-light-default',
          dark: 'dark-plus'
        }
      });
    }
    const languageAttr = escapeHTML(languageRaw || 'text');
    const finalHtml = shikiHtml.replace('<pre ', `<pre data-language="${languageAttr}" `);
    shikiHtmlCache.set(cacheKey, finalHtml);
    return finalHtml;
  };

  // Case 1: markdown-it code fence output
  const fencePattern = /<pre[^>]*>\s*<code[^>]*class="[^"]*language-([a-zA-Z0-9_+-]+)[^"]*"[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/g;
  str = await replaceAsync(str, fencePattern, async (_full, languageRaw, codeEncoded) => {
    const code = decodeHTML(unescapeHTML(codeEncoded || ''));
    return convertToShiki(code, languageRaw);
  });

  // Case 2: Hexo default highlight output
  const highlightPattern = /<figure[^>]*class="[^"]*highlight\s+([a-zA-Z0-9_+-]+)[^"]*"[^>]*>([\s\S]*?)<\/figure>/g;
  str = await replaceAsync(str, highlightPattern, async (_full, languageRaw, bodyHtml) => {
    const codePreMatch = bodyHtml.match(/<td[^>]*class="[^"]*code[^"]*"[^>]*>\s*<pre[^>]*>([\s\S]*?)<\/pre>\s*<\/td>/);
    if (!codePreMatch) return _full;

    let codeHtml = codePreMatch[1] || '';
    codeHtml = codeHtml
      .replace(/<br\s*\/?\s*>/gi, '\n')
      .replace(/<[^>]+>/g, '');

    const code = decodeHTML(unescapeHTML(codeHtml)).replace(/\n$/, '');
    return convertToShiki(code, languageRaw);
  });

  return str;
}, 9);

async function replaceAsync(input, pattern, replacer) {
  const matches = [...input.matchAll(pattern)];
  if (!matches.length) return input;

  let output = '';
  let cursor = 0;

  for (const match of matches) {
    const start = match.index;
    output += input.slice(cursor, start);
    output += await replacer(...match);
    cursor = start + match[0].length;
  }

  output += input.slice(cursor);
  return output;
}
