export type ThemeBackgroundKey =
  | 'golden-sunrise'
  | 'misty-hills'
  | 'royal-palace'
  | 'azure-coast'
  | 'serene-minimal';

export interface ThemeBackgroundConfig {
  key: ThemeBackgroundKey;
  name: string;
  tagline: string;
  location: string;
  icon: string;
  // Authentic real-world photograph URL (natural lighting, genuine Indian travel location)
  heroImageUrl: string;
  heroImageAlt: string;
  // Natural daylight light-mode background color
  bodyBgClass: string;
  // Ambient radial glow accents
  ambientPrimary: string;
  ambientSecondary: string;
  // Theme badge styling
  accentBadgeClass: string;
  accentBtnClass: string;
  primaryColor: string;
}

export const THEME_BACKGROUNDS: Record<ThemeBackgroundKey, ThemeBackgroundConfig> = {
  'golden-sunrise': {
    key: 'golden-sunrise',
    name: 'Kerala Backwaters',
    tagline: 'Sunlit Backwaters & Coconut Palms',
    location: 'Alleppey & Kumarakom, Kerala',
    icon: '🌴',
    // Genuine high-res photo of sunrise over peaceful Kerala backwaters with authentic traditional houseboat & palms
    heroImageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=2000',
    heroImageAlt: 'Authentic morning sunrise over tranquil Kerala backwaters with houseboats and palms',
    bodyBgClass: 'bg-[#F4F8FB] dark:bg-[#12304A]',
    ambientPrimary: 'from-[#087F65]/20 via-[#159B72]/10 to-transparent',
    ambientSecondary: 'from-[#FF9B54]/20 via-[#FFD166]/10 to-transparent',
    accentBadgeClass: 'bg-[#087F65] text-white border-emerald-400/30',
    accentBtnClass: 'bg-[#087EAB] hover:bg-[#12304A] text-white',
    primaryColor: '#087F65',
  },
  'misty-hills': {
    key: 'misty-hills',
    name: 'Misty Nilgiris',
    tagline: 'Emerald Tea Valleys & Mountain Air',
    location: 'Munnar & Ooty, South India',
    icon: '🍃',
    // Genuine high-res photo of sunlit green rolling tea plantations under morning mist
    heroImageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=2000',
    heroImageAlt: 'Lush green tea plantation hills in Munnar under soft morning clouds and sunlight',
    bodyBgClass: 'bg-[#F4F8FB] dark:bg-[#12304A]',
    ambientPrimary: 'from-[#159B72]/20 via-[#087F65]/10 to-transparent',
    ambientSecondary: 'from-[#56C7EA]/20 via-[#087EAB]/10 to-transparent',
    accentBadgeClass: 'bg-[#159B72] text-white border-emerald-400/30',
    accentBtnClass: 'bg-[#159B72] hover:bg-[#087F65] text-white',
    primaryColor: '#159B72',
  },
  'royal-palace': {
    key: 'royal-palace',
    name: 'Royal Heritage',
    tagline: 'Lake Pichola & Golden Sandstone',
    location: 'Udaipur, Rajasthan & Madurai',
    icon: '🏰',
    // Genuine high-res photo of Udaipur City Palace on Lake Pichola in Rajasthan during warm golden sunset
    heroImageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=2000',
    heroImageAlt: 'City Palace Udaipur standing serenely on Lake Pichola in Rajasthan during sunset',
    bodyBgClass: 'bg-[#FFF5E8] dark:bg-[#12304A]',
    ambientPrimary: 'from-[#FF9B54]/25 via-[#FFD166]/15 to-transparent',
    ambientSecondary: 'from-[#087EAB]/15 via-transparent to-transparent',
    accentBadgeClass: 'bg-[#FF9B54] text-slate-900 border-amber-300/40 font-bold',
    accentBtnClass: 'bg-[#FF9B54] hover:bg-[#FF7165] text-slate-900 font-bold',
    primaryColor: '#FF9B54',
  },
  'azure-coast': {
    key: 'azure-coast',
    name: 'Azure Coastline',
    tagline: 'Warm Sands & Tropical Blue Waters',
    location: 'Goa Beaches & Kanyakumari Shores',
    icon: '🌊',
    // Genuine high-res photo of peaceful sunny beach, turquoise clear water, and natural coconut palms
    heroImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000',
    heroImageAlt: 'Natural tropical sandy beach with turquoise sea and leaning palm trees under sunshine',
    bodyBgClass: 'bg-[#F4F8FB] dark:bg-[#12304A]',
    ambientPrimary: 'from-[#56C7EA]/25 via-[#087EAB]/15 to-transparent',
    ambientSecondary: 'from-[#159B72]/15 via-transparent to-transparent',
    accentBadgeClass: 'bg-[#087EAB] text-white border-sky-300/40',
    accentBtnClass: 'bg-[#087EAB] hover:bg-[#12304A] text-white',
    primaryColor: '#087EAB',
  },
  'serene-minimal': {
    key: 'serene-minimal',
    name: 'Serene Minimal',
    tagline: 'Soft Sand Texture & Sunlit Calm',
    location: 'Pure Minimalist Travel Design',
    icon: '🕊️',
    heroImageUrl: '',
    heroImageAlt: 'Gentle warm sunlight and minimalist aesthetic without photo wallpaper',
    bodyBgClass: 'bg-[#F4F8FB] dark:bg-[#12304A]',
    ambientPrimary: 'from-[#FFF5E8]/60 via-[#F4F8FB] to-transparent',
    ambientSecondary: 'from-[#56C7EA]/10 via-transparent to-transparent',
    accentBadgeClass: 'bg-[#12304A] text-white border-slate-700',
    accentBtnClass: 'bg-[#087EAB] hover:bg-[#12304A] text-white',
    primaryColor: '#12304A',
  },
};
