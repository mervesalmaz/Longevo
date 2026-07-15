export type Locale = "en" | "tr";

export const locales: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
];

export const translations = {
  en: {
    // Navbar
    nav_search_placeholder: "Where to optimize your longevity?",
    nav_search_mobile: "Search...",
    nav_join_beta: "Join Beta",
    nav_beta_badge: "Beta",
    nav_categories: "Categories",
    // Category labels
    cat_clinics: "Clinics",
    cat_diagnostics: "Diagnostics",
    cat_antiaging: "Anti-Aging",
    cat_wellness: "Wellness",
    cat_hormone: "Hormone Therapy",
    cat_genetic: "Genetic Analysis",
    cat_prp: "PRP Therapy",
    cat_all: "All Treatments",

    // Home page — Hero (new)
    home_hero_title: "Turkey's longevity guide",
    home_hero_kicker:
      "Discover clinics, tests and treatments through real biohacker experiences.",
    home_hero_subtitle:
      "From IV therapy to biomarker testing, NAD+ protocols to genetic analysis — Turkey's verified clinics, all in one place.",
    home_hero_search_placeholder: "Search clinics, treatments or cities…",
    home_hero_search_label: "Search clinics, treatments or cities",
    home_hero_chip_istanbul: "Istanbul",
    home_hero_chip_ankara: "Ankara",
    home_hero_chip_iv: "IV Therapy",
    home_hero_chip_biomarker: "Biomarker",
    home_hero_chip_nad: "NAD+ Therapy",
    home_hero_chip_all: "All treatments",
    home_hero_share_title: "Share your experience",
    home_hero_share_desc:
      "Rate a treatment you've received and help the community.",
    home_hero_share_cta: "Write a review",
    home_hero_launch_message:
      "We're mapping Turkey's longevity ecosystem. New clinics added every week.",
    home_hero_trust_1_title: "Verified reviews",
    home_hero_trust_1_desc: "Every review confirmed via email and treatment date.",
    home_hero_trust_2_title: "Licensed clinics",
    home_hero_trust_2_desc: "Ministry of Health license required.",
    home_hero_trust_3_title: "Experience, not ads",
    home_hero_trust_3_desc: "No paid rankings, ever.",
    home_quicklink_topclinics: "Top Clinics",
    home_quicklink_topclinics_cta: "Explore now",
    home_quicklink_testing: "Testing Labs",
    home_quicklink_testing_cta: "Find yours",
    home_quicklink_antiaging: "Anti-Aging",
    home_quicklink_antiaging_cta: "See reviews",
    home_quicklink_iv: "IV Therapy",
    home_quicklink_iv_cta: "Book now",
    home_destinations_title: "Top destinations for longevity",
    home_destinations_subtitle: "Popular places biohackers are visiting",
    home_destinations_see_all: "See all",
    home_destinations_providers: "providers",
    home_best_badge: "BIOHACKERS' CHOICE 2026",
    home_best_title: "Best of the Best",
    home_best_subtitle:
      "The highest-rated providers on Longevo, based on reviews and ratings from the biohacking community.",
    home_trending_title: "Trending right now",
    home_trending_subtitle: "What biohackers are searching for",
    home_ways_title: "Ways to optimize your longevity",
    home_cta_title: "Get the Longevo app",
    home_cta_subtitle:
      "Discover longevity clinics and treatments on the go. Coming soon to iOS and Android.",
    home_cta_ios: "Download on iOS",
    home_cta_android: "Download on Android",

    // Beta page
    beta_badge: "Private Beta · Coming Q3 2026",
    beta_hero_title_1: "The world's first longevity clinic",
    beta_hero_title_2: "discovery platform",
    beta_hero_subtitle:
      "Discover, compare, and book verified longevity clinics and treatments. Join our private beta and be among the first biohackers to shape the future of healthspan.",
    beta_stat_waitlist: "Beta waitlist",
    beta_stat_countries: "Countries covered",
    beta_stat_treatments: "Treatment types",
    beta_form_title: "Join the waitlist",
    beta_form_subtitle: "Be the first to know when we launch.",
    beta_form_name: "Name (optional)",
    beta_form_name_placeholder: "Your name",
    beta_form_email: "Email *",
    beta_form_email_placeholder: "you@example.com",
    beta_form_interests: "What interests you? (optional)",
    beta_form_submit: "Request Beta Access",
    beta_form_submit_loading: "Adding you to the list...",
    beta_form_privacy: "We respect your privacy. No spam, ever.",
    beta_form_duplicate:
      "You're already on the waitlist! We'll be in touch soon.",
    beta_success_title: "You're on the list!",
    beta_success_subtitle:
      "We'll email you as soon as your beta access is ready. In the meantime, explore our clinic directory.",
    beta_success_add_another: "Add Another",
    beta_success_explore: "Explore Clinics",
    beta_perks_title: "What you get as a beta member",
    beta_perk_1_title: "Early access to verified clinics",
    beta_perk_1_desc:
      "Curated longevity providers reviewed by real biohackers worldwide.",
    beta_perk_2_title: "Personalized treatment matching",
    beta_perk_2_desc:
      "Find the right clinics and therapies based on your health goals.",
    beta_perk_3_title: "Biohackers' community",
    beta_perk_3_desc:
      "Exchange real experiences, compare protocols, and learn from peers.",
    beta_step: "STEP",
    beta_step_1_title: "Join the waitlist",
    beta_step_1_desc:
      "Request access by submitting your email above.",
    beta_step_2_title: "Get invited",
    beta_step_2_desc:
      "We onboard members in batches. You'll get an invite code via email.",
    beta_step_3_title: "Start exploring",
    beta_step_3_desc:
      "Search verified clinics, read reviews, and plan your longevity journey.",
    beta_footer_cta: "Already have beta access?",
    beta_footer_link: "Explore the platform →",

    // Footer
    footer_about: "About Longevo",
    footer_about_us: "About Us",
    footer_press: "Press",
    footer_resources: "Resources",
    footer_careers: "Careers",
    footer_explore: "Explore",
    footer_treatments: "Treatments",
    footer_clinics: "Clinics",
    footer_top_destinations: "Top Destinations",
    footer_reviews: "Reviews",
    footer_business: "Do Business",
    footer_owners: "For Clinic Owners",
    footer_advertise: "Advertise",
    footer_app: "Get the App",
    footer_more: "More",
    footer_help: "Help Center",
    footer_privacy: "Privacy",
    footer_terms: "Terms",
    footer_cookies: "Cookies",
    footer_contact: "Contact",
    footer_copyright: "© 2026 Longevo. All rights reserved.",

    // Search
    search_title: "Browse Longevity Clinics",
    search_filters: "Filters",
    search_treatments: "Treatments",
    search_city: "City",
    search_all_cities: "All Cities",
    search_min_rating: "Minimum Rating",
    search_any_rating: "Any Rating",
    search_verified_only: "Verified Only",
    search_sort_rated: "Highest Rated",
    search_sort_reviewed: "Most Reviewed",
    search_sort_name: "Name (A-Z)",
    search_no_results: "No clinics found",
    search_showing: "Showing",
    search_clinics_lower: "clinics",

    // Common
    common_loading: "Loading...",
    common_home: "Home",
    common_save: "Save",
    common_share: "Share",
    common_cancel: "Cancel",
    common_browse: "Browse",

    // Clinic Detail
    clinic_new: "New",
    clinic_reviews_lower: "reviews",
    clinic_review_lower: "review",
    clinic_about: "About",
    clinic_treatments_features: "Treatments & Features",
    clinic_our_doctors: "Our Doctors",
    clinic_reviews: "Reviews",
    clinic_rating_excellent: "Excellent",
    clinic_rating_verygood: "Very Good",
    clinic_rating_average: "Average",
    clinic_rating_poor: "Poor",
    clinic_rating_terrible: "Terrible",
    clinic_no_reviews: "No reviews yet. Be the first to leave a review!",
    clinic_write_review: "Write a Review",
    clinic_contact: "Contact",
    clinic_visit_website: "Visit website",
    clinic_call: "Call",
    clinic_hours: "Hours",
    clinic_hours_weekdays: "Mon - Fri: 9:00 AM - 6:00 PM",
    clinic_hours_saturday: "Sat: 10:00 AM - 4:00 PM",
    clinic_hours_sunday: "Sun: Closed",
    clinic_biohackers_choice: "BIOHACKERS' CHOICE",

    // Home — Recent Reviews
    home_reviews_eyebrow: "Community",
    home_reviews_title: "What biohackers are saying",
    home_reviews_subtitle:
      "Real experiences from verified treatments across Turkey.",
    home_reviews_empty:
      "First reviews coming soon — beta members get early access to share their experience.",
    home_reviews_cta: "Read all reviews",

    // Home — Treatment Guides
    home_treatments_eyebrow: "Guides",
    home_treatments_title: "Treatment guides",
    home_treatments_subtitle:
      "Learn what works, what doesn't, and what's backed by science.",
    home_treatments_cta: "See all treatments",

    // Home — City Guides
    home_cities_eyebrow: "Cities",
    home_cities_title: "Longevity cities",
    home_cities_subtitle:
      "Compare clinics, specialties and prices by city.",
    home_cities_providers: "providers",

    // Home — Featured Clinics
    home_featured_eyebrow: "Featured",
    home_featured_title: "Featured clinics",
    home_featured_subtitle:
      "Verified providers with the highest member ratings.",
    home_featured_empty:
      "We're onboarding clinics now. Check back soon.",
    home_featured_cta: "Browse all clinics",

    // Home — Editorial
    home_editorial_eyebrow: "Editorial",
    home_editorial_title: "From the editorial desk",
    home_editorial_subtitle:
      "Research-backed deep dives on longevity interventions.",
    home_editorial_soon: "Coming soon",
    home_editorial_1_title: "NAD+ therapy: hype vs evidence",
    home_editorial_1_cat: "Therapies",
    home_editorial_1_read: "8 min read",
    home_editorial_2_title: "Biomarker testing: what to actually measure",
    home_editorial_2_cat: "Diagnostics",
    home_editorial_2_read: "12 min read",
    home_editorial_3_title: "How to vet a longevity clinic in 2026",
    home_editorial_3_cat: "Guides",
    home_editorial_3_read: "6 min read",

    // Home — Community
    home_community_eyebrow: "Community",
    home_community_title: "Built with biohackers, for biohackers",
    home_community_subtitle:
      "Longevo is a community-first platform. Every review is from a real visitor, every clinic is vetted by members.",
    home_community_cta: "Join the community",
    home_community_stat_1: "verified reviews",
    home_community_stat_2: "active members",
    home_community_stat_3: "cities covered",

    // Home — Clinic Owners CTA
    home_owners_eyebrow: "For clinics",
    home_owners_title: "Are you a longevity clinic?",
    home_owners_subtitle:
      "Get listed on Longevo and reach verified, high-intent biohackers looking for treatments.",
    home_owners_cta: "Get listed",
    home_owners_contact: "Already listed? Update your profile",

    // Home — Footer
    home_footer_tagline:
      "Turkey's longevity clinic discovery platform.",
    home_footer_newsletter: "Get weekly longevity insights",
    home_footer_newsletter_cta: "Subscribe",

    // Review form
    review_title: "Write a Review",
    review_choose_clinic: "Choose a clinic",
    review_clinic_label: "Clinic *",
    review_rating_label: "Your Rating *",
    review_rating_hint: "Click to rate from 1 to 5",
    review_review_title_label: "Review Title *",
    review_review_title_placeholder: "Summarize your experience",
    review_body_label: "Your Review *",
    review_body_placeholder: "Tell us about your experience in detail...",
    review_treatment_label: "Treatment Received",
    review_treatment_placeholder: "e.g. IV Therapy, NAD+, Stem Cells",
    review_verified_label: "I actually visited this clinic",
    review_submit: "Submit Review",
    review_submitting: "Submitting...",
    review_login_required:
      "You need an account to leave a review. Please contact us if you're a beta member.",
    review_success: "Review submitted! Thank you for sharing your experience.",
    review_error: "Could not submit review. Please try again.",
  },
  tr: {
    // Navbar
    nav_search_placeholder: "Uzun yaşam için nereden başlayalım?",
    nav_search_mobile: "Ara...",
    nav_join_beta: "Beta'ya Katıl",
    nav_beta_badge: "Beta",
    nav_categories: "Kategoriler",
    // Category labels
    cat_clinics: "Klinikler",
    cat_diagnostics: "Tanı",
    cat_antiaging: "Anti-Aging",
    cat_wellness: "Wellness",
    cat_hormone: "Hormon Tedavisi",
    cat_genetic: "Genetik Analiz",
    cat_prp: "PRP Tedavisi",
    cat_all: "Tüm Tedaviler",

    // Home page — Hero (new)
    home_hero_title: "Türkiye'nin longevity rehberi",
    home_hero_kicker:
      "Gerçek biohackerların deneyimleriyle klinik, test ve tedavi keşfet.",
    home_hero_subtitle:
      "IV terapiden biyobelirteç testlerine, NAD+ kürlerinden genetik analizlere — Türkiye'deki doğrulanmış klinikleri tek yerde.",
    home_hero_search_placeholder: "Klinik, tedavi veya şehir ara…",
    home_hero_search_label: "Klinik, tedavi veya şehir ara",
    home_hero_chip_istanbul: "İstanbul",
    home_hero_chip_ankara: "Ankara",
    home_hero_chip_iv: "IV Terapi",
    home_hero_chip_biomarker: "Biyobelirteç",
    home_hero_chip_nad: "NAD+ Terapi",
    home_hero_chip_all: "Tüm tedaviler",
    home_hero_share_title: "Deneyimini paylaş",
    home_hero_share_desc:
      "Aldığın bir tedaviyi değerlendir, topluluğa yardımcı ol.",
    home_hero_share_cta: "Yorum yaz",
    home_hero_launch_message:
      "Türkiye'nin longevity ekosistemini haritalandırıyoruz. Her hafta yeni klinikler ekleniyor.",
    home_hero_trust_1_title: "Doğrulanmış yorumlar",
    home_hero_trust_1_desc:
      "Her yorum e-posta ve tedavi tarihi ile onaylanır.",
    home_hero_trust_2_title: "Ruhsatlı klinikler",
    home_hero_trust_2_desc: "Sağlık Bakanlığı ruhsatı zorunlu.",
    home_hero_trust_3_title: "Reklam değil, deneyim",
    home_hero_trust_3_desc: "Ücretli sıralama yok, asla.",
    home_quicklink_topclinics: "Öne Çıkan Klinikler",
    home_quicklink_topclinics_cta: "Şimdi keşfet",
    home_quicklink_testing: "Test Laboratuvarları",
    home_quicklink_testing_cta: "Seninkini bul",
    home_quicklink_antiaging: "Anti-Aging",
    home_quicklink_antiaging_cta: "Yorumları gör",
    home_quicklink_iv: "IV Tedavi",
    home_quicklink_iv_cta: "Randevu al",
    home_destinations_title: "Uzun yaşam için en iyi şehirler",
    home_destinations_subtitle:
      "Biohackerların en çok ziyaret ettiği yerler",
    home_destinations_see_all: "Tümünü gör",
    home_destinations_providers: "klinik",
    home_best_badge: "BIOHACKER SEÇİMİ 2026",
    home_best_title: "En İyinin En İyisi",
    home_best_subtitle:
      "Longevo'da en yüksek puan alan sağlayıcılar — biohacker topluluğunun yorum ve puanlarıyla seçildi.",
    home_trending_title: "Şu an trendde",
    home_trending_subtitle: "Biohackerların aradığı her şey",
    home_ways_title: "Uzun yaşamı optimize etmenin yolları",
    home_cta_title: "Longevo uygulamasını indir",
    home_cta_subtitle:
      "Uzun yaşam kliniklerini ve tedavilerini cebinde keşfet. Yakında iOS ve Android'de.",
    home_cta_ios: "iOS'tan indir",
    home_cta_android: "Android'den indir",

    // Beta page
    beta_badge: "Özel Beta · Q3 2026'da geliyor",
    beta_hero_title_1: "Dünyanın ilk uzun yaşam kliniği",
    beta_hero_title_2: "keşif platformu",
    beta_hero_subtitle:
      "Doğrulanmış uzun yaşam kliniklerini ve tedavilerini keşfet, karşılaştır ve rezervasyon yap. Özel beta'ya katıl ve sağlıklı yaşamın geleceğini şekillendiren ilk biohackerlardan biri ol.",
    beta_stat_waitlist: "Beta bekleme listesi",
    beta_stat_countries: "Ülke kapsamı",
    beta_stat_treatments: "Tedavi türü",
    beta_form_title: "Bekleme listesine katıl",
    beta_form_subtitle: "Lansman olduğunda ilk senin haberin olsun.",
    beta_form_name: "İsim (opsiyonel)",
    beta_form_name_placeholder: "Adın",
    beta_form_email: "E-posta *",
    beta_form_email_placeholder: "sen@ornek.com",
    beta_form_interests: "Neler ilgini çekiyor? (opsiyonel)",
    beta_form_submit: "Beta Erişimi İste",
    beta_form_submit_loading: "Listeye ekleniyorsun...",
    beta_form_privacy: "Gizliliğine saygı duyarız. Asla spam göndermeyiz.",
    beta_form_duplicate:
      "Zaten bekleme listesindesin! Yakında seninle iletişime geçeceğiz.",
    beta_success_title: "Listedesin!",
    beta_success_subtitle:
      "Beta erişimin hazır olur olmaz sana e-posta göndereceğiz. Bu arada klinik dizinimize göz atabilirsin.",
    beta_success_add_another: "Başka Ekle",
    beta_success_explore: "Klinikleri Keşfet",
    beta_perks_title: "Beta üyesi olarak sana sunulanlar",
    beta_perk_1_title: "Doğrulanmış kliniklere erken erişim",
    beta_perk_1_desc:
      "Dünya çapında gerçek biohackerlar tarafından incelenmiş seçkin uzun yaşam merkezleri.",
    beta_perk_2_title: "Kişiye özel tedavi eşleşmesi",
    beta_perk_2_desc:
      "Sağlık hedeflerine göre doğru klinikleri ve terapileri bul.",
    beta_perk_3_title: "Biohacker topluluğu",
    beta_perk_3_desc:
      "Gerçek deneyimleri paylaş, protokolleri karşılaştır ve birbirinizden öğrenin.",
    beta_step: "ADIM",
    beta_step_1_title: "Bekleme listesine katıl",
    beta_step_1_desc: "Yukarıdaki formdan e-postanı gönder.",
    beta_step_2_title: "Davet al",
    beta_step_2_desc:
      "Üyeleri gruplar halinde ekliyoruz. E-posta ile davet kodunu alacaksın.",
    beta_step_3_title: "Keşfetmeye başla",
    beta_step_3_desc:
      "Doğrulanmış klinikleri ara, yorumları oku ve uzun yaşam yolculuğunu planla.",
    beta_footer_cta: "Zaten beta erişimin var mı?",
    beta_footer_link: "Platforma göz at →",

    // Footer
    footer_about: "Longevo Hakkında",
    footer_about_us: "Hakkımızda",
    footer_press: "Basın",
    footer_resources: "Kaynaklar",
    footer_careers: "Kariyer",
    footer_explore: "Keşfet",
    footer_treatments: "Tedaviler",
    footer_clinics: "Klinikler",
    footer_top_destinations: "Öne Çıkan Şehirler",
    footer_reviews: "Yorumlar",
    footer_business: "İş Ortaklığı",
    footer_owners: "Klinik Sahipleri İçin",
    footer_advertise: "Reklam Ver",
    footer_app: "Uygulamayı İndir",
    footer_more: "Daha Fazla",
    footer_help: "Yardım Merkezi",
    footer_privacy: "Gizlilik",
    footer_terms: "Şartlar",
    footer_cookies: "Çerezler",
    footer_contact: "İletişim",
    footer_copyright: "© 2026 Longevo. Tüm hakları saklıdır.",

    // Search
    search_title: "Uzun Yaşam Kliniklerini Keşfet",
    search_filters: "Filtreler",
    search_treatments: "Tedaviler",
    search_city: "Şehir",
    search_all_cities: "Tüm Şehirler",
    search_min_rating: "Minimum Puan",
    search_any_rating: "Tüm Puanlar",
    search_verified_only: "Sadece Doğrulanmış",
    search_sort_rated: "En Yüksek Puanlı",
    search_sort_reviewed: "En Çok Yorum",
    search_sort_name: "İsim (A-Z)",
    search_no_results: "Klinik bulunamadı",
    search_showing: "Gösterilen",
    search_clinics_lower: "klinik",

    // Common
    common_loading: "Yükleniyor...",
    common_home: "Ana Sayfa",
    common_save: "Kaydet",
    common_share: "Paylaş",
    common_cancel: "İptal",
    common_browse: "Keşfet",

    // Clinic Detail
    clinic_new: "Yeni",
    clinic_reviews_lower: "yorum",
    clinic_review_lower: "yorum",
    clinic_about: "Hakkında",
    clinic_treatments_features: "Tedaviler & Özellikler",
    clinic_our_doctors: "Doktorlarımız",
    clinic_reviews: "Yorumlar",
    clinic_rating_excellent: "Mükemmel",
    clinic_rating_verygood: "Çok İyi",
    clinic_rating_average: "Ortalama",
    clinic_rating_poor: "Zayıf",
    clinic_rating_terrible: "Kötü",
    clinic_no_reviews: "Henüz yorum yok. İlk yorumu sen yap!",
    clinic_write_review: "Yorum Yaz",
    clinic_contact: "İletişim",
    clinic_visit_website: "Siteyi ziyaret et",
    clinic_call: "Ara",
    clinic_hours: "Çalışma Saatleri",
    clinic_hours_weekdays: "Pzt - Cum: 09:00 - 18:00",
    clinic_hours_saturday: "Cmt: 10:00 - 16:00",
    clinic_hours_sunday: "Paz: Kapalı",
    clinic_biohackers_choice: "BIOHACKER SEÇİMİ",

    // Home — Recent Reviews
    home_reviews_eyebrow: "Topluluk",
    home_reviews_title: "Biohackerlar ne diyor",
    home_reviews_subtitle:
      "Türkiye'deki doğrulanmış tedavilerden gerçek deneyimler.",
    home_reviews_empty:
      "İlk yorumlar yakında — beta üyeler deneyimlerini paylaşmak için öncelik alır.",
    home_reviews_cta: "Tüm yorumları gör",

    // Home — Treatment Guides
    home_treatments_eyebrow: "Rehber",
    home_treatments_title: "Tedavi rehberleri",
    home_treatments_subtitle:
      "Ne işe yarıyor, ne yaramıyor — bilimin desteklediği yöntemler.",
    home_treatments_cta: "Tüm tedavileri gör",

    // Home — City Guides
    home_cities_eyebrow: "Şehirler",
    home_cities_title: "Longevity şehirleri",
    home_cities_subtitle:
      "Şehre göre klinikleri, uzmanlıkları ve fiyatları karşılaştır.",
    home_cities_providers: "klinik",

    // Home — Featured Clinics
    home_featured_eyebrow: "Öne çıkan",
    home_featured_title: "Öne çıkan klinikler",
    home_featured_subtitle:
      "Üye puanlarında en üstteki doğrulanmış sağlayıcılar.",
    home_featured_empty: "Klinikleri ekliyoruz. Yakında tekrar gel.",
    home_featured_cta: "Tüm klinikleri gez",

    // Home — Editorial
    home_editorial_eyebrow: "Editör",
    home_editorial_title: "Editörden",
    home_editorial_subtitle:
      "Longevity müdahaleleri üzerine araştırma destekli derin yazılar.",
    home_editorial_soon: "Yakında",
    home_editorial_1_title: "NAD+ terapisi: hype mi, kanıt mı?",
    home_editorial_1_cat: "Terapiler",
    home_editorial_1_read: "8 dk okuma",
    home_editorial_2_title: "Biyobelirteç testleri: gerçekten ne ölçülmeli?",
    home_editorial_2_cat: "Tanı",
    home_editorial_2_read: "12 dk okuma",
    home_editorial_3_title: "2026'da bir longevity kliniği nasıl değerlendirilir?",
    home_editorial_3_cat: "Rehber",
    home_editorial_3_read: "6 dk okuma",

    // Home — Community
    home_community_eyebrow: "Topluluk",
    home_community_title: "Biohackerlarla biohackerlar için",
    home_community_subtitle:
      "Longevo topluluk öncelikli bir platform. Her yorum gerçek bir ziyaretçiden, her klinik üyeler tarafından incelenir.",
    home_community_cta: "Topluluğa katıl",
    home_community_stat_1: "doğrulanmış yorum",
    home_community_stat_2: "aktif üye",
    home_community_stat_3: "şehir",

    // Home — Clinic Owners CTA
    home_owners_eyebrow: "Klinikler için",
    home_owners_title: "Longevity kliniği misin?",
    home_owners_subtitle:
      "Longevo'da listelen ve tedavi arayan doğrulanmış biohackerlara ulaş.",
    home_owners_cta: "Listelen",
    home_owners_contact: "Zaten listede misin? Profilini güncelle",

    // Home — Footer
    home_footer_tagline:
      "Türkiye'nin longevity keşif platformu.",
    home_footer_newsletter: "Haftalık longevity içerikleri",
    home_footer_newsletter_cta: "Abone ol",

    // Review form
    review_title: "Yorum Yaz",
    review_choose_clinic: "Klinik seç",
    review_clinic_label: "Klinik *",
    review_rating_label: "Puanın *",
    review_rating_hint: "1'den 5'e kadar puan için tıkla",
    review_review_title_label: "Yorum Başlığı *",
    review_review_title_placeholder: "Deneyimini özetle",
    review_body_label: "Yorumun *",
    review_body_placeholder: "Deneyimini detaylı anlat...",
    review_treatment_label: "Aldığın Tedavi",
    review_treatment_placeholder: "Örn. IV Tedavi, NAD+, Kök Hücre",
    review_verified_label: "Bu kliniği gerçekten ziyaret ettim",
    review_submit: "Yorumu Gönder",
    review_submitting: "Gönderiliyor...",
    review_login_required:
      "Yorum yazmak için hesap gerekli. Beta üyesiysen bizimle iletişime geç.",
    review_success: "Yorum gönderildi! Deneyimini paylaştığın için teşekkürler.",
    review_error: "Yorum gönderilemedi. Lütfen tekrar dene.",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
