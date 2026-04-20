import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">WLSSET Design - An Idea Realized</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Turning your ideas into a reality that sets you apart.</p>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="bg-white border-white/10 shadow-lg">
            <CardContent className="p-6 md:p-8 space-y-5">
              <div dir="rtl" className="space-y-4 text-right">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-primary">WLSSET Design فكرة تتحقق</h2>
                  <p className="text-lg text-muted-foreground">نحوّل أفكارك لتصاميم واقعية تميزك.</p>
                </div>
                <div className="space-y-3 text-base md:text-lg leading-8 text-foreground">
                  <p>في WLSSET Design نؤمن أن كل فكرة تستحق أن ترى النور. بدأنا من شغف بسيط وحلم كبير، وهدفنا ان نحول أي فكرة إلى تصميم حقيقي يعبّر عنك ويخدم مشروعك.</p>
                  <p>اسم WLSSET يعبر عن البداية، عن الطريق المستمر. هو انعكاس لرحلتنا اليومية، وسعينا الدائم نحو التطور والوصول. ومن خلال عملنا، نحول الأفكار من مجرد تصور… إلى واقع ملموس.</p>
                  <p>تصميم الشعارات، بناء الهوية البصرية، تصاميم السوشال ميديا، المطبوعات الإبداعية.</p>
                  <p>هدفنا ان نكون شركاء في نجاحك، و نساعدك في تحويل فكرتك إلى مشروع حقيقي يلفت الانتباه ويترك أثر كبير.</p>
                  <p>ولصت ديزاين – فكرة تتحقق. ابدأ فكرتك اليوم… وخليها توصل.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-white/10 shadow-lg">
            <CardContent className="p-6 md:p-8 space-y-5">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-primary">WLSSET Design - An Idea Realized</h2>
                <p className="text-lg text-muted-foreground">Turning your ideas into a reality that sets you apart.</p>
              </div>
              <div className="space-y-3 text-base md:text-lg leading-8 text-foreground">
                <p>At WLSSET Design, we believe every idea deserves to see the light. We started from a simple passion and a big dream, and our goal is to turn any idea into a real design that expresses you and serves your project.</p>
                <p>The name WLSSET represents the beginning and the continuous path. It is a reflection of our daily journey and our constant pursuit of growth and achievement. Through our work, we transform ideas from mere concepts into tangible reality.</p>
                <p>Logo Design, Brand Identity, Social Media Design, Creative Print.</p>
                <p>Our goal is to be your partner in success, helping you transform your idea into a real project that captures attention and leaves a lasting impact.</p>
                <p>WLSSET Design – An Idea Realized. Start your idea today... and let it reach its potential.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}