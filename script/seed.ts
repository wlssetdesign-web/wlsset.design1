import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { services, aboutSections } from "../shared/schema";
import { eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set.");
  console.error("Usage: DATABASE_URL=your_connection_string npm run seed");
  process.exit(1);
}

const defaultServices = [
  {
    key: "brandIdentity",
    titleEn: "Brand Identity Design",
    titleAr: "تصميم الهوية البصرية",
    itemsEn: "Logo Design, Complete Identity, Brand Guidelines, Color & Typography, Rebranding",
    itemsAr: "تصميم الشعار، الهوية الكاملة، إرشادات العلامة التجارية، الألوان والطباعة، إعادة العلامة التجارية",
    icon: "Palette",
    sortOrder: 1,
    productOptions: "Logo Design, Brand Guidelines, Color Palette, Typography System, Rebranding",
  },
  {
    key: "printDesign",
    titleEn: "Print Design",
    titleAr: "تصميم المطبوعات",
    itemsEn: "Business Cards, Brochures & Flyers, Posters, Roll-Up Banners, Menus, Letterheads, Packaging",
    itemsAr: "بطاقات العمل، الكتيبات والمنشورات، الملصقات، لافتات الرول آب، القوائم، رؤوس الرسائل، التغليف",
    icon: "Printer",
    sortOrder: 2,
    productOptions: "Business Cards, Brochures, Posters, Menus, Flyers, Roll-Up Banners, Packaging",
  },
  {
    key: "socialMedia",
    titleEn: "Social Media Design",
    titleAr: "تصميم وسائل التواصل",
    itemsEn: "Instagram Posts/Stories, Facebook Covers, Ad Creatives, Grid Layouts",
    itemsAr: "منشورات/قصص إنستجرام، أغلفة فيسبوك، الإعلانات الإبداعية، تخطيطات الشبكة",
    icon: "Share2",
    sortOrder: 3,
    productOptions: "Instagram Posts, Instagram Stories, Facebook Covers, Ad Creatives, Content Grids",
  },
  {
    key: "imageEditing",
    titleEn: "Image Editing",
    titleAr: "تحرير الصور",
    itemsEn: "High-End Retouching, Background Removal, Color Correction, Compositing",
    itemsAr: "إعادة اللمس العالية، إزالة الخلفية، تصحيح الألوان، المركبات",
    icon: "Image",
    sortOrder: 4,
    productOptions: "Retouching, Background Removal, Color Correction, Compositing",
  },
  {
    key: "vectorTracing",
    titleEn: "Vector Tracing",
    titleAr: "تتبع المتجهات",
    itemsEn: "Logo Vectorization, Sketch to Vector, High-Res Scaling",
    itemsAr: "متجه الشعار، من الرسم إلى المتجه، القياس عالي الدقة",
    icon: "PenTool",
    sortOrder: 5,
    productOptions: "Logo Vectorization, Sketch to Vector, High-Resolution Scaling",
  },
  {
    key: "infographic",
    titleEn: "Infographic Design",
    titleAr: "تصميم الرسوم البيانية",
    itemsEn: "Data Visualization, Process Flowcharts, Educational Graphics",
    itemsAr: "تصور البيانات، مخططات العمليات، الرسومات التعليمية",
    icon: "BarChart",
    sortOrder: 6,
    productOptions: "Data Visualization, Process Flowcharts, Educational Graphics",
  },
  {
    key: "video",
    titleEn: "Video & Motion",
    titleAr: "الفيديو والحركة",
    itemsEn: "Video Editing, VFX, Intro/Outro, Social Media Video, Motion Graphics",
    itemsAr: "تحرير الفيديو، المؤثرات البصرية، المقدمات والنهايات، فيديو وسائل التواصل، الرسوميات المتحركة",
    icon: "Video",
    sortOrder: 7,
    productOptions: "Video Editing, Intro/Outro, Social Media Video, Motion Graphics, VFX",
  },
];

const defaultAboutSections = [
  {
    sectionKey: "heading",
    titleEn: "WLSSET Design – Where Ideas Happen",
    titleAr: "WLSSET Design فكرة تتحقق",
    textEn: "Transforming your vision into unique, high-impact designs.",
    textAr: "نحوّل أفكارك لتصاميم واقعية تميزك.",
    sortOrder: 1,
  },
  {
    sectionKey: "aboutUs",
    titleEn: "About Us",
    titleAr: "من نحن",
    textEn: "At WLSSET Design, we believe every idea deserves its moment in the spotlight. What started as a simple passion and a bold dream has become our mission: to turn your concepts into authentic designs that speak your language and power your projects.",
    textAr: "في WLSSET Design نؤمن أن كل فكرة تستحق أن ترى النور. بدأنا من شغف بسيط وحلم كبير، وهدفنا ان نحول أي فكرة إلى تصميم حقيقي يعبّر عنك ويخدم مشروعك.",
    sortOrder: 2,
  },
  {
    sectionKey: "story",
    titleEn: "Our Story",
    titleAr: "قصتنا",
    textEn: "WLSSET is more than just a name; it represents the start of a journey and a path that never ends. It's a reflection of our daily hustle and our drive to evolve. We don't just design; we bridge the gap between imagination and reality.",
    textAr: "اسم WLSSET يعبر عن البداية، عن الطريق المستمر. هو انعكاس لرحلتنا اليومية، وسعينا الدائم نحو التطور والوصول. ومن خلال عملنا، نحول الأفكار من مجرد تصور… إلى واقع ملموس.",
    sortOrder: 3,
  },
  {
    sectionKey: "whatWeDo",
    titleEn: "What We Do",
    titleAr: "ماذا نقدم",
    textEn: "Logo Design, Brand Identity, Social Media Content, Creative Print Media",
    textAr: "تصميم الشعار، الهوية البصرية، محتوى وسائل التواصل، المطبوعات الإبداعية",
    sortOrder: 4,
  },
  {
    sectionKey: "goal",
    titleEn: "Our Goal",
    titleAr: "هدفنا",
    textEn: "We aim to be your partners in success. We're here to help you turn your 'what if' into a 'what's next,' creating projects that capture attention and leave a lasting legacy.",
    textAr: "هدفنا ان نكون شركاء في نجاحك، و نساعدك في تحويل فكرتك إلى مشروع حقيقي يلفت الانتباه ويترك أثر كبير.",
    sortOrder: 5,
  },
  {
    sectionKey: "closing",
    titleEn: "Closing",
    titleAr: "الخاتمة",
    textEn: "WLSSET Design – An Idea Realized. Launch your idea today… and let it reach its destination.",
    textAr: "ولصت ديزاين – فكرة تتحقق. ابدأ فكرتك اليوم… وخليها توصل.",
    sortOrder: 6,
  },
];

async function seed() {
  console.log("Connecting to database...");
  const pool = new Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool);

  try {
    // Seed services
    console.log("\n--- Seeding Services ---");
    let servicesInserted = 0;
    let servicesSkipped = 0;

    for (const svc of defaultServices) {
      const existing = await db.select().from(services).where(eq(services.key, svc.key));
      if (existing.length > 0) {
        servicesSkipped++;
        continue;
      }
      await db.insert(services).values({
        key: svc.key,
        titleEn: svc.titleEn,
        titleAr: svc.titleAr,
        itemsEn: svc.itemsEn,
        itemsAr: svc.itemsAr,
        icon: svc.icon,
        sortOrder: svc.sortOrder,
        productOptions: svc.productOptions,
      });
      servicesInserted++;
      console.log(`  + ${svc.titleEn}`);
    }
    console.log(`Services: ${servicesInserted} inserted, ${servicesSkipped} already existed`);

    // Seed about sections
    console.log("\n--- Seeding About Sections ---");
    let aboutInserted = 0;
    let aboutSkipped = 0;

    for (const section of defaultAboutSections) {
      const existing = await db.select().from(aboutSections).where(eq(aboutSections.sectionKey, section.sectionKey));
      if (existing.length > 0) {
        aboutSkipped++;
        continue;
      }
      await db.insert(aboutSections).values({
        sectionKey: section.sectionKey,
        titleEn: section.titleEn,
        titleAr: section.titleAr,
        textEn: section.textEn,
        textAr: section.textAr,
        image: null,
        sortOrder: section.sortOrder,
      });
      aboutInserted++;
      console.log(`  + ${section.sectionKey} (${section.titleEn})`);
    }
    console.log(`About sections: ${aboutInserted} inserted, ${aboutSkipped} already existed`);

    console.log("\nSeed complete!");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
