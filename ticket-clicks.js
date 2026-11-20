function recordTicketClick(event) {
  if ((event.type === 'click' && event.button !== 0) || (event.type === 'auxclick' && event.button !== 1)) return;
  const link = event.target instanceof Element && event.target.closest('a[data-ticket-facility]');
  if (!link || event.defaultPrevented) return;

  const payload = new URLSearchParams({
    facility: link.dataset.ticketFacility,
    surface: link.classList.contains('tickets') ? 'guide' : 'card',
  });
  if (navigator.sendBeacon?.('/api/ticket-click', payload)) return;
  fetch('/api/ticket-click', { method: 'POST', body: payload, keepalive: true }).catch(() => {});
}
document.addEventListener('click', recordTicketClick);
document.addEventListener('auxclick', recordTicketClick);
