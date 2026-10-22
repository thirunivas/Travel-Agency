import React, { useState } from 'react';
import { X, Check, ShieldCheck, User } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  serviceType: 'bus' | 'train' | 'flight';
  passengerCount: number;
  baseFareInr: number;
  onConfirmSeats: (seats: string[], totalFareInr: number) => void;
}

export const SeatSelectionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  serviceTitle,
  serviceType,
  passengerCount,
  baseFareInr,
  onConfirmSeats,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  if (!isOpen) return null;

  // Generate realistic seat grids based on service type
  const isBus = serviceType === 'bus';
  const isTrain = serviceType === 'train';
  const isFlight = serviceType === 'flight';

  const bookedSeatsPreset = ['3', '7', '8', '14', '15', '22', '23', '27', 'B2', 'B4', '12A', '12B', '14C'];
  const ladiesSeatsPreset = ['1', '2', '5', '6', 'L1', 'L2'];

  const toggleSeat = (seatId: string) => {
    if (bookedSeatsPreset.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= passengerCount) {
        // Replace first if count exceeded
        setSelectedSeats([...selectedSeats.slice(1), seatId]);
      } else {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      alert(`Please select ${passengerCount} seat(s) to continue.`);
      return;
    }
    const total = baseFareInr * selectedSeats.length;
    onConfirmSeats(selectedSeats, total);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#12304A] text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <span>Select Your Seat(s)</span>
              <span className="text-xs font-normal text-[#56C7EA]">({serviceType.toUpperCase()})</span>
            </h3>
            <p className="text-xs text-slate-300 truncate max-w-md">{serviceTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="px-6 py-3 bg-[#F4F8FB] dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded border-2 border-slate-300 bg-white inline-block" /> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#087EAB] text-white inline-flex items-center justify-center text-[10px] font-bold">✓</span> Selected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-slate-300 dark:bg-slate-700 inline-block" /> Booked
            </span>
            {isBus && (
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded border-2 border-pink-300 bg-pink-50 inline-block" /> Ladies
              </span>
            )}
          </div>
          <span className="text-[#087EAB] font-bold">
            Select {passengerCount} seat(s) ({selectedSeats.length}/{passengerCount})
          </span>
        </div>

        {/* Interactive Grid Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/40">
          {/* BUS LAYOUT */}
          {isBus && (
            <div className="max-w-xs mx-auto bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              {/* Driver Cabin */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-400">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Front Entrance</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  🚗 Driver
                </span>
              </div>

              {/* Rows (2x2 seating layout) */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7].map((rowIdx) => {
                  const seatL1 = `${(rowIdx - 1) * 4 + 1}`;
                  const seatL2 = `${(rowIdx - 1) * 4 + 2}`;
                  const seatR1 = `${(rowIdx - 1) * 4 + 3}`;
                  const seatR2 = `${(rowIdx - 1) * 4 + 4}`;

                  const renderBtn = (id: string, label: string) => {
                    const isBooked = bookedSeatsPreset.includes(id);
                    const isLadies = ladiesSeatsPreset.includes(id);
                    const isSelected = selectedSeats.includes(id);

                    return (
                      <button
                        key={id}
                        disabled={isBooked}
                        onClick={() => toggleSeat(id)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          isBooked
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#087EAB] text-white shadow-md scale-105 ring-2 ring-[#087EAB]/40'
                            : isLadies
                            ? 'bg-pink-50 border-2 border-pink-300 text-pink-700 hover:bg-pink-100'
                            : 'bg-white dark:bg-slate-700/80 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-[#087EAB]'
                        }`}
                        title={isBooked ? 'Already Booked' : `Seat ${label}`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : label}
                      </button>
                    );
                  };

                  return (
                    <div key={rowIdx} className="flex items-center justify-between">
                      {/* Left Pair */}
                      <div className="flex gap-2">
                        {renderBtn(seatL1, seatL1)}
                        {renderBtn(seatL2, seatL2)}
                      </div>
                      {/* Aisle */}
                      <span className="text-[10px] text-slate-300 font-mono">|</span>
                      {/* Right Pair */}
                      <div className="flex gap-2">
                        {renderBtn(seatR1, seatR1)}
                        {renderBtn(seatR2, seatR2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center text-[10px] text-slate-400">
                Rear Back Row • High Comfort Recliners
              </div>
            </div>
          )}

          {/* TRAIN LAYOUT */}
          {isTrain && (
            <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">Coach B3 • 3-Tier AC Berth Layout</span>
                <span className="text-slate-400">Window & Aisle Berths</span>
              </div>

              <div className="space-y-3">
                {[
                  { id: '1-LB', name: '1 (Lower Berth)' },
                  { id: '2-MB', name: '2 (Middle Berth)' },
                  { id: '3-UB', name: '3 (Upper Berth)' },
                  { id: '4-SL', name: '4 (Side Lower - Window)' },
                  { id: '5-SU', name: '5 (Side Upper)' },
                  { id: '6-LB', name: '6 (Lower Berth)' },
                  { id: '7-MB', name: '7 (Middle Berth)' },
                  { id: '8-UB', name: '8 (Upper Berth)' },
                ].map((b) => {
                  const isBooked = bookedSeatsPreset.includes(b.id);
                  const isSelected = selectedSeats.includes(b.id);

                  return (
                    <div
                      key={b.id}
                      onClick={() => !isBooked && toggleSeat(b.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isBooked
                          ? 'bg-slate-100 dark:bg-slate-700/50 border-slate-200 text-slate-400 cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#087EAB]/10 border-[#087EAB] text-[#087EAB] font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-[#087EAB] text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                          isSelected ? 'bg-[#087EAB] text-white' : 'bg-slate-200 dark:bg-slate-700'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </span>
                        <span className="text-xs font-semibold">{b.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {isBooked ? 'Booked' : `₹${baseFareInr}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FLIGHT LAYOUT */}
          {isFlight && (
            <div className="max-w-sm mx-auto bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">Airbus A320neo • 3x3 Cabin</span>
                <span className="text-slate-400">Rows 10 - 15</span>
              </div>

              <div className="space-y-3">
                {['10', '11', '12', '14', '15'].map((row) => (
                  <div key={row} className="flex items-center justify-between">
                    {/* Left 3 (A, B, C) */}
                    <div className="flex gap-1.5">
                      {['A', 'B', 'C'].map((col) => {
                        const seatId = `${row}${col}`;
                        const isBooked = bookedSeatsPreset.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        return (
                          <button
                            key={seatId}
                            disabled={isBooked}
                            onClick={() => toggleSeat(seatId)}
                            className={`w-9 h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                              isBooked
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                : isSelected
                                ? 'bg-[#087EAB] text-white ring-2 ring-[#087EAB]/50 shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-[#087EAB]'
                            }`}
                            title={`${seatId} (${col === 'A' ? 'Window' : col === 'C' ? 'Aisle' : 'Middle'})`}
                          >
                            {seatId}
                          </button>
                        );
                      })}
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">Row {row}</span>

                    {/* Right 3 (D, E, F) */}
                    <div className="flex gap-1.5">
                      {['D', 'E', 'F'].map((col) => {
                        const seatId = `${row}${col}`;
                        const isBooked = bookedSeatsPreset.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        return (
                          <button
                            key={seatId}
                            disabled={isBooked}
                            onClick={() => toggleSeat(seatId)}
                            className={`w-9 h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                              isBooked
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                : isSelected
                                ? 'bg-[#087EAB] text-white ring-2 ring-[#087EAB]/50 shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-[#087EAB]'
                            }`}
                            title={`${seatId} (${col === 'F' ? 'Window' : col === 'D' ? 'Aisle' : 'Middle'})`}
                          >
                            {seatId}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Selected Seats</span>
            <span className="text-sm font-bold text-[#12304A] dark:text-white">
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-[#087EAB] hover:bg-[#12304A] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span>Confirm Seats</span>
              <span>(₹{(baseFareInr * (selectedSeats.length || 1)).toLocaleString('en-IN')})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
