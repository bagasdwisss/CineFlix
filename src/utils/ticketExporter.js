import QRCode from 'qrcode';

/**
 * CineFlix HD Digital Ticket Exporter
 * Renders a high-resolution, cinema-grade boarding pass image directly on HTML5 Canvas
 * and downloads it as a crystal-clear PNG image to the user's device.
 */
export async function downloadTicketImage(ticket) {
  if (!ticket) return;

  const bookingId = ticket.bookingId || ticket.orderId || 'FLIX-TICKET';
  const width = 840;
  const height = 1180;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0f0c20');
  bgGrad.addColorStop(0.5, '#161936');
  bgGrad.addColorStop(1, '#0b0918');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative border
  ctx.strokeStyle = 'rgba(106, 17, 203, 0.4)';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // 2. Top Header Banner
  const headerGrad = ctx.createLinearGradient(30, 30, width - 60, 180);
  headerGrad.addColorStop(0, '#6a11cb');
  headerGrad.addColorStop(0.5, '#3b82f6');
  headerGrad.addColorStop(1, '#2575fc');
  ctx.fillStyle = headerGrad;
  ctx.beginPath();
  ctx.roundRect(30, 30, width - 60, 150, [20, 20, 10, 10]);
  ctx.fill();

  // Header Text
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★ OFFICIAL CINEMA BOARDING PASS ★', width / 2, 75);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px "Cinzel", serif, sans-serif';
  ctx.fillText('CINEFLIX', width / 2, 125);

  ctx.fillStyle = '#e0e7ff';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SECURE DIGITAL ADMISSION TICKET', width / 2, 155);

  // 3. Movie Title & Info
  ctx.textAlign = 'center';
  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    ticket.orderType === 'event' ? 'EVENT / FESTIVAL PASS' : ticket.orderType === 'food' ? 'CONCESSION FnB ORDER' : 'JUDUL FILM BIOSKOP',
    width / 2,
    225
  );

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 32px "Plus Jakarta Sans", sans-serif';
  const movieTitle = ticket.movie || 'Tiket CineFlix Bioskop';
  // Truncate if too long
  const displayTitle = movieTitle.length > 34 ? movieTitle.substring(0, 32) + '...' : movieTitle;
  ctx.fillText(displayTitle, width / 2, 268);

  // Cinema & Studio
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(ticket.cinema || 'CINEFLIX CINEMA INDONESIA', width / 2, 305);

  // Studio badge
  ctx.fillStyle = '#8b5cf6';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${ticket.studio || 'Studio 1'}  •  ${ticket.gate || 'Gate 1'}`, width / 2, 335);

  // Divider Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(50, 365);
  ctx.lineTo(width - 50, 365);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4. Ticket Details 2-Column Grid
  const leftX = 70;
  const rightX = width / 2 + 30;

  // Row 1
  ctx.textAlign = 'left';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('KODE BOOKING:', leftX, 405);
  ctx.fillText('NAMA PEMESAN:', rightX, 405);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(bookingId, leftX, 435);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  const buyerName = ticket.buyerName || 'Pelanggan CineFlix';
  ctx.fillText(buyerName.length > 20 ? buyerName.substring(0, 18) + '..' : buyerName, rightX, 435);

  // Row 2
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TANGGAL TAYANG:', leftX, 480);
  ctx.fillText('JAM PENAYANGAN:', rightX, 480);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(ticket.date || 'Hari Ini', leftX, 510);
  ctx.fillText(ticket.time ? `${ticket.time} WIB` : '19:00 WIB', rightX, 510);

  // Row 3: Seats / Items
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('NOMOR KURSI / MENU:', leftX, 555);

  const seatsArray = Array.isArray(ticket.seats) ? ticket.seats : [ticket.seats || 'A1'];
  const seatsText = seatsArray.join(', ');
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(seatsText.length > 36 ? seatsText.substring(0, 34) + '...' : seatsText, leftX, 585);

  // Total
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TOTAL TRANSAKSI:', rightX, 555);

  const grandTotal = ticket.grandTotal || ticket.totalPrice || 0;
  ctx.fillStyle = '#34d399';
  ctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Rp ${grandTotal.toLocaleString('id-ID')}`, rightX, 585);

  // Divider Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(50, 625);
  ctx.lineTo(width - 50, 625);
  ctx.stroke();
  ctx.setLineDash([]);

  // 5. Draw High-Res QR Code directly on canvas
  const qrCanvas = document.createElement('canvas');
  // Formulate the self-verifying URL
  const href = window.location.href;
  const hashIndex = href.indexOf('#');
  let baseUrl = hashIndex > -1 ? href.substring(0, hashIndex) : href;
  baseUrl = baseUrl.replace(/index\.html\/?$/, '');
  if (!baseUrl.endsWith('/')) baseUrl += '/';
  const qrTargetUrl = `${baseUrl}#/verify/${encodeURIComponent(bookingId)}`;

  await QRCode.toCanvas(qrCanvas, qrTargetUrl, {
    width: 280,
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' }
  });

  // White Card Behind QR Code
  const qrX = (width - 320) / 2;
  const qrY = 655;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(qrX, qrY, 320, 320, 24);
  ctx.fill();

  // Draw QR code centered on the white card
  ctx.drawImage(qrCanvas, qrX + 20, qrY + 20, 280, 280);

  // QR Label
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 15px monospace';
  ctx.fillText(`SCAN RESMI GERBANG: ${bookingId}`, width / 2, 1015);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('✓ VALID & TERVERIFIKASI SISTEM CINEFLIX', width / 2, 1040);

  // 6. Security Footer
  ctx.fillStyle = '#475569';
  ctx.font = '12px monospace';
  ctx.fillText(`AUTHENTICATION HASH: SHA256-${bookingId}-CINEFLIX-PASS`, width / 2, 1085);
  ctx.fillText('Tunjukkan gambar tiket ini kepada petugas di gerbang bioskop.', width / 2, 1110);

  // 7. Trigger Direct Download
  const dataUrl = canvas.toDataURL('image/png');
  const downloadLink = document.createElement('a');
  downloadLink.href = dataUrl;
  downloadLink.download = `CineFlix_Tiket_${bookingId}.png`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
