import React, { useState } from 'react';
import {
  Code,
  FileCode,
  Database,
  Download,
  Copy,
  Check,
  Monitor,
  Terminal,
  FileText,
  Layers,
  Sparkles,
  QrCode,
  Printer,
  X,
  Play,
  CheckCircle2,
  Package,
  Users,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  FolderTree,
} from 'lucide-react';
import { JAVA_DESKTOP_FILES, JavaFile } from '../data/javaProjectSource';
import { Booking } from '../types';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface JavaDesktopWorkbenchProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
}

export const JavaDesktopWorkbench: React.FC<JavaDesktopWorkbenchProps> = ({
  isOpen,
  onClose,
  bookings,
}) => {
  const [activeTab, setActiveTab] = useState<'emulator' | 'code' | 'db_schema' | 'pdf_preview'>('emulator');
  const [selectedFile, setSelectedFile] = useState<JavaFile>(JAVA_DESKTOP_FILES[0]);
  const [copiedFile, setCopiedFile] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [generatingPdf, setGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  const sampleBooking = bookings[0] || {
    id: 'BK-2026-9041',
    customerName: 'Thiru Nivas',
    customerEmail: 'thirunivas418@gmail.com',
    customerPhone: '+91 98765 43210',
    packageName: 'Kashmir Paradise & Gulmarg Snow Escape',
    destination: 'Srinagar, Gulmarg & Pahalgam',
    travelDate: '2026-10-15',
    returnDate: '2026-10-21',
    adults: 2,
    children: 0,
    pickupLocation: 'Srinagar International Airport (SXR)',
    dropLocation: 'Srinagar International Airport (SXR)',
    totalAmountInr: 57000,
    gstInr: 2850,
    discountInr: 2850,
    grandTotalInr: 57000,
    paymentMethod: 'UPI (GPay / PhonePe / Paytm)',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    createdAt: '2026-07-20T10:30:00.000Z',
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleDownloadFile = (file: JavaFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateInteractivePdfReceipt = async () => {
    setGeneratingPdf(true);
    try {
      const qrText = `JOURNEYHUB|ID:${sampleBooking.id}|NAME:${sampleBooking.customerName}|DEST:${sampleBooking.destination}|STATUS:${sampleBooking.bookingStatus}`;
      const qrCodeUrl = await QRCode.toDataURL(qrText, { margin: 1, width: 120 });
      setQrDataUrl(qrCodeUrl);

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header Banner
      doc.setFillColor(29, 78, 216); // #1d4ed8
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('JOURNEYHUB', 14, 16);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('AI Smart Travel Agency Management System', 14, 22);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('BOOKING RECEIPT', 196, 16, { align: 'right' });
      doc.setFontSize(9);
      doc.text(`ID: ${sampleBooking.id}`, 196, 22, { align: 'right' });

      // Customer Info Box
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(14, 38, 88, 38, 3, 3, 'F');
      doc.setTextColor(29, 78, 216);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('CUSTOMER DETAILS', 18, 45);

      doc.setTextColor(31, 41, 55);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${sampleBooking.customerName}`, 18, 52);
      doc.text(`Email: ${sampleBooking.customerEmail}`, 18, 58);
      doc.text(`Phone: ${sampleBooking.customerPhone}`, 18, 64);
      doc.text(`Passengers: ${sampleBooking.adults} Adults, ${sampleBooking.children || 0} Children`, 18, 70);

      // Travel Info Box
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(108, 38, 88, 38, 3, 3, 'F');
      doc.setTextColor(29, 78, 216);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('TRIP DETAILS', 112, 45);

      doc.setTextColor(31, 41, 55);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Package: ${sampleBooking.packageName.substring(0, 32)}...`, 112, 52);
      doc.text(`Destination: ${sampleBooking.destination}`, 112, 58);
      doc.text(`Travel Date: ${sampleBooking.travelDate}`, 112, 64);
      doc.text(`Pickup: ${sampleBooking.pickupLocation.substring(0, 30)}`, 112, 70);

      // Cost Table
      let y = 85;
      doc.setFillColor(29, 78, 216);
      doc.rect(14, y, 182, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Description', 18, y + 5.5);
      doc.text('Units', 120, y + 5.5);
      doc.text('Amount (INR)', 190, y + 5.5, { align: 'right' });

      y += 8;
      doc.setTextColor(31, 41, 55);
      doc.setFont('helvetica', 'normal');
      
      // Row 1
      doc.text(sampleBooking.packageName, 18, y + 6);
      doc.text(`${sampleBooking.adults} Persons`, 120, y + 6);
      doc.text(`₹${sampleBooking.totalAmountInr.toLocaleString('en-IN')}`, 190, y + 6, { align: 'right' });

      y += 10;
      doc.text('GST & Taxes (5%)', 18, y + 6);
      doc.text('Standard', 120, y + 6);
      doc.text(`₹${(sampleBooking.gstInr || 2850).toLocaleString('en-IN')}`, 190, y + 6, { align: 'right' });

      y += 10;
      doc.text('Promotional Voucher Discount', 18, y + 6);
      doc.text('Applied', 120, y + 6);
      doc.text(`- ₹${(sampleBooking.discountInr || 2850).toLocaleString('en-IN')}`, 190, y + 6, { align: 'right' });

      // Total Line
      y += 12;
      doc.setLineWidth(0.5);
      doc.setDrawColor(209, 213, 219);
      doc.line(14, y, 196, y);

      y += 6;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('GRAND TOTAL', 18, y);
      doc.text(`₹${sampleBooking.grandTotalInr.toLocaleString('en-IN')}`, 190, y, { align: 'right' });

      // QR Code and Signatures
      y += 15;
      doc.addImage(qrCodeUrl, 'PNG', 14, y, 32, 32);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(29, 78, 216);
      doc.text('SCAN TO VERIFY', 50, y + 8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text(`Status: ${sampleBooking.bookingStatus.toUpperCase()}`, 50, y + 14);
      doc.text(`Payment: ${sampleBooking.paymentMethod}`, 50, y + 20);

      doc.text('_____________________________', 130, y + 20);
      doc.text('Authorized Signature (JourneyHub)', 130, y + 25);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text('Thank you for choosing JourneyHub. Have a safe and memorable journey!', 105, 280, { align: 'right' });

      doc.save(`JourneyHub_Receipt_${sampleBooking.id}.pdf`);
    } catch (err) {
      console.error('PDF Generation failed:', err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const filteredFiles = JAVA_DESKTOP_FILES.filter(
    (f) =>
      f.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.path.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 rounded-2xl w-full max-w-7xl h-[92vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden">
        
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  JOURNEYHUB — Java Desktop Application Workbench
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Java 17 + JavaFX + MySQL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore Scene Builder FXML, iText PDF Generator, ZXing QR Code, MySQL Schema, and Source Code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                JAVA_DESKTOP_FILES.forEach((f) => handleDownloadFile(f));
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-sm"
              title="Download all Java source files & MySQL SQL script"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download All Source Files</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WORKBENCH NAV TABS */}
        <div className="flex items-center justify-between px-5 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('emulator')}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition ${
                activeTab === 'emulator'
                  ? 'border-blue-500 text-blue-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>JavaFX App Emulator</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition ${
                activeTab === 'code'
                  ? 'border-blue-500 text-blue-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Java 17 Source Code ({JAVA_DESKTOP_FILES.length} Files)</span>
            </button>

            <button
              onClick={() => setActiveTab('db_schema')}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition ${
                activeTab === 'db_schema'
                  ? 'border-blue-500 text-blue-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>MySQL Script (JourneyHubDatabase.sql)</span>
            </button>

            <button
              onClick={() => setActiveTab('pdf_preview')}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition ${
                activeTab === 'pdf_preview'
                  ? 'border-blue-500 text-blue-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>iText PDF & ZXing QR Generator</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>MySQL 8.0 Connected</span>
          </div>
        </div>

        {/* WORKBENCH CONTENT AREA */}
        <div className="flex-1 overflow-hidden bg-slate-950">
          
          {/* TAB 1: JAVAFX DESKTOP APP EMULATOR */}
          {activeTab === 'emulator' && (
            <div className="h-full flex flex-col p-4 overflow-y-auto">
              {/* Simulated Window Frame */}
              <div className="bg-slate-100 text-slate-900 rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col min-h-[620px]">
                
                {/* Title Bar */}
                <div className="bg-slate-800 text-slate-200 px-4 py-2 flex items-center justify-between text-xs border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    </div>
                    <span className="font-semibold text-slate-300 ml-2">
                      JourneyHub - AI Smart Travel Agency Management System (JavaFX Stage)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">JDK 17.0.2 | JavaFX 19.0.2</span>
                </div>

                {/* JavaFX App Inner Layout */}
                <div className="flex-1 flex overflow-hidden">
                  
                  {/* Left JavaFX Sidebar */}
                  <div className="w-60 bg-slate-900 text-slate-200 p-4 flex flex-col justify-between border-r border-slate-800">
                    <div>
                      <div className="mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                            JH
                          </div>
                          <span className="text-base font-bold text-blue-400 tracking-wide">JOURNEYHUB</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Travel Agency System (MVC)</p>
                      </div>

                      <div className="space-y-1">
                        <div className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm">
                          <Layers className="w-4 h-4" />
                          <span>Dashboard Overview</span>
                        </div>
                        <div className="px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 text-xs font-medium flex items-center gap-2 cursor-pointer">
                          <Users className="w-4 h-4" />
                          <span>Customer Directory</span>
                        </div>
                        <div className="px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 text-xs font-medium flex items-center gap-2 cursor-pointer">
                          <Package className="w-4 h-4" />
                          <span>Tour Packages</span>
                        </div>
                        <div className="px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 text-xs font-medium flex items-center gap-2 cursor-pointer">
                          <FileText className="w-4 h-4" />
                          <span>Bookings & Receipts</span>
                        </div>
                        <div className="px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 text-xs font-medium flex items-center gap-2 cursor-pointer">
                          <QrCode className="w-4 h-4" />
                          <span>QR Ticket Scanner</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
                      <p className="font-semibold text-slate-300">Administrator Active</p>
                      <p className="truncate text-slate-400">thirunivas418@gmail.com</p>
                    </div>
                  </div>

                  {/* Main JavaFX Content Stage */}
                  <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Executive Dashboard</h3>
                        <p className="text-xs text-slate-500">
                          Connected to MySQL localhost:3306/journeyhub_db via JDBC Driver
                        </p>
                      </div>
                      <button
                        onClick={generateInteractivePdfReceipt}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Test iText PDF Generation</span>
                      </button>
                    </div>

                    {/* KPI Cards Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <span className="text-xs font-semibold text-slate-500">Total Bookings</span>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{bookings.length}</p>
                        <span className="text-[10px] text-emerald-600 font-medium">+12% this week</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <span className="text-xs font-semibold text-slate-500">Revenue (INR)</span>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                          ₹
                          {bookings
                            .reduce((sum, b) => sum + (b.grandTotalInr || 0), 0)
                            .toLocaleString('en-IN')}
                        </p>
                        <span className="text-[10px] text-blue-600 font-medium">100% Paid via UPI/Cards</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <span className="text-xs font-semibold text-slate-500">Registered Customers</span>
                        <p className="text-2xl font-bold text-slate-900 mt-1">1,240</p>
                        <span className="text-[10px] text-emerald-600 font-medium">Email Verified</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <span className="text-xs font-semibold text-slate-500">Active Packages</span>
                        <p className="text-2xl font-bold text-slate-900 mt-1">18</p>
                        <span className="text-[10px] text-slate-400 font-medium">In Jammu & Kashmir, Kerala, etc.</span>
                      </div>
                    </div>

                    {/* JavaFX TableView Simulation */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-slate-800">
                          Recent Confirmed Bookings (TableView - BookingDAO.java)
                        </h4>
                        <span className="text-xs text-slate-500 font-medium">Auto-synced with MySQL</span>
                      </div>

                      <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                              <th className="p-3">Booking ID</th>
                              <th className="p-3">Customer</th>
                              <th className="p-3">Package</th>
                              <th className="p-3">Travel Date</th>
                              <th className="p-3">Total (₹)</th>
                              <th className="p-3">Payment</th>
                              <th className="p-3 text-right">PDF Receipt</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {bookings.map((b) => (
                              <tr key={b.id} className="hover:bg-slate-50 transition">
                                <td className="p-3 font-mono font-bold text-blue-600">{b.id}</td>
                                <td className="p-3">
                                  <div className="font-semibold text-slate-900">{b.customerName}</div>
                                  <div className="text-[11px] text-slate-500">{b.customerEmail}</div>
                                </td>
                                <td className="p-3 max-w-[220px] truncate">{b.packageName}</td>
                                <td className="p-3 whitespace-nowrap">{b.travelDate}</td>
                                <td className="p-3 font-bold text-slate-900">
                                  ₹{b.grandTotalInr.toLocaleString('en-IN')}
                                </td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                    {b.paymentStatus.toUpperCase()} ({b.paymentMethod || 'UPI'})
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={generateInteractivePdfReceipt}
                                    className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium rounded transition inline-flex items-center gap-1"
                                  >
                                    <FileText className="w-3 h-3" />
                                    <span>Download PDF</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JAVA SOURCE CODE EXPLORER */}
          {activeTab === 'code' && (
            <div className="h-full flex overflow-hidden">
              {/* Left File Tree Sidebar */}
              <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-3 border-b border-slate-800">
                  <input
                    type="text"
                    placeholder="Search Java files, FXML, SQL..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderTree className="w-3.5 h-3.5 text-blue-400" />
                    <span>Project File Structure</span>
                  </div>

                  {filteredFiles.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between group ${
                        selectedFile.path === file.path
                          ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-blue-400" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-500">
                        {file.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Code View & Copy */}
              <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
                <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-blue-400 flex items-center gap-2">
                      <span>{selectedFile.path}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(selectedFile.content)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      {copiedFile ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDownloadFile(selectedFile)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 bg-slate-950 leading-relaxed">
                  <pre className="whitespace-pre-wrap">{selectedFile.content}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MYSQL DATABASE SCRIPT */}
          {activeTab === 'db_schema' && (
            <div className="h-full flex flex-col p-4 bg-slate-950 overflow-y-auto">
              {JAVA_DESKTOP_FILES.find((f) => f.name === 'JourneyHubDatabase.sql') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald-400" />
                        <span>JourneyHub MySQL 8.0 Database Production Schema Script</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Contains tables for Admin, Customers, Packages, Bookings, Payments, Reviews, Notifications, and Sample Data
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleDownloadFile(
                          JAVA_DESKTOP_FILES.find((f) => f.name === 'JourneyHubDatabase.sql')!
                        )
                      }
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download JourneyHubDatabase.sql</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
                    <pre>
                      {JAVA_DESKTOP_FILES.find((f) => f.name === 'JourneyHubDatabase.sql')?.content}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ITEXT PDF & ZXING QR CODE GENERATOR PREVIEW */}
          {activeTab === 'pdf_preview' && (
            <div className="h-full p-6 overflow-y-auto bg-slate-950">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        iText 7 PDF & ZXing QR Engine Verification
                      </h3>
                      <p className="text-xs text-slate-400">
                        Generates official JourneyHub travel receipts with Indian Rupee (₹) formatting, tax breakdown, and QR code
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">Receipt Details to Generate</h4>
                      <div className="space-y-1.5 text-slate-300">
                        <p><span className="text-slate-500">Booking ID:</span> {sampleBooking.id}</p>
                        <p><span className="text-slate-500">Customer:</span> {sampleBooking.customerName} ({sampleBooking.customerEmail})</p>
                        <p><span className="text-slate-500">Package:</span> {sampleBooking.packageName}</p>
                        <p><span className="text-slate-500">Travel Date:</span> {sampleBooking.travelDate}</p>
                        <p><span className="text-slate-500">Grand Total:</span> ₹{sampleBooking.grandTotalInr.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center border-l border-slate-800 pl-6">
                      {qrDataUrl ? (
                        <div className="text-center">
                          <img src={qrDataUrl} alt="QR Code" className="w-28 h-28 bg-white p-2 rounded-lg border border-slate-300 mx-auto mb-2" />
                          <span className="text-[10px] text-emerald-400 font-mono">ZXing Matrix QR Code Ready</span>
                        </div>
                      ) : (
                        <div className="text-center text-slate-500">
                          <QrCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Click button below to generate QR Code & PDF</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={generateInteractivePdfReceipt}
                      disabled={generatingPdf}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition"
                    >
                      {generatingPdf ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Printer className="w-4 h-4" />
                      )}
                      <span>{generatingPdf ? 'Generating PDF...' : 'Download iText PDF Receipt Now'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
