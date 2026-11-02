const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS resolving SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const dotenv = require('dotenv');
const User = require('./models/User');
const Equipment = require('./models/Equipment');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Notification = require('./models/Notification');
const Payment = require('./models/Payment');

dotenv.config();

const sampleEquipments = [
  // 1. Laptops & Computers
  {
    name: 'Apple MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD)',
    description: 'The ultimate powerhouse for 4K video editing, software development, 3D rendering, and music production. Equipped with Liquid Retina XDR display, 12-core CPU, and 18-core GPU.',
    category: 'Laptops & Computers',
    brand: 'Apple',
    modelNumber: 'MBP16-M3MAX-2024',
    dailyPrice: 1800,
    securityDeposit: 15000,
    condition: 'Like New',
    isAvailable: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'Processor', value: 'Apple M3 Max Chip' },
      { key: 'Memory', value: '36GB Unified Memory' },
      { key: 'Storage', value: '1TB Superfast NVMe SSD' },
      { key: 'Display', value: '16.2" Liquid Retina XDR (3456 x 2234)' },
      { key: 'Battery Life', value: 'Up to 22 Hours' },
      { key: 'Ports', value: '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3' },
    ],
    averageRating: 4.9,
    numReviews: 8,
    totalRentals: 14,
    location: 'Central Tech Hub',
  },
  {
    name: 'Dell XPS 15 9530 OLED (Intel i9 / 32GB / RTX 4070)',
    description: 'Stunning 3.5K OLED touchscreen with peak workstation grade performance. Perfect for business presentations, machine learning, and CAD engineering workflows.',
    category: 'Laptops & Computers',
    brand: 'Dell',
    modelNumber: 'XPS-9530-OLED',
    dailyPrice: 1400,
    securityDeposit: 10000,
    condition: 'Like New',
    isAvailable: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'Processor', value: '13th Gen Intel Core i9-13900H' },
      { key: 'Graphics', value: 'NVIDIA GeForce RTX 4070 8GB GDDR6' },
      { key: 'Display', value: '15.6" 3.5K (3456 x 2160) OLED Touch' },
      { key: 'RAM', value: '32GB DDR5 4800MHz' },
      { key: 'Weight', value: '1.92 kg' },
    ],
    averageRating: 4.8,
    numReviews: 5,
    totalRentals: 9,
    location: 'Central Tech Hub',
  },

  // 2. Cameras & Photography
  {
    name: 'Sony Alpha A7 IV Full-Frame Camera + 24-70mm f/2.8 GM Kit',
    description: 'Industry standard hybrid camera boasting 33MP resolution, 4K 60p 10-bit 4:2:2 video, class-leading real-time eye autofocus, and Sony G Master zoom lens for weddings, commercial shoots, and cinema.',
    category: 'Cameras & Photography',
    brand: 'Sony',
    modelNumber: 'ILCE-7M4-KIT',
    dailyPrice: 2200,
    securityDeposit: 12000,
    condition: 'Brand New',
    isAvailable: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'Sensor', value: '33MP Full-Frame Exmor R CMOS' },
      { key: 'Video Recording', value: '4K 60p 10-bit 4:2:2 All-Intra' },
      { key: 'Lens Included', value: 'Sony FE 24-70mm f/2.8 GM II' },
      { key: 'Stabilization', value: '5-Axis In-Body Image Stabilization' },
      { key: 'Accessories', value: '2x Batteries, 128GB V90 SD Card, Dual Charger, Bag' },
    ],
    averageRating: 5.0,
    numReviews: 12,
    totalRentals: 21,
    location: 'Downtown Studio Depot',
  },
  {
    name: 'Canon EOS R6 Mark II Mirrorless Camera + 24-105mm L Lens',
    description: 'Lightning-fast 40 fps electronic shutter, 6K oversampled 4K 60p video without crop, and low-light autofocus down to -6.5 EV. Ideal for sports, wildlife, and event videography.',
    category: 'Cameras & Photography',
    brand: 'Canon',
    modelNumber: 'EOS-R6-MK2',
    dailyPrice: 2000,
    securityDeposit: 10000,
    condition: 'Like New',
    isAvailable: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'Sensor', value: '24.2MP Full-Frame CMOS Sensor' },
      { key: 'Continuous Shooting', value: 'Up to 40 fps' },
      { key: 'Video', value: '4K 60p 10-Bit Internal, Canon Log 3' },
      { key: 'Lens', value: 'Canon RF 24-105mm f/4 L IS USM' },
    ],
    averageRating: 4.7,
    numReviews: 6,
    totalRentals: 11,
    location: 'Downtown Studio Depot',
  },

  // 3. Drones
  {
    name: 'DJI Mini 4 Pro Fly More Combo (RC 2 Controller)',
    description: 'Ultralight sub-249g foldable drone with omnidirectional obstacle sensing, 4K/60fps HDR true vertical shooting, 20km FHD video transmission, and 3 high-capacity batteries.',
    category: 'Drones',
    brand: 'DJI',
    modelNumber: 'MINI-4-PRO-FMC',
    dailyPrice: 1500,
    securityDeposit: 8000,
    condition: 'Brand New',
    isAvailable: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'Takeoff Weight', value: '< 249 g (No permit required for recreational use)' },
      { key: 'Camera', value: '1/1.3-inch CMOS, f/1.7 aperture' },
      { key: 'Max Flight Time', value: '34 minutes per battery (3 included)' },
      { key: 'Obstacle Sensing', value: 'Omnidirectional Vision Sensing' },
      { key: 'Controller', value: 'DJI RC 2 with integrated 5.5" FHD Screen' },
    ],
    averageRating: 4.9,
    numReviews: 15,
    totalRentals: 26,
    location: 'Central Tech Hub',
  },
  {
    name: 'DJI Mavic 3 Pro Cine Flagship Drone (Triple-Camera System)',
    description: 'Professional cinematic aerial production system featuring 4/3 CMOS Hasselblad camera, 70mm medium tele, and 166mm telephoto camera. Apple ProRes 422 HQ recording with built-in 1TB SSD.',
    category: 'Drones',
    brand: 'DJI',
    modelNumber: 'MAVIC-3-PRO-CINE',
    dailyPrice: 3800,
    securityDeposit: 25000,
    condition: 'Like New',
    isAvailable: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'Primary Camera', value: 'Hasselblad 4/3 CMOS 20MP' },
      { key: 'Telephoto Cameras', value: '1/1.3" CMOS 48MP (70mm) + 1/2" CMOS 12MP (166mm)' },
      { key: 'Video Encoding', value: 'Apple ProRes 422 HQ / D-Log / HLG' },
      { key: 'Internal Storage', value: '1TB SSD' },
      { key: 'Transmission', value: 'DJI O3+ up to 15 km' },
    ],
    averageRating: 5.0,
    numReviews: 4,
    totalRentals: 7,
    location: 'Central Tech Hub',
  },

  // 4. Projectors
  {
    name: 'Epson Pro EX9240 Full HD 1080p Wireless Projector (4000 Lumens)',
    description: 'Crisp, ultra-bright 4,000 lumens projector engineered for large conference rooms, weddings, movie nights, and outdoor event screenings even in ambient daylight.',
    category: 'Projectors',
    brand: 'Epson',
    modelNumber: 'EX9240-PRO',
    dailyPrice: 900,
    securityDeposit: 4000,
    condition: 'Excellent',
    isAvailable: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'Brightness', value: '4,000 Lumens (Color & White Brightness)' },
      { key: 'Native Resolution', value: 'Full HD 1080p (1920 x 1080)' },
      { key: 'Connectivity', value: '2x HDMI, USB, Built-in Wi-Fi & Miracast' },
      { key: 'Screen Size', value: 'Up to 300 inches' },
      { key: 'Built-in Speaker', value: '16W High Output' },
    ],
    averageRating: 4.8,
    numReviews: 9,
    totalRentals: 18,
    location: 'Events & AV Warehouse',
  },
  {
    name: 'BenQ TK700STi 4K HDR Short Throw Gaming & Cinema Projector',
    description: 'True 4K UHD 3840x2160 resolution with ultra-low 16ms input lag and short throw lens capable of projecting a massive 100-inch screen from just 6.5 feet away.',
    category: 'Projectors',
    brand: 'BenQ',
    modelNumber: 'TK700STi-4K',
    dailyPrice: 1200,
    securityDeposit: 6000,
    condition: 'Like New',
    isAvailable: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'Resolution', value: '4K UHD (3840 x 2160)' },
      { key: 'Brightness', value: '3,000 ANSI Lumens' },
      { key: 'Throw Ratio', value: '0.9 - 1.08 (100" at 1.99m)' },
      { key: 'Refresh Rate', value: '4K @ 60Hz / 1080p @ 120Hz' },
      { key: 'Smart Features', value: 'Certified Android TV with Netflix & Prime Video' },
    ],
    averageRating: 4.9,
    numReviews: 11,
    totalRentals: 16,
    location: 'Events & AV Warehouse',
  },

  // 5. Gaming Consoles
  {
    name: 'Sony PlayStation 5 Disc Edition + 2 DualSense Controllers + 3 Games',
    description: 'Experience ultra-fast loading with high-speed SSD, haptic feedback, adaptive triggers, and 3D Audio. Bundle includes 2 DualSense wireless controllers, charging station, and top titles (Spider-Man 2, FC 24, God of War Ragnarok).',
    category: 'Gaming Consoles',
    brand: 'Sony',
    modelNumber: 'CFI-1200A',
    dailyPrice: 850,
    securityDeposit: 5000,
    condition: 'Excellent',
    isAvailable: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'CPU / GPU', value: 'Custom AMD Zen 2 (8-core) / RDNA 2 (10.28 TFLOPs)' },
      { key: 'Storage', value: '825GB Custom Ultra-Fast NVMe SSD' },
      { key: 'Output', value: 'Supports 4K 120Hz TVs, 8K TVs, VRR' },
      { key: 'Included Items', value: 'Console, 2 Controllers, HDMI 2.1 cable, Power cable, 3 Games' },
    ],
    averageRating: 4.9,
    numReviews: 22,
    totalRentals: 39,
    location: 'Central Tech Hub',
  },
  {
    name: 'Meta Quest 3 512GB Mixed Reality All-In-One VR Headset',
    description: 'Breakthrough mixed reality headset with dual RGB cameras for high-resolution full-color pass-through, next-gen Snapdragon XR2 Gen 2 graphics, and Touch Plus controllers.',
    category: 'Gaming Consoles',
    brand: 'Meta',
    modelNumber: 'QUEST-3-512GB',
    dailyPrice: 950,
    securityDeposit: 6000,
    condition: 'Brand New',
    isAvailable: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'Display', value: '4K+ Infinite Display (2064x2208 per eye)' },
      { key: 'Processor', value: 'Snapdragon XR2 Gen 2' },
      { key: 'Storage', value: '512GB' },
      { key: 'Sensors', value: '2 RGB Color Cameras + Depth Projector' },
      { key: 'Battery Life', value: '2.2 - 2.9 hours active play' },
    ],
    averageRating: 4.8,
    numReviews: 7,
    totalRentals: 13,
    location: 'Central Tech Hub',
  },

  // 6. Audio Equipment
  {
    name: 'Bose S1 Pro+ Multi-Position All-in-One Portable PA System',
    description: 'Pro-grade sound wherever you perform. Built-in 3-channel mixer with ToneMatch presets, Bluetooth streaming, rechargeable battery lasting up to 11 hours, and ultra-portable 6.5kg chassis.',
    category: 'Audio Equipment',
    brand: 'Bose',
    modelNumber: 'S1-PRO-PLUS',
    dailyPrice: 1100,
    securityDeposit: 5000,
    condition: 'Like New',
    isAvailable: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'Power Output', value: '150 Watts RMS' },
      { key: 'Inputs', value: '2x XLR / 1/4" combo jacks, 3.5mm Aux, Bluetooth' },
      { key: 'Battery Life', value: 'Up to 11 Hours rechargeable lithium-ion' },
      { key: 'Weight', value: '6.5 kg (14.4 lbs)' },
      { key: 'Ideal For', value: 'Acoustic gigs, DJs, corporate presentations, party events' },
    ],
    averageRating: 5.0,
    numReviews: 14,
    totalRentals: 28,
    location: 'Events & AV Warehouse',
  },
  {
    name: 'Shure SM7B Cardioid Studio Vocal & Podcasting Microphone Kit',
    description: 'The legendary vocal microphone heard on top podcasts, radio broadcasts, and platinum albums. Includes Cloudlifter CL-1 Mic Activator, Focusrite Scarlett 2i2 audio interface, boom arm, and XLR cables.',
    category: 'Audio Equipment',
    brand: 'Shure',
    modelNumber: 'SM7B-STUDIO-KIT',
    dailyPrice: 750,
    securityDeposit: 4000,
    condition: 'Excellent',
    isAvailable: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'Polar Pattern', value: 'Cardioid' },
      { key: 'Frequency Response', value: '50 Hz to 20,000 Hz' },
      { key: 'Interface Included', value: 'Focusrite Scarlett 2i2 4th Gen' },
      { key: 'Preamp Activator', value: 'Cloudlifter CL-1 (+25dB clean gain)' },
      { key: 'Mounting', value: 'Heavy Duty Desktop Boom Arm & Pop Filter' },
    ],
    averageRating: 4.9,
    numReviews: 18,
    totalRentals: 31,
    location: 'Downtown Studio Depot',
  },

  // 7. Printers & Other Electronics
  {
    name: 'Epson EcoTank Pro ET-5850 All-in-One Supertank Color Printer',
    description: 'High-speed, cartridge-free heavy-duty color multifunction printer with auto 2-sided print/copy/scan. Prints up to 25 ppm in both black and color. Ideal for conferences, temporary event offices, and pop-up events.',
    category: 'Printers',
    brand: 'Epson',
    modelNumber: 'ET-5850-PRO',
    dailyPrice: 650,
    securityDeposit: 3000,
    condition: 'Excellent',
    isAvailable: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'Print Speed', value: '25 ISO ppm (Black and Color)' },
      { key: 'Paper Capacity', value: '500 sheets dual front trays + 50 sheet rear feed' },
      { key: 'Features', value: '4.3" Touchscreen, Ethernet, Wi-Fi Direct' },
      { key: 'Scanning', value: '50-sheet Auto Document Feeder (ADF)' },
    ],
    averageRating: 4.6,
    numReviews: 5,
    totalRentals: 8,
    location: 'Central Tech Hub',
  },
  {
    name: 'Wacom Cintiq Pro 16 Creative Pen Display 4K (DTH167)',
    description: 'Pro graphics display for digital painters, UI designers, and animators with 4K resolution, 98% Adobe RGB color accuracy, and Pro Pen 2 with 8,192 levels of pressure sensitivity.',
    category: 'Other Electronics',
    brand: 'Wacom',
    modelNumber: 'DTH-167',
    dailyPrice: 850,
    securityDeposit: 5000,
    condition: 'Like New',
    isAvailable: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1000&q=80',
    ],
    specifications: [
      { key: 'Screen Size & Resolution', value: '15.6" Ultra HD 4K (3840 x 2160)' },
      { key: 'Color Gamut', value: '98% Adobe RGB (CIE1931)' },
      { key: 'Pen Technology', value: 'Wacom Pro Pen 2 with 8,192 pressure levels' },
      { key: 'Multi-touch', value: 'Physical switch for gestures ON/OFF' },
    ],
    averageRating: 4.8,
    numReviews: 6,
    totalRentals: 10,
    location: 'Central Tech Hub',
  },
];

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI || mongoURI.includes('YOUR_USERNAME')) {
      console.error('\n❌ CANNOT SEED DATABASE:');
      console.error('   Please provide a valid MongoDB Atlas connection string in server/.env');
      console.error('   Example: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/renthub?retryWrites=true&w=majority\n');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas');

    console.log('Cleaning existing collections...');
    await Promise.all([
      User.deleteMany(),
      Equipment.deleteMany(),
      Booking.deleteMany(),
      Review.deleteMany(),
      Notification.deleteMany(),
      Payment.deleteMany(),
    ]);

    console.log('Creating Admin & Test Users...');
    // 1. Admin user
    const adminUser = await User.create({
      name: 'RentHub Administrator',
      email: 'admin@renthub.com',
      phone: '+91 98765 43210',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      address: {
        street: '100 Innovation Boulevard',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
      },
    });

    // 2. Regular customer user
    const regularUser = await User.create({
      name: 'Rahul Sharma',
      email: 'user@renthub.com',
      phone: '+91 91234 56789',
      password: 'user123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      address: {
        street: '42 Tech Park Residency',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560100',
      },
    });

    // 3. Second test user
    const userTwo = await User.create({
      name: 'Priya Patel',
      email: 'priya@renthub.com',
      phone: '+91 99887 76655',
      password: 'user123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      address: {
        street: '15 High Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
    });

    console.log('Inserting Equipment Catalog...');
    const insertedEquipments = await Equipment.insertMany(sampleEquipments);
    console.log(`✅ Inserted ${insertedEquipments.length} equipment items across all categories.`);

    console.log('Creating Sample Bookings & Workflows...');
    const now = new Date();

    // 1. Active Booking (Sony A7 IV rented by Rahul)
    const activeStart = new Date(now);
    activeStart.setDate(activeStart.getDate() - 1);
    const activeEnd = new Date(now);
    activeEnd.setDate(activeEnd.getDate() + 3);

    const activeBooking = await Booking.create({
      userId: regularUser._id,
      equipmentId: insertedEquipments[2]._id, // Sony A7 IV
      startDate: activeStart,
      endDate: activeEnd,
      rentalDays: 5,
      rentalAmount: 2200 * 5,
      securityDeposit: 12000,
      totalAmount: 2200 * 5 + 12000,
      bookingStatus: 'active',
      paymentStatus: 'paid',
      deliveryType: 'store_pickup',
      userNotes: 'Required for client fashion campaign shoot.',
      adminNotes: 'Handed over in mint condition with serial verified.',
    });

    await Payment.create({
      userId: regularUser._id,
      bookingId: activeBooking._id,
      amount: activeBooking.totalAmount,
      paymentMethod: 'upi',
      transactionId: `TXN-${Date.now()}-101`,
      paymentStatus: 'completed',
    });

    // 2. Pending Approval Booking (MacBook Pro requested by Priya)
    const pendingStart = new Date(now);
    pendingStart.setDate(pendingStart.getDate() + 5);
    const pendingEnd = new Date(now);
    pendingEnd.setDate(pendingEnd.getDate() + 8);

    await Booking.create({
      userId: userTwo._id,
      equipmentId: insertedEquipments[0]._id, // MacBook Pro M3
      startDate: pendingStart,
      endDate: pendingEnd,
      rentalDays: 4,
      rentalAmount: 1800 * 4,
      securityDeposit: 15000,
      totalAmount: 1800 * 4 + 15000,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
      deliveryType: 'home_delivery',
      deliveryAddress: '15 High Street, Mumbai 400001',
      userNotes: 'Needed for a 4K DaVinci Resolve color grading project.',
    });

    // 3. Approved Booking (DJI Mini 4 Pro by Rahul)
    const approvedStart = new Date(now);
    approvedStart.setDate(approvedStart.getDate() + 10);
    const approvedEnd = new Date(now);
    approvedEnd.setDate(approvedEnd.getDate() + 12);

    await Booking.create({
      userId: regularUser._id,
      equipmentId: insertedEquipments[4]._id, // DJI Mini 4 Pro
      startDate: approvedStart,
      endDate: approvedEnd,
      rentalDays: 3,
      rentalAmount: 1500 * 3,
      securityDeposit: 8000,
      totalAmount: 1500 * 3 + 8000,
      bookingStatus: 'approved',
      paymentStatus: 'paid',
      deliveryType: 'store_pickup',
      userNotes: 'Weekend landscape video project in Coorg.',
      adminNotes: 'Approved. Extra propeller set included.',
    });

    // 4. Completed Booking (PS5 by Rahul)
    const completedStart = new Date(now);
    completedStart.setDate(completedStart.getDate() - 14);
    const completedEnd = new Date(now);
    completedEnd.setDate(completedEnd.getDate() - 11);

    const completedBooking = await Booking.create({
      userId: regularUser._id,
      equipmentId: insertedEquipments[8]._id, // PS5
      startDate: completedStart,
      endDate: completedEnd,
      rentalDays: 4,
      rentalAmount: 850 * 4,
      securityDeposit: 5000,
      totalAmount: 850 * 4 + 5000,
      bookingStatus: 'completed',
      paymentStatus: 'paid',
      deliveryType: 'store_pickup',
      actualReturnedDate: completedEnd,
      adminNotes: 'Returned on time in perfect condition. Security deposit refunded.',
    });

    // Create Reviews
    await Review.create({
      userId: regularUser._id,
      equipmentId: insertedEquipments[8]._id,
      bookingId: completedBooking._id,
      rating: 5,
      comment: 'The PS5 console arrived in pristine condition with 2 fresh controllers. Smooth 4K 120fps gaming for our weekend party. Deposit was refunded promptly upon return!',
    });

    await Review.create({
      userId: userTwo._id,
      equipmentId: insertedEquipments[2]._id,
      rating: 5,
      comment: 'The Sony A7 IV and G Master lens combination is breathtaking. Crystal-clear autofocus and sharp footage throughout our shoot. Highly recommended!',
    });

    // Notifications
    await Notification.create({
      userId: regularUser._id,
      title: 'Booking Approved 🎉',
      message: 'Your booking for DJI Mini 4 Pro has been approved! Pick up on scheduled date.',
      type: 'booking',
      link: '/dashboard/bookings',
    });

    await Notification.create({
      userId: regularUser._id,
      title: 'Active Rental Reminder',
      message: 'Your rental for Sony Alpha A7 IV is active. Scheduled return is in 3 days.',
      type: 'booking',
      link: '/dashboard/bookings',
    });

    console.log('\n=============================================================');
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('=============================================================');
    console.log('Default Credentials:');
    console.log('👉 Admin: admin@renthub.com / admin123');
    console.log('👉 User:  user@renthub.com  / user123');
    console.log('👉 User2: priya@renthub.com / user123');
    console.log('=============================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

