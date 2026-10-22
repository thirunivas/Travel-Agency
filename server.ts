import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10) || 3000;

  app.use(express.json());

  // Verification email store
  let emailVerificationCodes: Record<string, string> = {};
  let verifiedEmails: Set<string> = new Set(['thirunivas418@gmail.com']);

  // Initial Packages Store
  let packagesStore = [
    {
      id: 'pkg-kashmir-01',
      name: 'Kashmir Paradise & Gulmarg Snow Escape',
      destination: 'Srinagar, Gulmarg & Pahalgam',
      state: 'Jammu & Kashmir',
      country: 'India',
      duration: '6 Days / 5 Nights',
      hotel: '5-Star Luxury Houseboat & Mountain Resort',
      transport: 'Private AC Innova Crysta & Shikara Rides',
      mealsIncluded: 'Breakfast & Gourmet Dinner Included',
      priceInr: 28500,
      availableSeats: 18,
      category: 'Honeymoon',
      featured: true,
      rating: 4.9,
      reviewsCount: 142,
      galleryImages: [
        'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&q=80&w=1000',
      ],
      description: 'Experience heaven on earth in Kashmir. Glide across peaceful Dal Lake in a traditional Shikara, stay in premium houseboats.',
    },
    {
      id: 'pkg-kerala-02',
      name: 'Kerala Backwaters & Munnar Hills Experience',
      destination: 'Munnar, Alleppey & Thekkady',
      state: 'Kerala',
      country: 'India',
      duration: '5 Days / 4 Nights',
      hotel: 'Premium Tree House & Private Houseboat',
      transport: 'AC Private SUV with Driver',
      mealsIncluded: 'All Meals & Traditional Kerala Feast Included',
      priceInr: 22499,
      availableSeats: 24,
      category: 'Family',
      featured: true,
      rating: 4.8,
      reviewsCount: 98,
      galleryImages: [
        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1000',
      ],
      description: 'Unwind in God’s Own Country with tea plantations in Munnar, elephant sanctuary in Thekkady, and private houseboat cruises in Alleppey.',
    },
    {
      id: 'pkg-rajasthan-03',
      name: 'Royal Rajasthan Forts & Thar Desert Safari',
      destination: 'Jaipur, Jodhpur, Udaipur & Jaisalmer',
      state: 'Rajasthan',
      country: 'India',
      duration: '7 Days / 6 Nights',
      hotel: 'Heritage Palace Hotel & Luxury Desert Camp',
      transport: 'AC Coach & Camel Safari Included',
      mealsIncluded: 'Breakfast & Royal Rajasthani Buffet',
      priceInr: 34999,
      availableSeats: 12,
      category: 'Adventure',
      featured: true,
      rating: 4.9,
      reviewsCount: 115,
      galleryImages: [
        'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1000',
      ],
      description: 'Step into the land of Kings. Explore grand palaces in Udaipur, pink city of Jaipur, blue city of Jodhpur, and starlit Thar desert camping.',
    },
    {
      id: 'pkg-ladakh-04',
      name: 'Leh Ladakh Himalayan High Passes Expedition',
      destination: 'Leh, Nubra Valley & Pangong Tso Lake',
      state: 'Ladakh',
      country: 'India',
      duration: '7 Days / 6 Nights',
      hotel: 'Boutique Eco Resort & Pangong Luxury Camps',
      transport: '4x4 SUV / Royal Enfield Bikes Available',
      mealsIncluded: 'All Meals (Breakfast, Lunch & Dinner)',
      priceInr: 31999,
      availableSeats: 15,
      category: 'Adventure',
      featured: true,
      rating: 4.95,
      reviewsCount: 180,
      galleryImages: [
        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80&w=1000',
      ],
      description: 'Embark on an unforgettable journey across Khardung La pass, double-humped camel rides in Nubra, and cobalt blue waters of Pangong Lake.',
    },
  ];

  // Initial Bookings Store
  let bookingsStore = [
    {
      id: 'BK-2026-9041',
      packageId: 'pkg-kashmir-01',
      packageName: 'Kashmir Paradise & Gulmarg Snow Escape',
      customerName: 'Thiru Nivas',
      customerEmail: 'thirunivas418@gmail.com',
      customerPhone: '+91 98765 43210',
      travelersCount: 2,
      travelDate: '2026-10-15',
      totalAmountInr: 57000,
      paymentMethod: 'UPI (GPay / PhonePe / Paytm)',
      paymentStatus: 'Paid',
      bookingStatus: 'Confirmed',
      createdAt: '2026-07-20T10:30:00.000Z',
    },
  ];

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      app: 'JourneyHub Travel Agency Management System',
      tagline: 'Explore More. Travel Better.',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API: User Login (/api/login)
  app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body || {};

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const isAdmin = email.toLowerCase() === 'thirunivas418@gmail.com' || role === 'admin';
    const userRole = isAdmin ? 'admin' : 'customer';

    return res.json({
      success: true,
      token: `jh-auth-token-${Date.now()}`,
      user: {
        id: isAdmin ? 'usr-admin-001' : `usr-${Date.now()}`,
        name: isAdmin ? 'Administrator' : email.split('@')[0],
        email: email.toLowerCase(),
        phone: '+91 98765 43210',
        role: userRole,
        isEmailVerified: verifiedEmails.has(email.toLowerCase()),
        createdAt: new Date().toISOString(),
      },
      message: `Successfully logged in as ${userRole} (${email})`,
    });
  });

  // REST API: Get or Create Packages (/api/packages)
  app.get('/api/packages', (req, res) => {
    const { category, search } = req.query;
    let result = [...packagesStore];

    if (category && typeof category === 'string' && category !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.destination.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      count: result.length,
      packages: result,
    });
  });

  app.post('/api/packages', (req, res) => {
    const newPackage = req.body;
    if (!newPackage || !newPackage.name || !newPackage.priceInr) {
      return res.status(400).json({ success: false, error: 'Package name and price are required' });
    }

    const created = {
      id: newPackage.id || `pkg-custom-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      availableSeats: newPackage.availableSeats || 20,
      ...newPackage,
    };

    packagesStore.unshift(created);

    return res.status(201).json({
      success: true,
      message: 'Package created successfully!',
      package: created,
    });
  });

  // REST API: Get or Create Bookings (/api/bookings)
  app.get('/api/bookings', (req, res) => {
    const { email } = req.query;
    let result = [...bookingsStore];

    if (email && typeof email === 'string') {
      result = result.filter((b) => b.customerEmail.toLowerCase() === email.toLowerCase());
    }

    return res.json({
      success: true,
      count: result.length,
      bookings: result,
    });
  });

  app.post('/api/bookings', (req, res) => {
    const bookingData = req.body;

    if (!bookingData || !bookingData.customerEmail || !bookingData.packageId) {
      return res.status(400).json({
        success: false,
        error: 'customerEmail and packageId are required fields',
      });
    }

    const newBooking = {
      id: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString(),
      ...bookingData,
    };

    bookingsStore.unshift(newBooking);

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: newBooking,
    });
  });

  // Verify Email endpoint
  app.post('/api/verify-email', (req, res) => {
    const { email, code } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required.' });
    }

    const expectedCode = emailVerificationCodes[email] || '748291';

    if (code && code.toString().trim() !== expectedCode) {
      return res.status(403).json({
        success: false,
        errorCode: 'EMAIL_NOT_VERIFIED',
        message: 'Invalid 6-digit verification code. Please check your JourneyHub email inbox.',
      });
    }

    verifiedEmails.add(email);
    return res.json({
      success: true,
      message: `Email ${email} has been successfully verified for JourneyHub!`,
      email,
      isVerified: true,
    });
  });

  // Send / Resend Verification Code
  app.post('/api/send-verification', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required.' });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    emailVerificationCodes[email] = newCode;

    return res.json({
      success: true,
      message: `JourneyHub verification code sent to ${email}`,
      email,
      simulatedCode: newCode,
      sentAt: new Date().toISOString(),
    });
  });

  // Check email status
  app.get('/api/email-status', (req, res) => {
    const email = (req.query.email as string) || '';
    const isVerified = verifiedEmails.has(email);
    return res.json({
      email,
      isVerified,
      pendingCode: emailVerificationCodes[email] || null,
    });
  });

  // Gemini AI Assistant Chat Endpoint (/api/chat)
  app.post('/api/chat', async (req, res) => {
    const { message, history, userContext } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Dynamic user context extraction if provided
    let accountContextSection = 'User is currently browsing as a guest (Not logged in).';
    if (userContext) {
      const {
        userName,
        userEmail,
        userRole,
        isEmailVerified,
        phone,
        activeBookingsCount,
        loyaltyPoints,
        totalSpent,
        recentTrips,
      } = userContext;

      accountContextSection = `Current Authenticated User Account Details:
- Name: ${userName || 'Guest Traveler'}
- Email: ${userEmail || 'N/A'}
- Role: ${userRole === 'admin' ? 'Administrator' : 'Customer'}
- Email Verification Status: ${isEmailVerified ? 'Verified (OTP Confirmed)' : 'Unverified'}
- Contact Phone: ${phone || 'Not provided'}
- Active / Upcoming Bookings Count: ${activeBookingsCount ?? 0}
- Silver Loyalty Points: ${loyaltyPoints ?? 0} pts
- Total Spent on Journeys: ₹${(totalSpent || 0).toLocaleString('en-IN')}
${
  Array.isArray(recentTrips) && recentTrips.length > 0
    ? `- Booked Trips & Milestones:\n` +
      recentTrips
        .map(
          (t: any) =>
            `  * [${t.id}] ${t.packageName} to ${t.destination} | Date: ${t.travelDate} | Status: ${t.bookingStatus?.toUpperCase()} | Amount: ₹${Number(t.grandTotalInr || 0).toLocaleString('en-IN')}`
        )
        .join('\n')
    : `- Booked Trips: No active reservations yet.`
}`;
    }

    const systemInstruction = `You are the dedicated 'Travel Concierge' for JourneyHub — a smart travel agency and user workspace application.
Your core persona is an attentive, knowledgeable, hospitable, and highly professional Travel Concierge. Always introduce or carry yourself as the JourneyHub Travel Concierge.

Your primary objective is to assist users based on:
1. THE APPLICATION'S CURRENT FEATURE SET:
   - "Interactive Dashboard": Live metrics (Total Bookings, Active Tours, Spent in ₹, Silver Loyalty Points), responsive data table with search, status filters (Confirmed, Pending, Cancelled), reservation modal inspector, and activity stream.
   - "Journey Roadmap & Milestone Tracker": Chronological day-by-day travel timeline with status markers ("Completed" in green, "In Progress / Today's Milestone" in pulsing blue, and "Upcoming" in slate). Displays accommodation specs, private AC transport details, meal plans (breakfast, local lunches, farewell dinners), and smart concierge photography/packing tips.
   - "Tour Packages Catalog / Services": Filterable catalog across premium destinations (Kashmir, Kerala, Goa, Rajasthan, Ladakh, Maldives) with category filters (Honeymoon, Adventure, Heritage, Beach, Wildlife, Family, Luxury), real-time seat availability, ratings, and instant booking.
   - "Digital PDF Invoicing & Verification": Downloadable, printable high-resolution PDF receipts containing scannable QR verification codes, itemized base fare and 5% GST breakdowns.
   - "User Profile & Account Center": Account credentials, phone, verified email badge with simulated OTP verification modal, role switcher (Customer vs. Admin).
   - "Dark & Light Mode": Seamless visual theme switching for comfortable travel planning day or night.
   - "24/7 Support & Contact": Real-time assistance, contact submission, and helpline support.

2. STEP-BY-STEP BOOKING PROCEDURES:
   Explain the exact booking workflow clearly whenever asked:
   - Step 1: Browse or search packages on the Home or Services / Packages page.
   - Step 2: Click 'Book Now' or 'View Details' on any tour card to review full inclusions and itinerary.
   - Step 3: Select departure travel date, return date, and number of adult and child travelers.
   - Step 4: Review transparent pricing in Indian Rupees (₹), including base package fare, add-ons, and 5% GST.
   - Step 5: Choose a payment method: UPI (Google Pay, PhonePe, Paytm), Credit/Debit Card, or Net Banking.
   - Step 6: Instant confirmation with an official Booking ID (e.g., JH-BK-2026-101), immediate live update on the Dashboard & Journey Roadmap, and instant downloadable PDF invoice with verification QR code.
   - Step 7: Users can view, monitor progress, or manage booking details anytime from their Dashboard.

3. USER ACCOUNT STATUS & PERSONALIZED TRAVEL DATA:
   Use the real-time user context provided below to provide precise, personalized answers about the user's logged-in status, verification badge, loyalty rewards, and active trip schedules:
   ${accountContextSection}

Formatting & Tone Rules:
- Embody the polite, welcoming, and refined tone of a luxury Travel Concierge.
- Answer user queries directly, concisely, and with structured bullet points and bold key terms.
- When explaining navigation or actions, point them to the exact tab, button, or section to click.
- All monetary amounts MUST be stated in Indian Rupees with the ₹ symbol (e.g., ₹28,500).`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        
        // Build messages structure or prompt
        const formattedHistory = Array.isArray(history)
          ? history.slice(-8).map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n')
          : '';

        const fullPrompt = `${systemInstruction}\n\nRecent Conversation:\n${formattedHistory}\n\nUser: ${message}\nAssistant:`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt,
        });

        const reply = response.text || 'I am delighted to assist you with JourneyHub! You can explore tour packages, view your live Journey Roadmap, or download verified trip receipts.';
        return res.json({ success: true, reply });
      }
    } catch (err: any) {
      console.warn('Gemini chat API error, falling back to smart contextual response:', err?.message || err);
    }

    // Smart, robust rule-based fallback response engine for all common questions
    const q = message.toLowerCase().trim();
    let fallbackReply = '';

    if (
      q.includes('account status') ||
      q.includes('my status') ||
      q.includes('my profile') ||
      q.includes('my account') ||
      q.includes('loyalty points') ||
      q.includes('active booking') ||
      q.includes('my trips')
    ) {
      if (userContext && userContext.userName) {
        const tripSummary =
          Array.isArray(userContext.recentTrips) && userContext.recentTrips.length > 0
            ? userContext.recentTrips
                .map(
                  (t: any) =>
                    `• **${t.packageName}** (${t.id})\n  - Destination: ${t.destination}\n  - Travel Date: **${t.travelDate}**\n  - Status: **${t.bookingStatus?.toUpperCase()}**\n  - Total: ₹${Number(t.grandTotalInr || 0).toLocaleString('en-IN')}`
                )
                .join('\n')
            : '• You currently have no active trip bookings.';

        fallbackReply = `Here is your current **JourneyHub Account Status**:\n\n• **Traveler Name**: ${userContext.userName}\n• **Registered Email**: ${userContext.userEmail || 'N/A'}\n• **Account Role**: ${userContext.userRole === 'admin' ? 'Administrator' : 'Customer'}\n• **Email Verification**: ${userContext.isEmailVerified ? '✅ Verified' : '⚠️ Pending Verification'}\n• **Silver Loyalty Rewards**: **${userContext.loyaltyPoints ?? 0} Points**\n• **Total Journeys Expenditure**: ₹${(userContext.totalSpent || 0).toLocaleString('en-IN')}\n\n**Your Active Bookings & Itineraries**:\n${tripSummary}\n\nYou can manage your account and inspect all travel records in the **Dashboard**!`;
      } else {
        fallbackReply = `You are currently browsing JourneyHub as a **Guest Traveler**.\n\n• To track personalized bookings, access your live **Journey Roadmap**, and earn **Loyalty Rewards**, please log in or create an account via the **Login / Sign Up** button in the navigation bar.\n• You can also use the demo switcher in the top banner to try out a preloaded Customer or Administrator profile!`;
      }
    } else if (
      q.includes('how do i book') ||
      q.includes('how to book') ||
      q.includes('booking procedure') ||
      q.includes('booking process') ||
      q.includes('book a tour') ||
      q.includes('steps to book')
    ) {
      fallbackReply = `Here is the step-by-step **Booking Procedure** on JourneyHub:\n\n1. **Select a Package**: Navigate to **Services / Features** or browse featured tours on the **Home** page.\n2. **Review Itinerary**: Click **View Details** or **Book Now** on your desired destination (e.g., Kashmir, Kerala, Goa, Rajasthan).\n3. **Customize Your Journey**: In the Booking Modal, pick your preferred **Travel Date**, specify the count of **Adults** and **Children**, and add any custom requests.\n4. **Review Transparent Pricing**: See the exact breakdown in Indian Rupees (₹), including base fare and 5% GST.\n5. **Instant Payment**: Select your preferred payment gateway (**UPI / QR**, **Credit/Debit Card**, or **Net Banking**).\n6. **Receive Verification & PDF Invoice**: Upon confirmation, an official Booking ID (e.g. JH-BK-2026-101) is issued with an instant **downloadable PDF receipt** containing a secure verification QR code.\n7. **Track on Journey Roadmap**: Your trip will immediately appear in your **Dashboard** and **Journey Roadmap** for day-by-day milestone tracking!`;
    } else if (q.includes('roadmap') || q.includes('itinerary') || q.includes('timeline') || q.includes('milestone')) {
      fallbackReply = `As your **Travel Concierge**, here is how the **Journey Roadmap** works:\n\n• **Chronological Milestones**: Displays day-by-day activities with live status markers:\n  - **Completed** (Green Check): Checkpoints and travel days you have already completed.\n  - **In Progress / Today's Milestone** (Pulsing Blue): Your active daily schedule with specific morning, afternoon, and evening timings.\n  - **Upcoming** (Slate): Future days, sightseeing excursions, and airport transfers.\n• **Curated Inclusions**: Inspect your assigned luxury hotels, private AC transport vehicles, dining plans, and photography/packing tips.\n• **Verified PDF Export**: Download your complete itinerary with verification QR codes anytime.\n\nYou can access it on your **Dashboard** or switch to the dedicated **Journey Roadmap** sidebar tab!`;
    } else if (q.includes('what can i do') || q.includes('capabilities') || q.includes('what is this') || q.includes('overview') || q.includes('feature')) {
      fallbackReply = `Welcome! As your **JourneyHub Travel Concierge**, here is the full suite of features available to you:\n\n• **Curated Tour Catalog**: Explore packages across Kashmir, Kerala, Goa, Rajasthan, Ladakh, and Maldives with all-inclusive Indian Rupee (₹) pricing.\n• **Instant Booking System**: Seamless reservation with instant payment verification, GST breakdown, and seat tracking.\n• **Live Journey Roadmap**: Interactive chronological timeline with real-time status markers (Completed, Active, Upcoming).\n• **Interactive User Dashboard**: Monitor key statistics (Total Bookings, Active Tours, Spent in ₹, Silver Loyalty Points), data tables, and activity logs.\n• **Digital PDF Invoicing**: High-resolution receipts with dynamic QR code authentication.\n• **Profile & Security Center**: Account credentials, OTP email verification, and Customer/Admin role controls.\n• **Theme Preferences**: Switch between Dark and Light mode seamlessly for comfortable viewing.`;
    } else if (q.includes('how do i use') || q.includes('how to use') || q.includes('dashboard')) {
      fallbackReply = `To use the **JourneyHub Dashboard**:\n\n1. Click **Dashboard** in the top navigation bar or the **Get Started** button on Home.\n2. Use the **Sidebar Navigation** on the left to switch between:\n   - **Dashboard Overview**: Key metrics (Total Bookings, Active Tours, Spent in ₹, Silver Loyalty Points), Journey Roadmap, and Bookings table.\n   - **Journey Roadmap**: Full chronological timeline with status markers for every day.\n   - **Profile**: Account credentials, contact info, and email verification badge.\n   - **Features & Tours**: Direct access to the tour package catalog.\n   - **Settings**: Toggle Dark/Light theme, currency preference (INR ₹), and notifications.\n   - **Help & FAQ**: Guides and support contacts.\n3. In the Bookings Table, click **View** to inspect full reservation details or **PDF** to download an official receipt with QR verification.`;
    } else if (q.includes('where can i find') || q.includes('my info') || q.includes('information')) {
      fallbackReply = `You can find your personal and booking information in the following locations:\n\n1. **Dashboard > Profile Section**: View your name, registered email, verification badge, and phone number.\n2. **Dashboard > Journey Roadmap**: See your active travel itinerary, booked hotels, and transfer details.\n3. **Dashboard > Bookings Table**: Displays all your confirmed, pending, or past trip reservations.\n4. **Top Navigation Bar**: Click on your user name or avatar for quick profile access.`;
    } else if (q.includes('help me navigate') || q.includes('navigate') || q.includes('where is')) {
      fallbackReply = `Here is a quick navigation directory for JourneyHub:\n\n• **Home**: Featured tour packages, customer reviews, and search tools.\n• **Dashboard**: Your active travel roadmap, statistics, bookings table, and profile settings.\n• **Services / Features**: Filter holiday packages by Honeymoon, Adventure, Heritage, or Beach.\n• **About**: Learn about our mission and modern technology stack.\n• **Contact**: 24/7 customer support and inquiry form.\n• **Login / Signup**: Authenticate as an admin or traveler.`;
    } else if (q.includes('contact') || q.includes('support') || q.includes('reach')) {
      fallbackReply = `You can connect with our team anytime via the **Contact** page! We provide 24/7 travel assistance, email support at **support@journeyhub.travel**, and instant answers right here via the AI Travel Concierge.`;
    } else if (q.includes('price') || q.includes('cost') || q.includes('rupee') || q.includes('inr') || q.includes('package')) {
      fallbackReply = `All tour packages on JourneyHub are priced in **Indian Rupees (₹)** per person:\n\n• **Goa Coastal Luxury & Yacht Sunset** (4D/3N): ₹16,999\n• **Kerala Backwaters & Munnar Hills** (5D/4N): ₹22,499\n• **Kashmir Paradise & Gulmarg Snow Escape** (6D/5N): ₹28,500\n• **Leh Ladakh High Altitude Pangong Lake** (6D/5N): ₹31,999\n• **Royal Rajasthan Forts & Desert Camp** (7D/6N): ₹34,999\n• **Maldives Overwater Ocean Villa** (5D/4N): ₹78,999\n\nAll packages include 5-star or premium accommodation, private AC transport, curated meals, and verified digital receipts with QR codes!`;
    } else {
      fallbackReply = `Greetings! I am your dedicated **JourneyHub Travel Concierge**. I can assist you with:\n\n• **Application Features**: Overview of the Dashboard, Journey Roadmap, Tour Catalog, and PDF receipts.\n• **Booking Procedures**: Step-by-step guidance on selecting dates, pricing in ₹, and confirming bookings.\n• **Account Status**: Real-time status of your login, verified email, loyalty points, and booked itineraries.\n• **Navigation Assistance**: Directing you to any page or section across the application.\n\nWhat may I assist you with today?`;
    }

    return res.json({ success: true, reply: fallbackReply });
  });

  // Contact Form Submission Endpoint (/api/contact)
  app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }
    return res.json({
      success: true,
      message: `Thank you, ${name}! Your message has been received. Our team will contact you at ${email} shortly.`,
      ticketId: `TICK-${Date.now().toString().slice(-6)}`,
    });
  });

  // AI Tour Package Recommendation Endpoint
  app.post('/api/ai-recommend', async (req, res) => {
    const { budgetInr, destinationPreference, groupType, seasonPreference, packages } = req.body;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are JourneyHub's AI Travel Concierge. Recommend the top 2 tour packages from this list based on budget: ₹${budgetInr}, preference: "${destinationPreference || 'Any'}", group type: "${groupType || 'Family'}", season: "${seasonPreference || 'Any'}".
Available packages JSON: ${JSON.stringify(packages)}
Return JSON array with items having packageId, matchScore (80-99), reason (1 short sentence), customTip (1 travel advice line).`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({ success: true, recommendations: parsed });
        }
      }
    } catch (e) {
      console.warn('Gemini API fallback to smart rule engine:', e);
    }

    // Smart fallback recommendation engine
    const fallbackRecs = (packages || []).slice(0, 2).map((pkg: any, idx: number) => ({
      packageId: pkg.id,
      matchScore: 95 - idx * 4,
      reason: `Fits your ₹${budgetInr.toLocaleString('en-IN')} travel budget with premium hotel stay and tailored ${groupType} activities.`,
      customTip: `Best season to visit ${pkg.destination} is between September and March for ideal weather!`,
    }));

    return res.json({ success: true, recommendations: fallbackRecs });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JourneyHub Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[JourneyHub Server] Failed to start:', err);
});
