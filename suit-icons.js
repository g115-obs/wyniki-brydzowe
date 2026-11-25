/* Card-suit silhouettes redrawn from the small wj13.htm reference icons. */
(() => {
  const icons = {
    '♠': ['pik', '#111111', 'M8 0C6.8 2.4 1 5.4 1 9c0 3.2 3.6 4.3 6 1.8-.1 2-1 3.8-2.1 5.2h6.2c-1.1-1.4-2-3.2-2.1-5.2C11.4 13.3 15 12.2 15 9c0-3.6-5.8-6.6-7-9Z'],
    '♥': ['kier', '#c1121f', 'M8 16C6.4 14 1 9.8 1 5.2 1 .7 5.4-.4 8 3 10.6-.4 15 .7 15 5.2 15 9.8 9.6 14 8 16Z'],
    '♦': ['karo', '#9d174d', 'M8 0 16 8 8 16 0 8Z'],
    '♣': ['trefl', '#075e45', 'M8 0a3.7 3.7 0 0 1 2.4 6.5 3.7 3.7 0 1 1-1.6 4.6c.1 2 .9 3.6 2.1 4.9H5.1c1.2-1.3 2-2.9 2.1-4.9a3.7 3.7 0 1 1-1.6-4.6A3.7 3.7 0 0 1 8 0Z']
  };
  const ns = 'http://www.w3.org/2000/svg';
  const excluded = 'script,style,select,textarea,svg,template,[contenteditable]';
  function render(node) {
    if (node.nodeType === 1 && node.closest(excluded)) return;
    if (node.nodeType === 3) {
      if (!node.parentElement || node.parentElement.closest(excluded)) return;
      const parts = node.data.split(/([♠♥♦♣][\uFE0E\uFE0F]?)/);
      if (parts.length === 1) return;
      const fragment = document.createDocumentFragment();
      parts.forEach((part, index) => {
        if (!index || index % 2 === 0) { if (part) fragment.append(part); return; }
        const [label, color, shape] = icons[part[0]];
        const svg = document.createElementNS(ns, 'svg');
        for (const [key, value] of Object.entries({viewBox:'0 0 16 16', width:'.82em', height:'.82em', role:'img', 'aria-label':label, focusable:'false'})) svg.setAttribute(key, value);
        svg.style.cssText = 'display:inline-block;vertical-align:-.04em;flex:none;overflow:visible';
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', shape);
        path.setAttribute('fill', color);
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '.65');
        path.setAttribute('paint-order', 'stroke fill');
        svg.append(path);
        fragment.append(svg);
      });
      node.replaceWith(fragment);
    } else if (node.nodeType === 1) {
      for (const child of Array.from(node.childNodes)) render(child);
    }
  }
  function start() {
    render(document.body);
    new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') render(record.target);
        else for (const node of record.addedNodes) if (node.isConnected) render(node);
      }
    }).observe(document.body, {subtree:true, childList:true, characterData:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
