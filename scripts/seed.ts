/**
 * Seed script for Longevo database
 * Usage: npx tsx scripts/seed.ts
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: "public" },
});

// ============================================
// TREATMENTS
// ============================================
const treatments = [
  { name: "IV Therapy", slug: "iv-therapy", category: "Infusion" },
  {
    name: "Biomarker Testing",
    slug: "biomarker-testing",
    category: "Diagnostics",
  },
  { name: "NAD+ Therapy", slug: "nad-therapy", category: "Infusion" },
  { name: "Ozone Therapy", slug: "ozone-therapy", category: "Regenerative" },
  { name: "Hormone Panel", slug: "hormone-panel", category: "Diagnostics" },
  {
    name: "Genetic Analysis",
    slug: "genetic-analysis",
    category: "Diagnostics",
  },
  { name: "PRP Therapy", slug: "prp-therapy", category: "Regenerative" },
  {
    name: "Stem Cell Therapy",
    slug: "stem-cell-therapy",
    category: "Regenerative",
  },
  {
    name: "Hyperbaric Oxygen",
    slug: "hyperbaric-oxygen",
    category: "Regenerative",
  },
  { name: "Cryotherapy", slug: "cryotherapy", category: "Recovery" },
];

// ============================================
// CLINICS
// ============================================
const clinics = [
  {
    name: "Longevita Clinic Nişantaşı",
    slug: "longevita-clinic-nisantasi",
    description:
      "Istanbul's premier longevity center in the heart of Nişantaşı. We combine cutting-edge biomarker analysis with personalized IV therapy protocols to optimize your healthspan. Our team of experts uses data-driven approaches to create tailored wellness programs.",
    city: "Istanbul",
    country: "Turkey",
    address: "Teşvikiye Cad. No:45, Nişantaşı, Şişli",
    lat: 41.0482,
    lng: 28.9943,
    phone: "+90 212 555 0101",
    website: "https://longevita.com.tr",
    verified: true,
    cover_image_url:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=400&fit=crop",
    doctors: [
      {
        name: "Dr. Elif Yılmaz",
        title: "Chief Medical Officer",
        bio: "20+ yıllık anti-aging ve rejeneratif tıp deneyimi. Harvard Medical School'da ileri yaşlanma araştırmaları sertifikası.",
        avatar_url:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
        specialties: [
          "Anti-Aging Medicine",
          "IV Therapy",
          "Biomarker Analysis",
        ],
      },
      {
        name: "Dr. Mert Kaya",
        title: "Regenerative Medicine Specialist",
        bio: "Specializing in stem cell applications and PRP therapy. Published researcher in regenerative medicine journals.",
        avatar_url:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
        specialties: ["Stem Cell Therapy", "PRP", "Regenerative Medicine"],
      },
    ],
    treatments: [
      "iv-therapy",
      "biomarker-testing",
      "nad-therapy",
      "prp-therapy",
      "genetic-analysis",
    ],
    reviews: [
      {
        rating: 5,
        title: "Life-changing experience",
        body: "I've been coming to Longevita for 6 months now. My biomarkers have improved dramatically. The NAD+ infusions give me incredible energy. Dr. Yılmaz is incredibly knowledgeable and takes time to explain everything.",
        treatment_received: "NAD+ Therapy",
      },
      {
        rating: 4,
        title: "Harika bir klinik",
        body: "Nişantaşı'nın en iyi longevity kliniği. IV terapi sonrası kendimi çok daha enerjik hissediyorum. Tek eksik fiyatların biraz yüksek olması.",
        treatment_received: "IV Therapy",
      },
      {
        rating: 5,
        title: "Top-notch biomarker testing",
        body: "The most comprehensive blood panel I've ever had. They test over 80 biomarkers and the consultation afterwards was incredibly detailed. Worth every penny.",
        treatment_received: "Biomarker Testing",
      },
      {
        rating: 4,
        title: "Profesyonel ve güvenilir",
        body: "Genetik analiz sonuçlarım çok detaylıydı. Doktorlar sonuçları gayet anlaşılır şekilde açıkladı. Kesinlikle tavsiye ederim.",
        treatment_received: "Genetic Analysis",
      },
      {
        rating: 5,
        title: "Best in Istanbul",
        body: "After trying multiple clinics across Europe, Longevita stands out. The facility is modern, clean, and the staff is exceptional. My PRP treatments have been remarkable.",
        treatment_received: "PRP Therapy",
      },
    ],
  },
  {
    name: "BioAge Center Levent",
    slug: "bioage-center-levent",
    description:
      "Advanced longevity diagnostics and therapy center in Levent business district. Specializing in comprehensive health optimization through cutting-edge technology and evidence-based protocols.",
    city: "Istanbul",
    country: "Turkey",
    address: "Büyükdere Cad. No:128, Levent, Beşiktaş",
    lat: 41.0812,
    lng: 29.0112,
    phone: "+90 212 555 0202",
    website: "https://bioagecenter.com",
    verified: true,
    cover_image_url:
      "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1200&h=400&fit=crop",
    doctors: [
      {
        name: "Dr. Ayşe Demir",
        title: "Functional Medicine Director",
        bio: "Board-certified in functional medicine with expertise in hormone optimization and metabolic health. 15 years of clinical experience.",
        avatar_url:
          "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=200&h=200&fit=crop&crop=face",
        specialties: [
          "Functional Medicine",
          "Hormone Therapy",
          "Metabolic Health",
        ],
      },
    ],
    treatments: [
      "biomarker-testing",
      "hormone-panel",
      "nad-therapy",
      "genetic-analysis",
    ],
    reviews: [
      {
        rating: 5,
        title: "Excellent hormone panel analysis",
        body: "Dr. Demir identified hormonal imbalances that three other doctors missed. The comprehensive panel they run is truly next-level. Feeling 10 years younger.",
        treatment_received: "Hormone Panel",
      },
      {
        rating: 4,
        title: "Detaylı biyomarker testi",
        body: "Çok kapsamlı bir test yaptırdım. Sonuçlar online portal üzerinden detaylıca paylaşıldı. Doktor görüşmesi de çok faydalıydı.",
        treatment_received: "Biomarker Testing",
      },
      {
        rating: 5,
        title: "NAD+ infusion was amazing",
        body: "First time trying NAD+ and the difference was immediate. Energy levels through the roof for the next week. The clinic is modern and very well-organized.",
        treatment_received: "NAD+ Therapy",
      },
      {
        rating: 3,
        title: "Good but pricey",
        body: "Quality of care is excellent but the prices are on the higher end. Wish they had more package options for regular patients.",
        treatment_received: "Genetic Analysis",
      },
    ],
  },
  {
    name: "Evergreen Wellness Etiler",
    slug: "evergreen-wellness-etiler",
    description:
      "Holistic longevity clinic combining Eastern and Western medicine approaches. Our integrative programs include ozone therapy, cryotherapy, and comprehensive wellness assessments in a serene Etiler setting.",
    city: "Istanbul",
    country: "Turkey",
    address: "Nisbetiye Cad. No:72, Etiler, Beşiktaş",
    lat: 41.0789,
    lng: 29.0334,
    phone: "+90 212 555 0303",
    website: "https://evergreenwellness.com.tr",
    verified: true,
    cover_image_url:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=400&fit=crop",
    doctors: [
      {
        name: "Dr. Can Özkan",
        title: "Integrative Medicine Specialist",
        bio: "Bütünleyici tıp ve ozon terapisi uzmanı. 12 yıllık deneyim. Almanya'da ileri eğitim almıştır.",
        avatar_url:
          "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face",
        specialties: [
          "Ozone Therapy",
          "Integrative Medicine",
          "Cryotherapy",
        ],
      },
      {
        name: "Dr. Selin Arslan",
        title: "Anti-Aging Specialist",
        bio: "Expert in cryotherapy protocols and recovery optimization. Former sports medicine physician for Turkish national athletes.",
        avatar_url:
          "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=face",
        specialties: [
          "Cryotherapy",
          "Sports Medicine",
          "Recovery Optimization",
        ],
      },
    ],
    treatments: [
      "ozone-therapy",
      "cryotherapy",
      "iv-therapy",
      "biomarker-testing",
      "hyperbaric-oxygen",
    ],
    reviews: [
      {
        rating: 5,
        title: "Ozon terapisi mucize gibi",
        body: "Kronik yorgunluğum için ozon terapisi denedim ve sonuçlar inanılmazdı. Dr. Özkan çok ilgili ve bilgili. Etiler'deki en iyi klinik.",
        treatment_received: "Ozone Therapy",
      },
      {
        rating: 4,
        title: "Great cryotherapy sessions",
        body: "The cryo chamber is top-of-the-line. After my workout recovery improved significantly. The staff is friendly and professional.",
        treatment_received: "Cryotherapy",
      },
      {
        rating: 5,
        title: "Comprehensive wellness program",
        body: "Did their 3-month wellness program including IV therapy and biomarker testing. The results speak for themselves — better sleep, more energy, improved focus.",
        treatment_received: "IV Therapy",
      },
      {
        rating: 4,
        title: "Hiperbarik oksijen tedavisi",
        body: "Hiperbarik oksijen seansları çok rahatlatıcı. Tesisler çok temiz ve modern. Fiyatlar makul seviyede.",
        treatment_received: "Hyperbaric Oxygen",
      },
      {
        rating: 5,
        title: "My go-to wellness clinic",
        body: "Been coming here for a year now. The combination of ozone therapy and cryotherapy has been incredible for my overall health.",
        treatment_received: "Ozone Therapy",
      },
      {
        rating: 4,
        title: "Çok memnunum",
        body: "IV terapi ve biyomarker testleri yaptırdım. Sonuçlar çok detaylı geldi. Doktorlar her şeyi açık açık anlattı.",
        treatment_received: "Biomarker Testing",
      },
    ],
  },
  {
    name: "Kadıköy Longevity Lab",
    slug: "kadikoy-longevity-lab",
    description:
      "Anadolu yakasının ilk longevity kliniği. Data-driven yaklaşımımızla sağlık ömrünüzü uzatıyoruz. Genetik analiz, biyomarker takibi ve kişiselleştirilmiş tedavi protokolleri sunuyoruz.",
    city: "Istanbul",
    country: "Turkey",
    address: "Bağdat Cad. No:215, Kadıköy",
    lat: 40.9862,
    lng: 29.0562,
    phone: "+90 216 555 0404",
    website: "https://longevitylab.com.tr",
    verified: false,
    cover_image_url:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=400&fit=crop",
    doctors: [
      {
        name: "Dr. Baran Yıldız",
        title: "Longevity Medicine Specialist",
        bio: "Longevity tıbbı ve genetik analiz uzmanı. Stanford Üniversitesi'nde araştırma görevlisi olarak çalışmıştır.",
        avatar_url:
          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face",
        specialties: [
          "Genetic Analysis",
          "Longevity Medicine",
          "Biomarker Optimization",
        ],
      },
    ],
    treatments: [
      "genetic-analysis",
      "biomarker-testing",
      "nad-therapy",
      "iv-therapy",
    ],
    reviews: [
      {
        rating: 5,
        title: "Kadıköy'ün en iyisi",
        body: "Anadolu yakasında böyle bir klinik bulmak harika. Genetik analizim çok kapsamlıydı. Dr. Yıldız her soruyu sabırla yanıtladı.",
        treatment_received: "Genetic Analysis",
      },
      {
        rating: 4,
        title: "Impressive genetic analysis",
        body: "Very thorough genetic testing. They look at hundreds of SNPs and provide actionable recommendations. The facility is modern but a bit small.",
        treatment_received: "Genetic Analysis",
      },
      {
        rating: 4,
        title: "NAD+ tedavisi",
        body: "NAD+ infüzyon sonrası enerjim belirgin şekilde arttı. Personel çok ilgili. Tek eksik park yeri sorunu.",
        treatment_received: "NAD+ Therapy",
      },
      {
        rating: 5,
        title: "Data-driven approach",
        body: "Love their scientific approach. They track everything with data and you can see your progress over time through their portal.",
        treatment_received: "Biomarker Testing",
      },
    ],
  },
  {
    name: "Ankara Longevity Institute",
    slug: "ankara-longevity-institute",
    description:
      "Ankara's leading longevity and anti-aging center. We offer comprehensive health optimization programs backed by the latest research in regenerative medicine and functional diagnostics.",
    city: "Ankara",
    country: "Turkey",
    address: "Kızılay, Atatürk Bulvarı No:89",
    lat: 39.9208,
    lng: 32.854,
    phone: "+90 312 555 0505",
    website: "https://ankaralongevity.com",
    verified: true,
    cover_image_url:
      "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&h=400&fit=crop",
    doctors: [
      {
        name: "Dr. Zeynep Akar",
        title: "Anti-Aging Medicine Director",
        bio: "Anti-aging ve fonksiyonel tıp uzmanı. 18 yıllık klinik deneyim. Türkiye Anti-Aging Derneği yönetim kurulu üyesi.",
        avatar_url:
          "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=200&h=200&fit=crop&crop=face",
        specialties: [
          "Anti-Aging Medicine",
          "Functional Diagnostics",
          "Hormone Optimization",
        ],
      },
      {
        name: "Dr. Emre Şahin",
        title: "Regenerative Therapy Specialist",
        bio: "PRP and stem cell therapy expert with training in Germany and Switzerland. Published over 20 research papers.",
        avatar_url:
          "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face",
        specialties: [
          "PRP Therapy",
          "Stem Cell Therapy",
          "Regenerative Medicine",
        ],
      },
    ],
    treatments: [
      "iv-therapy",
      "prp-therapy",
      "stem-cell-therapy",
      "hormone-panel",
      "biomarker-testing",
    ],
    reviews: [
      {
        rating: 5,
        title: "Ankara'nın en iyi kliniği",
        body: "Stem cell tedavisi için geldim ve sonuçlar mükemmeldi. Dr. Şahin alanında gerçek bir uzman. Tesis çok temiz ve modern.",
        treatment_received: "Stem Cell Therapy",
      },
      {
        rating: 4,
        title: "Great PRP results",
        body: "Had PRP therapy for joint issues and the improvement was noticeable within weeks. The doctors are highly skilled and the clinic is well-maintained.",
        treatment_received: "PRP Therapy",
      },
      {
        rating: 5,
        title: "Comprehensive health optimization",
        body: "Did their full health optimization program. The hormone panel and biomarker testing revealed issues I didn't know I had. Treatment plan was excellent.",
        treatment_received: "Hormone Panel",
      },
      {
        rating: 4,
        title: "IV terapi deneyimim",
        body: "Vitamin IV tedavisi sonrası kendimi çok iyi hissettim. Klinik merkezi konumda ve ulaşımı kolay. Personel gayet ilgili.",
        treatment_received: "IV Therapy",
      },
      {
        rating: 3,
        title: "Good but could improve",
        body: "The medical care is excellent but the waiting times can be long. Wish they had a better appointment system. Doctors are great though.",
        treatment_received: "Biomarker Testing",
      },
      {
        rating: 5,
        title: "Kesinlikle tavsiye ederim",
        body: "Hormon paneli sonuçlarım çok detaylıydı. Dr. Akar tedavi planımı çok iyi açıkladı. Sonuçlardan çok memnunum.",
        treatment_received: "Hormone Panel",
      },
    ],
  },
  {
    name: "Vitalis Health Ankara",
    slug: "vitalis-health-ankara",
    description:
      "Modern longevity clinic in Çankaya, Ankara. Specializing in NAD+ protocols, ozone therapy, and advanced biomarker diagnostics. Your journey to optimal health starts here.",
    city: "Ankara",
    country: "Turkey",
    address: "Çankaya, Tunalı Hilmi Cad. No:156",
    lat: 39.9075,
    lng: 32.8598,
    phone: "+90 312 555 0606",
    website: "https://vitalishealth.com.tr",
    verified: false,
    cover_image_url:
      "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=1200&h=400&fit=crop",
    doctors: [
      {
        name: "Dr. Deniz Koç",
        title: "Ozone Therapy Specialist",
        bio: "Ozon terapisi ve NAD+ protokolleri konusunda uzman. 10 yıllık deneyim. Avrupa Ozon Terapisi Derneği üyesi.",
        avatar_url:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
        specialties: ["Ozone Therapy", "NAD+ Protocols", "IV Therapy"],
      },
    ],
    treatments: [
      "ozone-therapy",
      "nad-therapy",
      "iv-therapy",
      "biomarker-testing",
    ],
    reviews: [
      {
        rating: 4,
        title: "Good ozone therapy clinic",
        body: "Had 10 sessions of ozone therapy. Noticed improvements in energy and overall well-being. The clinic is clean and the staff is helpful.",
        treatment_received: "Ozone Therapy",
      },
      {
        rating: 5,
        title: "NAD+ mucizesi",
        body: "NAD+ infüzyon tedavisi hayatımı değiştirdi. Enerji seviyem ve mental berraklığım inanılmaz arttı. Dr. Koç çok ilgili ve bilgili.",
        treatment_received: "NAD+ Therapy",
      },
      {
        rating: 4,
        title: "Solid biomarker testing",
        body: "Good comprehensive testing but the results took a bit longer than expected. The follow-up consultation was very thorough though.",
        treatment_received: "Biomarker Testing",
      },
      {
        rating: 5,
        title: "Harika hizmet",
        body: "IV terapi ve ozon terapisi kombinasyonu yaptırdım. Sonuçlar çok iyi. Klinik çok temiz ve personel profesyonel.",
        treatment_received: "IV Therapy",
      },
    ],
  },
  {
    name: "Berlin Longevity Klinik",
    slug: "berlin-longevity-klinik",
    description:
      "Germany's cutting-edge longevity center in Berlin Mitte. Combining German medical precision with innovative anti-aging therapies. Hyperbaric oxygen, stem cell therapy, and comprehensive diagnostics.",
    city: "Berlin",
    country: "Germany",
    address: "Friedrichstraße 123, 10117 Berlin",
    lat: 52.52,
    lng: 13.405,
    phone: "+49 30 555 0707",
    website: "https://berlinlongevity.de",
    verified: true,
    cover_image_url:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=400&fit=crop",
    doctors: [
      {
        name: "Dr. Hans Müller",
        title: "Director of Longevity Medicine",
        bio: "Pioneer in European longevity medicine. 25 years of experience in regenerative therapies. Former head of anti-aging research at Charité Hospital.",
        avatar_url:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
        specialties: [
          "Longevity Medicine",
          "Hyperbaric Oxygen",
          "Stem Cell Therapy",
        ],
      },
      {
        name: "Dr. Lena Weber",
        title: "Functional Medicine Physician",
        bio: "Specialized in functional medicine and advanced diagnostics. Trained at the Institute for Functional Medicine in the US.",
        avatar_url:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
        specialties: [
          "Functional Medicine",
          "Biomarker Analysis",
          "Genetic Testing",
        ],
      },
    ],
    treatments: [
      "hyperbaric-oxygen",
      "stem-cell-therapy",
      "biomarker-testing",
      "genetic-analysis",
      "nad-therapy",
    ],
    reviews: [
      {
        rating: 5,
        title: "Best longevity clinic in Europe",
        body: "Traveled from London specifically for their hyperbaric oxygen program. The results exceeded my expectations. Dr. Müller is brilliant.",
        treatment_received: "Hyperbaric Oxygen",
      },
      {
        rating: 5,
        title: "Exceptional stem cell therapy",
        body: "Had stem cell treatment for chronic knee pain. After 3 months, the improvement is remarkable. The clinic is state-of-the-art.",
        treatment_received: "Stem Cell Therapy",
      },
      {
        rating: 4,
        title: "Thorough genetic analysis",
        body: "Very comprehensive genetic testing with actionable insights. The consultation with Dr. Weber was extremely informative. Slightly expensive but worth it.",
        treatment_received: "Genetic Analysis",
      },
      {
        rating: 5,
        title: "World-class facility",
        body: "The facility is incredible — feels like stepping into the future. Every piece of equipment is cutting-edge. Staff is professional and multilingual.",
        treatment_received: "NAD+ Therapy",
      },
      {
        rating: 4,
        title: "Great biomarker testing",
        body: "The most comprehensive blood panel I've had. They test markers that most clinics don't even know about. Highly recommend for health-conscious individuals.",
        treatment_received: "Biomarker Testing",
      },
      {
        rating: 5,
        title: "Life-changing experience",
        body: "Did their 2-week intensive program. Combination of NAD+, hyperbaric oxygen, and comprehensive diagnostics. Feel like a new person.",
        treatment_received: "Hyperbaric Oxygen",
      },
      {
        rating: 4,
        title: "Highly professional team",
        body: "German precision at its finest. Everything runs on time, the diagnostics are thorough, and the treatment plans are evidence-based.",
        treatment_received: "Biomarker Testing",
      },
    ],
  },
  {
    name: "London Regenerative Health",
    slug: "london-regenerative-health",
    description:
      "Harley Street's premier longevity and regenerative health clinic. Offering bespoke health optimization programs combining the latest in anti-aging science with personalized care.",
    city: "London",
    country: "United Kingdom",
    address: "45 Harley Street, London W1G 8QR",
    lat: 51.5194,
    lng: -0.1487,
    phone: "+44 20 7555 0808",
    website: "https://londonregenhealth.co.uk",
    verified: true,
    cover_image_url:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=400&fit=crop",
    doctors: [
      {
        name: "Dr. James Chen",
        title: "Medical Director",
        bio: "Leading longevity physician in the UK. Former NHS consultant turned longevity medicine pioneer. Published author on healthspan optimization.",
        avatar_url:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
        specialties: [
          "Longevity Medicine",
          "Hormone Optimization",
          "IV Therapy",
        ],
      },
    ],
    treatments: [
      "iv-therapy",
      "hormone-panel",
      "biomarker-testing",
      "nad-therapy",
      "genetic-analysis",
    ],
    reviews: [
      {
        rating: 5,
        title: "Harley Street excellence",
        body: "Dr. Chen is exceptional. His approach to longevity medicine is both scientific and compassionate. The IV therapy protocols are customized perfectly.",
        treatment_received: "IV Therapy",
      },
      {
        rating: 4,
        title: "Comprehensive health MOT",
        body: "Did their executive health assessment. Very thorough biomarker testing with a detailed report. The hormone optimization program has been transformative.",
        treatment_received: "Hormone Panel",
      },
      {
        rating: 5,
        title: "NAD+ game changer",
        body: "After 6 NAD+ sessions, my cognitive function and energy levels are dramatically better. The clinic itself is beautifully appointed.",
        treatment_received: "NAD+ Therapy",
      },
      {
        rating: 4,
        title: "Premium service, premium price",
        body: "The quality of care is outstanding but it comes at a price. The genetic analysis was incredibly detailed. Would love to see more accessible pricing options.",
        treatment_received: "Genetic Analysis",
      },
      {
        rating: 5,
        title: "Best biomarker testing in London",
        body: "They test an extensive panel and the results are presented beautifully with clear explanations. Follow-up care is excellent.",
        treatment_received: "Biomarker Testing",
      },
      {
        rating: 4,
        title: "Excellent overall experience",
        body: "From booking to follow-up, everything was seamless. The clinic is immaculate and the medical team is top-tier. Highly recommend.",
        treatment_received: "IV Therapy",
      },
      {
        rating: 5,
        title: "Truly personalized medicine",
        body: "What sets this clinic apart is the personalization. Every treatment plan is tailored to your unique genetics and biomarkers. This is the future of healthcare.",
        treatment_received: "Genetic Analysis",
      },
      {
        rating: 4,
        title: "Worth the investment",
        body: "Started with skepticism but the results converted me. Six months into their program and my bloodwork tells the story. Measurable improvements across the board.",
        treatment_received: "Biomarker Testing",
      },
    ],
  },
];

async function seed() {
  console.log("🌱 Starting seed...\n");

  // 1. Insert treatments
  console.log("📋 Inserting treatments...");
  const { data: insertedTreatments, error: treatmentError } = await supabase
    .from("treatments")
    .upsert(treatments, { onConflict: "slug" })
    .select();

  if (treatmentError) {
    console.error("Error inserting treatments:", treatmentError);
    return;
  }
  console.log(`  ✓ ${insertedTreatments.length} treatments inserted`);

  const treatmentMap = new Map(
    insertedTreatments.map((t: { slug: string; id: string }) => [t.slug, t.id])
  );

  // 2. Insert clinics with doctors, treatments, and reviews
  for (const clinicData of clinics) {
    const { doctors, treatments: clinicTreatmentSlugs, reviews, ...clinic } = clinicData;

    console.log(`\n🏥 Inserting clinic: ${clinic.name}`);

    // Insert clinic
    const { data: insertedClinic, error: clinicError } = await supabase
      .from("clinics")
      .upsert(clinic, { onConflict: "slug" })
      .select()
      .single();

    if (clinicError) {
      console.error(`  Error inserting clinic ${clinic.name}:`, clinicError);
      continue;
    }
    console.log(`  ✓ Clinic inserted (${insertedClinic.id})`);

    // Insert doctors
    for (const doctor of doctors) {
      const { error: doctorError } = await supabase.from("doctors").upsert(
        { ...doctor, clinic_id: insertedClinic.id },
        { onConflict: "id" }
      );
      if (doctorError) {
        console.error(`  Error inserting doctor ${doctor.name}:`, doctorError);
      } else {
        console.log(`  ✓ Doctor: ${doctor.name}`);
      }
    }

    // Insert clinic_treatments
    const clinicTreatmentRows = clinicTreatmentSlugs
      .map((slug) => ({
        clinic_id: insertedClinic.id,
        treatment_id: treatmentMap.get(slug),
      }))
      .filter((row) => row.treatment_id);

    if (clinicTreatmentRows.length > 0) {
      const { error: ctError } = await supabase
        .from("clinic_treatments")
        .upsert(clinicTreatmentRows, {
          onConflict: "clinic_id,treatment_id",
        });
      if (ctError) {
        console.error("  Error inserting clinic_treatments:", ctError);
      } else {
        console.log(
          `  ✓ ${clinicTreatmentRows.length} treatments linked`
        );
      }
    }

    // Insert reviews (using service role, no user_id for seed data)
    // We'll create reviews with a null user_id handled via service role
    for (const review of reviews) {
      const { error: reviewError } = await supabase.from("reviews").insert({
        ...review,
        clinic_id: insertedClinic.id,
        user_id: null, // Seed reviews have no real user
      });
      if (reviewError) {
        console.error(`  Error inserting review:`, reviewError);
      }
    }
    console.log(`  ✓ ${reviews.length} reviews inserted`);
  }

  console.log("\n✅ Seed completed successfully!");
}

seed().catch(console.error);
