/** HTML-escape a value for safe use inside a print document */
export function escapeHtml(value: any): string {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (c) => `&#${c.charCodeAt(0)};`,
  );
}

/** Opens the browser print dialog for a full HTML document, rendered in a hidden iframe */
export function printHtml(html: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.cssText =
    'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
  document.body.appendChild(iframe);

  const win = iframe.contentWindow!;
  win.document.open();
  win.document.write(html);
  win.document.close();

  win.onafterprint = () => setTimeout(() => iframe.remove(), 500);
  // let images (logo) finish loading before opening the print dialog
  setTimeout(() => {
    win.focus();
    win.print();
  }, 300);
}
