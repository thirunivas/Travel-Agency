import React from 'react';
import { THEME_BACKGROUNDS, ThemeBackgroundKey } from '../data/themeBackgrounds';
import { Check, X, Palette, Sparkles, MapPin, Sun } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentThemeKey: ThemeBackgroundKey;
  onSelectTheme: (key: ThemeBackgroundKey) => void;
}

export const ThemeSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentThemeKey,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  const themesList = Object.values(THEME_BACKGROUNDS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Pleasant Theme Backgrounds</h3>
              <p className="text-[11px] text-slate-400">
                100% genuine natural photography & calm organic tones — zero AI wallpaper
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="px-6 py-3 bg-amber-50/70 dark:bg-slate-800/60 border-b border-amber-100 dark:border-slate-800 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Every theme uses authentic travel photography and soothing, natural daylight palettes designed for eye comfort.
          </span>
        </div>

        {/* Theme Cards List */}
        <div className="p-6 space-y-3 max-h-[65vh] overflow-y-auto">
          {themesList.map((theme) => {
            const isSelected = currentThemeKey === theme.key;

            return (
              <div
                key={theme.key}
                onClick={() => {
                  onSelectTheme(theme.key);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-md ring-2 ring-emerald-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/70 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-200 border border-slate-300 dark:border-slate-700 relative">
                    {theme.heroImageUrl ? (
                      <img
                        src={theme.heroImageUrl}
                        alt={theme.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center text-xl">
                        🕊️
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-base">{theme.icon}</span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {theme.name}
                      </h4>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {theme.tagline}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {theme.location}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTheme(theme.key);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <span>Apply Theme</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-700 text-xs font-bold hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
