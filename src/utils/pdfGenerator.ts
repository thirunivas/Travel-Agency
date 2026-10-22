import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { Booking } from '../types';

/**
 * Sanitizes strings for jsPDF built-in fonts (Helvetica/Times/Courier)
 * Strips non-ASCII characters that cause WinAnsi encoding corruption.
 */
function toPdfSafeText(str?: string | number | null): string {
  if (str === null || str === undefined) return '';
  const val = String(str);
  return val
    .replace(/[✓✔]/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/•/g, '|')
    .replace(/₹/g, 'INR ')
    .replace(/[^\x00-\x7F]/g, '')
    .trim();
}

/**
 * Formats ISO date strings to human-readable format: "24 Jul 2026 • 9:00 AM"
 */
export function formatPdfDateTime(dateInput: string | Date): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const day = d.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${day} ${month} ${year} • ${hours}:${minutesStr} ${ampm}`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats date to simple "24 Jul 2026"
 */
export function formatPdfDateOnly(dateInput: string | Date): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const day = d.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats amount in INR (₹) as "INR 18,500.00"
 */
export function formatInrCurrency(amount: number): string {
  try {
    const formattedNum = amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `INR ${formattedNum}`;
  } catch {
    return `INR ${amount.toFixed(2)}`;
  }
}

/**
 * Draws a clean vector checkmark icon in PDF canvas
 */
function drawVectorCheckBadge(doc: jsPDF, x: number, y: number) {
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.circle(x, y, 3, 'F');

  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.6);
  doc.line(x - 1.2, y, x - 0.2, y + 1.2);
  doc.line(x - 0.2, y + 1.2, x + 1.5, y - 1.2);
}

/**
 * Generates an SVG/Canvas based JourneyHub logo as base64 image for PDF header
 */
function createJourneyHubLogoDataUrl(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Dark Blue Pill Background
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.roundRect(0, 0, 320, 80, 16);
    ctx.fill();

    // Icon Circle (Sky Blue)
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(40, 40, 24, 0, Math.PI * 2);
    ctx.fill();

    // Compass / Airplane Symbol Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('JH', 26, 47);

    // Brand Name "JourneyHub"
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Journey', 78, 42);
    ctx.fillStyle = '#38bdf8'; // Sky blue
    ctx.fillText('Hub', 184, 42);

    // Tagline / Subtitle
    ctx.fillStyle = '#bae6fd';
    ctx.font = '10px sans-serif';
    ctx.fillText('AI SMART TRAVEL AGENCY', 78, 60);
  }
  return canvas.toDataURL('image/png');
}

/**
 * Generates official JourneyHub Travel Agency Booking Receipt PDF
 */
export async function generateJourneyHubReceiptPDF(booking: Booking): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~210mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // ~180mm

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://journeyhub.app';
  const verificationUrl = `${originUrl}/verify/${booking.id}`;

  // 1. Generate QR Code containing booking details & verification URL
  const qrVerificationData = JSON.stringify({
    agency: 'JourneyHub Travel Agency',
    bookingId: booking.id,
    customerName: booking.customerName,
    destination: booking.destination,
    travelDate: booking.travelDate,
    status: booking.bookingStatus,
    verifyUrl: verificationUrl,
  });

  const qrDataUrl = await QRCode.toDataURL(qrVerificationData, {
    margin: 1,
    width: 250,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  });

  // 2. Render Top Header Banner (Dark Navy `#0f172a`)
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Add JourneyHub Logo
  const logoDataUrl = createJourneyHubLogoDataUrl();
  doc.addImage(logoDataUrl, 'PNG', margin, 6, 52, 13);

  // Document Right Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('BOOKING RECEIPT', pageWidth - margin, 15, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(186, 230, 253); // sky-200
  doc.text('JourneyHub AI Smart Travel Agency', pageWidth - margin, 21, { align: 'right' });

  doc.setTextColor(148, 163, 184);
  doc.text(`BOOKING ID: ${toPdfSafeText(booking.id)}`, pageWidth - margin, 27, { align: 'right' });
  doc.text(`DATE: ${formatPdfDateOnly(booking.createdAt)}`, pageWidth - margin, 32, { align: 'right' });

  // Accent Blue Divider Line
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 40, pageWidth, 2, 'F');

  let y = 50;

  // 3. Status Banner
  const isConfirmed = booking.bookingStatus === 'confirmed';
  if (isConfirmed) {
    doc.setFillColor(236, 253, 245); // emerald-50
    doc.setDrawColor(16, 185, 129); // emerald-500
    doc.roundedRect(margin, y, contentWidth, 14, 3, 3, 'FD');

    drawVectorCheckBadge(doc, margin + 6, y + 7);

    doc.setTextColor(6, 95, 70); // emerald-800
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('BOOKING CONFIRMED & PAYMENT SUCCESSFUL', margin + 12, y + 9.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(16, 185, 129);
    doc.text('GUARANTEED RESERVATION', pageWidth - margin - 6, y + 9.5, { align: 'right' });
  } else if (booking.bookingStatus === 'cancelled') {
    doc.setFillColor(254, 242, 242); // red-50
    doc.setDrawColor(239, 68, 68); // red-500
    doc.roundedRect(margin, y, contentWidth, 14, 3, 3, 'FD');

    doc.setTextColor(153, 27, 27);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('BOOKING CANCELLED', margin + 6, y + 9.5);
  } else {
    doc.setFillColor(254, 243, 199); // amber-50
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(margin, y, contentWidth, 14, 3, 3, 'FD');

    doc.setTextColor(146, 64, 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('STATUS: PENDING CONFIRMATION', margin + 6, y + 9.5);
  }

  y += 22;

  // 4. Main Package Summary Box + QR Code
  const leftWidth = 122;
  const rightX = margin + leftWidth + 5;

  // Package Info Box (Left)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, leftWidth, 54, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(toPdfSafeText(booking.packageName), margin + 5, y + 10);

  // Destination Tag
  doc.setFillColor(30, 58, 138); // navy
  doc.roundedRect(margin + 5, y + 14, 45, 6, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(toPdfSafeText(booking.destination), margin + 8, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Hotel / Stay: ${toPdfSafeText(booking.hotel)}`, margin + 5, y + 26);
  doc.text(`Transport: ${toPdfSafeText(booking.transport)}`, margin + 5, y + 32);
  doc.text(`Pickup Point: ${toPdfSafeText(booking.pickupLocation)}`, margin + 5, y + 38);
  doc.text(`Drop Location: ${toPdfSafeText(booking.dropLocation)}`, margin + 5, y + 44);
  doc.text(`Travellers: ${booking.adults} Adults, ${booking.children} Children`, margin + 5, y + 50);

  // QR Code Box (Right)
  const qrBoxWidth = contentWidth - leftWidth - 5;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightX, y, qrBoxWidth, 54, 3, 3, 'FD');

  doc.addImage(qrDataUrl, 'PNG', rightX + (qrBoxWidth - 36) / 2, y + 4, 36, 36);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('SCAN TO VERIFY BOOKING', rightX + qrBoxWidth / 2, y + 44, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('JourneyHub Digital Verification', rightX + qrBoxWidth / 2, y + 48, { align: 'center' });

  y += 62;

  // 5. Customer & Travel Itinerary Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('CUSTOMER & ITINERARY DETAILS', margin, y);

  doc.setLineWidth(0.3);
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y + 2, margin + contentWidth, y + 2);

  y += 8;

  // Two Column Table Layout
  const col1X = margin;
  const col2X = margin + 95;

  const detailRows = [
    { label: 'Customer Name:', value: toPdfSafeText(booking.customerName) },
    { label: 'Customer Email:', value: toPdfSafeText(booking.customerEmail) },
    { label: 'Customer Phone:', value: toPdfSafeText(booking.customerPhone) },
    { label: 'Special Requests:', value: toPdfSafeText(booking.specialRequests || 'None specified') },
    { label: 'Travel Start Date:', value: formatPdfDateOnly(booking.travelDate) },
    { label: 'Return Date:', value: formatPdfDateOnly(booking.returnDate) },
    { label: 'Payment Method:', value: toPdfSafeText(booking.paymentMethod || 'Online UPI / Card') },
    { label: 'Transaction Reference:', value: toPdfSafeText(booking.paymentId || 'PAY-REF-889102') },
  ];

  detailRows.forEach((row, idx) => {
    const isRightCol = idx >= 4;
    const rowX = isRightCol ? col2X : col1X;
    const rowY = y + (idx % 4) * 11;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(rowX, rowY, 80, 9, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(row.label, rowX + 3, rowY + 3.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(row.value, rowX + 3, rowY + 7.5);
  });

  y += 50;

  // 6. Financial Breakdown Box (In Indian Rupees ₹)
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('PAYMENT & FINANCIAL BREAKDOWN', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Base Tour Package Amount: ${formatInrCurrency(booking.amountPaidInr)}`, margin + 5, y + 12);
  doc.text(`Goods & Services Tax (GST 18%): ${formatInrCurrency(booking.gstInr)}`, margin + 5, y + 17);
  doc.text(`Promo Offer Discount Applied: - ${formatInrCurrency(booking.discountInr)}`, margin + 5, y + 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('GRAND TOTAL PAID', margin + contentWidth - 5, y + 8, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text(formatInrCurrency(booking.grandTotalInr), margin + contentWidth - 5, y + 18, { align: 'right' });

  y += 34;

  // 7. Terms & Conditions Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('TERMS & CONDITIONS', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('1. Please carry a valid Government ID proof (Aadhaar / Passport) during travel and hotel check-in.', margin, y + 4);
  doc.text('2. Hotel check-in time is 12:00 PM and check-out is 10:00 AM unless early check-in is pre-arranged.', margin, y + 8);
  doc.text('3. Free cancellation up to 48 hours prior to travel date. Contact support@journeyhub.com for changes.', margin, y + 12);

  y += 20;

  // 8. Signatures Box
  const sigWidth = (contentWidth - 10) / 2;

  // Customer Signature
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, sigWidth, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Customer Signature:', margin + 4, y + 6);

  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(30, 58, 138);
  doc.text(toPdfSafeText(booking.customerName), margin + 8, y + 17);

  doc.setDrawColor(148, 163, 184);
  doc.line(margin + 4, y + 20, margin + sigWidth - 4, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Verified On: ${formatPdfDateOnly(booking.createdAt)}`, margin + 4, y + 24);

  // JourneyHub Authorized Signature
  const authSigX = margin + sigWidth + 10;
  doc.roundedRect(authSigX, y, sigWidth, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('JourneyHub Authorized Signature:', authSigX + 4, y + 6);

  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(30, 58, 138);
  doc.text('JourneyHub Travel Desk', authSigX + 8, y + 17);

  doc.line(authSigX + 4, y + 20, authSigX + sigWidth - 4, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Issued On: ${formatPdfDateOnly(new Date())}`, authSigX + 4, y + 24);

  // 9. Thank You Message Footer
  const footerY = 282;

  doc.setFillColor(238, 242, 255); // indigo-50
  doc.rect(0, footerY - 7, pageWidth, 16, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138);
  doc.text(
    'Thank you for choosing JourneyHub. We wish you a safe and memorable journey.',
    pageWidth / 2,
    footerY - 1,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'JourneyHub Travel Agency | AI Smart Travel Platform | Support: support@journeyhub.com | www.journeyhub.com',
    pageWidth / 2,
    footerY + 4,
    { align: 'center' }
  );

  // 10. Save PDF with robust cross-browser & mobile handling
  const filename = `JourneyHub_Receipt_${toPdfSafeText(booking.id)}.pdf`;

  const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    try {
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      return;
    } catch (e) {
      console.warn('Mobile blob download fallback:', e);
    }
  }

  doc.save(filename);
}

export const generateJourneyHubInvoicePdf = generateJourneyHubReceiptPDF;
