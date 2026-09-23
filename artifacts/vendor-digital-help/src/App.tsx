import { type ReactNode, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Download,
  ExternalLink,
  Globe2,
  HandCoins,
  HeartHandshake,
  Landmark,
  LockKeyhole,
  Menu,
  MessageCircleMore,
  QrCode,
  PlayCircle,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  X,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

type Language = 'en' | 'hi' | 'mr';
type Topic = 'all' | 'start' | 'pay' | 'grow';
type TutorialVisual = 'phone' | 'bank' | 'pin' | 'qr' | 'safe';

type Guide = {
  id: string;
  topic: Exclude<Topic, 'all'>;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  steps: string[];
};

type TutorialStep = {
  title: string;
  description: string;
  tip: string;
  visual: TutorialVisual;
};

type UpiApp = {
  id: string;
  name: string;
  badge: string;
  description: string;
  videoUrl: string;
  officialUrl: string;
  icon: LucideIcon;
  steps: TutorialStep[];
};

const copy: Record<Language, {
  language: string;
  announcement: string;
  nav: { guides: string; tutorials: string; checklist: string; about: string; ask: string };
  heroKicker: string;
  heroTitleA: string;
  heroTitleB: string;
  heroText: string;
  primaryCta: string;
  secondaryCta: string;
  note: string;
  guideEyebrow: string;
  guideTitle: string;
  guideText: string;
  allTopics: string;
  topics: Record<Exclude<Topic, 'all'>, string>;
  processEyebrow: string;
  processTitle: string;
  processText: string;
  readinessEyebrow: string;
  readinessTitle: string;
  readinessText: string;
  checklistTitle: string;
  checklistNote: string;
  done: string;
  successTitle: string;
  successText: string;
  quoteEyebrow: string;
  quote: string;
  appsEyebrow: string;
  appsTitle: string;
  appsText: string;
  openTutorial: string;
  tutorialVideo: string;
  officialGuide: string;
  qrMakerEyebrow: string;
  qrMakerTitle: string;
  qrMakerText: string;
  qrUpiLabel: string;
  qrAmountLabel: string;
  qrGenerate: string;
  qrRegenerate: string;
  qrDownload: string;
  qrPlaceholder: string;
  qrUpiHint: string;
  qrMaxNote: string;
  qrEmpty: string;
  qrSafety: string;
  faqEyebrow: string;
  faqTitle: string;
  footerText: string;
  askTitle: string;
  askText: string;
  send: string;
  sentTitle: string;
  sentText: string;
}> = {
  en: {
    language: 'English',
    announcement: 'A patient guide for your first digital payment',
    nav: { guides: 'Guides', tutorials: 'App tutorials', checklist: 'Readiness check', about: 'Why this exists', ask: 'Ask a question' },
    heroKicker: 'For the people who keep local India moving',
    heroTitleA: 'Digital payments,',
    heroTitleB: 'without the headache.',
    heroText: 'A calm, plain-language guide for street vendors, shopkeepers, and home businesses. Learn one useful step at a time — no jargon, no pressure.',
    primaryCta: 'Find your first step',
    secondaryCta: 'See how it works',
    note: 'No bank account connection needed to learn',
    guideEyebrow: 'The useful bits',
    guideTitle: 'Small guides. Real work.',
    guideText: 'Choose what is on your mind today. Each guide takes a few minutes and explains the thing you need in words you can use with a customer.',
    allTopics: 'All guides',
    topics: { start: 'Getting started', pay: 'Taking payments', grow: 'Everyday tools' },
    processEyebrow: 'A gentler way in',
    processTitle: 'You do not need to become a digital expert.',
    processText: 'You only need the next clear step. We keep the path short, practical, and easy to come back to.',
    readinessEyebrow: 'Ready when you are',
    readinessTitle: 'Is your shop ready for a QR?',
    readinessText: 'Take this two-minute check before you print anything or change how you take money. There are no wrong answers.',
    checklistTitle: 'Your quick readiness check',
    checklistNote: 'Your answers stay on this device. We do not ask for account details.',
    done: 'Complete',
    successTitle: 'You are ready for the next step.',
    successText: 'Nice work. Start with the QR guide, then ask a trusted person to stand with you for the first payment.',
    quoteEyebrow: 'Why this exists',
    quote: '“I wanted something I could show my daughter when I got stuck — not another app telling me I was behind.”',
    appsEyebrow: 'App-by-app setup',
    appsTitle: 'Choose your UPI app. Take one clear step at a time.',
    appsText: 'Registration looks a little different in each app. Open a tutorial below and follow it in order, from mobile verification to your first QR.',
    openTutorial: 'Open step-by-step guide',
    tutorialVideo: 'Tutorial video',
    officialGuide: 'Official help',
    qrMakerEyebrow: 'A useful little tool',
    qrMakerTitle: 'Make a QR for a fixed amount.',
    qrMakerText: 'Enter your UPI ID and the amount your customer should pay. The QR keeps the amount ready so there is less room for mistakes.',
    qrUpiLabel: 'Your UPI ID',
    qrAmountLabel: 'Amount in rupees',
    qrGenerate: 'Generate QR code',
    qrRegenerate: 'Generate again',
    qrDownload: 'Download QR',
    qrPlaceholder: '9876543210@upi',
    qrUpiHint: 'Use the real UPI ID shown inside your payment app — not a bank account number.',
    qrMaxNote: 'Maximum amount: ₹20,000',
    qrEmpty: 'Your QR will appear here',
    qrSafety: 'This tool runs in your browser. We do not save your UPI ID or amount.',
    faqEyebrow: 'Good to know',
    faqTitle: 'Questions people ask before they start',
    footerText: 'Built with patience for the corner shops, carts, counters, and kitchens that make a neighbourhood feel like home.',
    askTitle: 'Ask a simple question',
    askText: 'This is a practice space, not a bank. Write what feels confusing and we will show a friendly next step.',
    send: 'Show me the next step',
    sentTitle: 'That is a good question.',
    sentText: 'For now, take a look at the guide cards above. The answer is usually one small step away.',
  },
  hi: {
    language: 'हिन्दी',
    announcement: 'आपके पहले डिजिटल पेमेंट के लिए आसान मदद',
    nav: { guides: 'गाइड', tutorials: 'ऐप ट्यूटोरियल', checklist: 'तैयारी जाँचें', about: 'यह क्यों है', ask: 'सवाल पूछें' },
    heroKicker: 'जो लोग अपने बाज़ार को चलाते हैं, उनके लिए',
    heroTitleA: 'डिजिटल पेमेंट,',
    heroTitleB: 'बिना परेशानी के।',
    heroText: 'स्ट्रीट वेंडर, दुकानदार और घर से काम करने वालों के लिए सरल भाषा में मदद। एक बार में एक आसान कदम — बिना कठिन शब्दों और दबाव के।',
    primaryCta: 'पहला कदम चुनें',
    secondaryCta: 'यह कैसे काम करता है',
    note: 'सीखने के लिए बैंक खाता जोड़ने की जरूरत नहीं',
    guideEyebrow: 'काम की बातें',
    guideTitle: 'छोटी गाइड। असली काम।',
    guideText: 'आज जो जानना है, उसे चुनें। हर गाइड कुछ मिनट में पढ़ी जा सकती है और ग्राहक से बात करते समय काम आएगी।',
    allTopics: 'सभी गाइड',
    topics: { start: 'शुरुआत', pay: 'पेमेंट लेना', grow: 'रोज़ के टूल' },
    processEyebrow: 'आसान शुरुआत',
    processTitle: 'आपको डिजिटल एक्सपर्ट बनने की जरूरत नहीं।',
    processText: 'बस अगला साफ कदम उठाइए। रास्ता छोटा, उपयोगी और फिर से देखने में आसान रखा है।',
    readinessEyebrow: 'जब आप तैयार हों',
    readinessTitle: 'क्या आपकी दुकान QR के लिए तैयार है?',
    readinessText: 'QR लगाने या पैसे लेने का तरीका बदलने से पहले यह दो मिनट की जाँच करें। यहाँ कोई गलत जवाब नहीं है।',
    checklistTitle: 'तैयारी की छोटी जाँच',
    checklistNote: 'आपके जवाब इसी डिवाइस में रहते हैं। हम खाते की जानकारी नहीं पूछते।',
    done: 'पूरा',
    successTitle: 'आप अगले कदम के लिए तैयार हैं।',
    successText: 'बहुत अच्छा। पहले QR गाइड देखें और पहले पेमेंट के समय किसी भरोसेमंद व्यक्ति को साथ रखें।',
    quoteEyebrow: 'यह क्यों है',
    quote: '“मैं चाहती थी कि अटकने पर बेटी को कुछ दिखा सकूँ — कोई ऐसा ऐप नहीं जो मुझे पीछे बताए।”',
    appsEyebrow: 'ऐप के हिसाब से शुरुआत',
    appsTitle: 'अपना UPI ऐप चुनें। एक बार में एक कदम।',
    appsText: 'हर ऐप में registration थोड़ा अलग होता है। नीचे से एक गाइड खोलें और mobile verification से पहले QR तक क्रम से चलें।',
    openTutorial: 'पूरी step-by-step गाइड',
    tutorialVideo: 'Tutorial video',
    officialGuide: 'Official help',
    qrMakerEyebrow: 'एक आसान टूल',
    qrMakerTitle: 'एक तय रकम के लिए QR बनाएं।',
    qrMakerText: 'अपना UPI ID और ग्राहक से ली जाने वाली रकम लिखें। रकम QR में शामिल होगी, जिससे गलती की गुंजाइश कम होगी।',
    qrUpiLabel: 'आपका UPI ID',
    qrAmountLabel: 'रकम (रुपये में)',
    qrGenerate: 'QR कोड बनाएं',
    qrRegenerate: 'फिर से बनाएं',
    qrDownload: 'QR डाउनलोड करें',
    qrPlaceholder: '9876543210@upi',
    qrUpiHint: 'अपने payment app में दिखने वाला असली UPI ID डालें — bank account number नहीं।',
    qrMaxNote: 'अधिकतम रकम: ₹20,000',
    qrEmpty: 'आपका QR यहाँ दिखाई देगा',
    qrSafety: 'यह टूल आपके ब्राउज़र में चलता है। हम आपका UPI ID या रकम सेव नहीं करते।',
    faqEyebrow: 'जानना अच्छा है',
    faqTitle: 'शुरू करने से पहले पूछे जाने वाले सवाल',
    footerText: 'उन छोटी दुकानों, ठेलों और घर की रसोइयों के लिए, जो मोहल्ले को अपना बनाते हैं।',
    askTitle: 'एक आसान सवाल पूछें',
    askText: 'यह अभ्यास की जगह है, बैंक नहीं। जो समझ नहीं आ रहा, लिखें और हम अगला आसान कदम बताएँगे।',
    send: 'अगला कदम दिखाएँ',
    sentTitle: 'यह अच्छा सवाल है।',
    sentText: 'अभी ऊपर दी गई गाइड देखें। जवाब अक्सर एक छोटे कदम की दूरी पर होता है।',
  },
  mr: {
    language: 'मराठी',
    announcement: 'तुमच्या पहिल्या डिजिटल पेमेंटसाठी सोपी मदत',
    nav: { guides: 'मार्गदर्शक', tutorials: 'अॅप ट्यूटोरियल', checklist: 'तयारी तपासा', about: 'हे का आहे', ask: 'प्रश्न विचारा' },
    heroKicker: 'आपला बाजार चालवणाऱ्या लोकांसाठी',
    heroTitleA: 'डिजिटल पेमेंट,',
    heroTitleB: 'आता सोप्या पद्धतीने.',
    heroText: 'फेरीवाले, दुकानदार आणि घरातून काम करणाऱ्यांसाठी साध्या भाषेतील मार्गदर्शन. एका वेळी एक उपयोगी पाऊल — अवघड शब्द नाहीत, घाई नाही.',
    primaryCta: 'पहिले पाऊल निवडा',
    secondaryCta: 'हे कसे चालते',
    note: 'शिकण्यासाठी बँक खाते जोडण्याची गरज नाही',
    guideEyebrow: 'उपयोगी गोष्टी',
    guideTitle: 'छोटे मार्गदर्शक. खरे काम.',
    guideText: 'आजची गरज निवडा. प्रत्येक मार्गदर्शक काही मिनिटांत वाचता येतो आणि ग्राहकांशी बोलताना उपयोगी पडतो.',
    allTopics: 'सर्व मार्गदर्शक',
    topics: { start: 'सुरुवात', pay: 'पेमेंट घेणे', grow: 'रोजची साधने' },
    processEyebrow: 'सोपे पहिले पाऊल',
    processTitle: 'तुम्हाला डिजिटल तज्ज्ञ होण्याची गरज नाही.',
    processText: 'फक्त पुढचे स्पष्ट पाऊल घ्या. हा प्रवास छोटा, उपयोगी आणि पुन्हा पाहायला सोपा आहे.',
    readinessEyebrow: 'तुम्ही तयार असाल तेव्हा',
    readinessTitle: 'तुमचे दुकान QR साठी तयार आहे का?',
    readinessText: 'QR लावण्यापूर्वी ही दोन मिनिटांची तपासणी करा. कोणतेही उत्तर चुकीचे नाही.',
    checklistTitle: 'तुमची छोटी तयारी तपासणी',
    checklistNote: 'तुमची उत्तरे याच डिव्हाइसवर राहतात. आम्ही खात्याची माहिती विचारत नाही.',
    done: 'पूर्ण',
    successTitle: 'तुम्ही पुढच्या पावलासाठी तयार आहात.',
    successText: 'छान. आधी QR मार्गदर्शक पाहा आणि पहिल्या पेमेंटवेळी विश्वासू व्यक्तीला सोबत ठेवा.',
    quoteEyebrow: 'हे का आहे',
    quote: '“अडचण आली तर मुलीला दाखवता यावे असे मला वाटत होते — मागे असल्यासारखे वाटवणारे अजून एक अॅप नको.”',
    appsEyebrow: 'अॅपनुसार सुरुवात',
    appsTitle: 'तुमचे UPI अॅप निवडा. एका वेळी एक पाऊल.',
    appsText: 'प्रत्येक अॅपमध्ये registration थोडे वेगळे असते. खालील मार्गदर्शक उघडा आणि mobile verification पासून QR पर्यंत क्रमाने जा.',
    openTutorial: 'पूर्ण step-by-step मार्गदर्शक',
    tutorialVideo: 'Tutorial video',
    officialGuide: 'Official help',
    qrMakerEyebrow: 'एक उपयुक्त साधन',
    qrMakerTitle: 'ठराविक रकमेसाठी QR तयार करा.',
    qrMakerText: 'तुमचा UPI ID आणि ग्राहकाने द्यायची रक्कम लिहा. रक्कम QR मध्ये समाविष्ट होईल, त्यामुळे चुका कमी होतील.',
    qrUpiLabel: 'तुमचा UPI ID',
    qrAmountLabel: 'रक्कम (रुपयांत)',
    qrGenerate: 'QR कोड तयार करा',
    qrRegenerate: 'पुन्हा तयार करा',
    qrDownload: 'QR डाउनलोड करा',
    qrPlaceholder: '9876543210@upi',
    qrUpiHint: 'तुमच्या payment app मध्ये दिसणारा खरा UPI ID वापरा — bank account number नाही.',
    qrMaxNote: 'कमाल रक्कम: ₹20,000',
    qrEmpty: 'तुमचा QR येथे दिसेल',
    qrSafety: 'हे साधन तुमच्या ब्राउझरमध्ये चालते. आम्ही तुमचा UPI ID किंवा रक्कम सेव्ह करत नाही.',
    faqEyebrow: 'उपयोगी माहिती',
    faqTitle: 'सुरुवात करण्यापूर्वी विचारले जाणारे प्रश्न',
    footerText: 'आपला परिसर घरासारखा वाटावा यासाठी काम करणाऱ्या छोट्या दुकानांसाठी, गाड्यांसाठी आणि घरगुती व्यवसायांसाठी.',
    askTitle: 'एक सोपा प्रश्न विचारा',
    askText: 'ही सरावाची जागा आहे, बँक नाही. काय गोंधळात टाकते ते लिहा आणि आम्ही पुढचे पाऊल सांगू.',
    send: 'पुढचे पाऊल दाखवा',
    sentTitle: 'हा चांगला प्रश्न आहे.',
    sentText: 'आत्तासाठी वरचे मार्गदर्शक पाहा. उत्तर अनेकदा एका छोट्या पावलावर असते.',
  },
};

const guides: Guide[] = [
  {
    id: 'upi-basics',
    topic: 'start',
    icon: Smartphone,
    title: 'UPI in plain language',
    description: 'What UPI is, what you need to begin, and the three words you will hear most often.',
    time: '4 min read',
    steps: ['UPI is a way to move money between bank accounts using a phone.', 'Choose one trusted UPI app and use the mobile number linked to your bank.', 'Never share your UPI PIN. You only enter it when you are sending money.'],
  },
  {
    id: 'qr-payments',
    topic: 'pay',
    icon: QrCode,
    title: 'Put your QR to work',
    description: 'A simple setup for displaying a QR and checking that a customer payment is real.',
    time: '5 min read',
    steps: ['Get a QR from your bank or trusted payment app — do not print a random one.', 'Keep it where customers can see it, dry, flat, and facing the counter.', 'Check the payment in your own app or bank message before handing over the goods.'],
  },
  {
    id: 'payment-safety',
    topic: 'pay',
    icon: ShieldCheck,
    title: 'Stay safe from payment tricks',
    description: 'The small checks that protect you from screenshots, fake calls, and “collect” requests.',
    time: '3 min read',
    steps: ['A screenshot is not proof. Look for the payment in your own app.', 'To receive money, you never need to enter a PIN or scan someone else’s QR.', 'If a caller creates urgency, pause and ask someone you trust before tapping.'],
  },
  {
    id: 'daily-records',
    topic: 'grow',
    icon: BookOpen,
    title: 'Keep a simple daily record',
    description: 'A five-minute habit to see what came in, what went out, and what to restock.',
    time: '4 min read',
    steps: ['At closing time, write down cash sales and digital sales separately.', 'Circle the money that is still due to you. Follow up kindly the next day.', 'Keep one weekly total. It is enough to notice useful patterns.'],
  },
  {
    id: 'phone-confidence',
    topic: 'start',
    icon: Smartphone,
    title: 'Make your phone easier',
    description: 'A few settings that make small text, notifications, and payment sounds easier to notice.',
    time: '3 min read',
    steps: ['Turn up text size and screen brightness before you begin.', 'Keep your payment app on the first screen so it is easy to find.', 'Ask a trusted person to help you set a screen lock.'],
  },
  {
    id: 'business-apps',
    topic: 'grow',
    icon: Store,
    title: 'Choose your next app',
    description: 'A calm way to decide if an app helps your business, before you spend time learning it.',
    time: '4 min read',
    steps: ['Name the one problem you want the app to solve first.', 'Check who made it and what permissions it asks for.', 'Try it for one week. Keep it only if it saves you time or mistakes.'],
  },
];

const upiApps: UpiApp[] = [
  {
    id: 'google-pay',
    name: 'Google Pay',
    badge: 'Google Pay / GPay',
    description: 'Set up GPay with the mobile number linked to your bank, then find your UPI ID and QR.',
    icon: Smartphone,
    videoUrl: 'https://www.youtube.com/results?search_query=Google+Pay+India+UPI+registration+add+bank+account+tutorial',
    officialUrl: 'https://support.google.com/pay/india/answer/7293696?co=GENIE.Platform%3DAndroid&hl=en',
    steps: [
      { title: 'Install and register', description: 'Install Google Pay from the official app store. Open it, choose the mobile number linked to your bank, and allow the verification SMS.', tip: 'The SIM with your bank-linked number must be in this phone.', visual: 'phone' },
      { title: 'Add your bank account', description: 'Tap your profile picture, choose Add bank account, select your bank, and let GPay verify the number by SMS.', tip: 'If your bank is not listed, check your internet and try again later.', visual: 'bank' },
      { title: 'Create your UPI PIN', description: 'Select the account, tap Set UPI PIN, and enter the debit card details requested by the app. Complete the OTP step.', tip: 'Your UPI PIN is private. No customer, caller, or helper needs to know it.', visual: 'pin' },
      { title: 'Find your UPI ID and QR', description: 'Open your profile and select the bank account. Your UPI ID and payment QR are shown there. Use the QR generator on this page for a fixed amount.', tip: 'Before giving goods, check the payment inside GPay or your bank message.', visual: 'qr' },
    ],
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    badge: 'PhonePe',
    description: 'A clear setup path for PhonePe users who want to link a bank account and receive payments.',
    icon: WalletCards,
    videoUrl: 'https://www.youtube.com/results?search_query=PhonePe+UPI+registration+add+bank+account+tutorial',
    officialUrl: 'https://www.phonepe.com/how-to-pay/add-bank-account',
    steps: [
      { title: 'Install and verify your number', description: 'Install PhonePe from the official app store. Open it with the mobile number that is registered with your bank.', tip: 'Do not use a different number just because it is active on another phone.', visual: 'phone' },
      { title: 'Link your bank account', description: 'Tap your profile picture, open Bank Accounts or Add Bank Account, choose your bank, and allow SMS verification.', tip: 'Keep the phone connected to the internet while the bank account is being found.', visual: 'bank' },
      { title: 'Set a UPI PIN', description: 'Choose the linked account and select Set or Reset UPI PIN. Enter your debit card information and the OTP requested.', tip: 'Never type your UPI PIN when receiving money.', visual: 'pin' },
      { title: 'Open My QR', description: 'From the PhonePe home screen, choose your QR or Receive Money option. Check the UPI ID shown before printing or sharing it.', tip: 'Scan your own QR with a trusted person once before putting it at the counter.', visual: 'qr' },
    ],
  },
  {
    id: 'paytm',
    name: 'Paytm',
    badge: 'Paytm UPI',
    description: 'Learn the Paytm UPI setup flow and how to check your account before accepting a payment.',
    icon: HandCoins,
    videoUrl: 'https://www.youtube.com/results?search_query=Paytm+UPI+registration+add+bank+account+tutorial',
    officialUrl: 'https://paytm.com/blog/money-transfer/upi-money-transfer/upi-registration-set-up-upi-account',
    steps: [
      { title: 'Open Paytm UPI', description: 'Install the Paytm app, sign in with your bank-linked mobile number, and open the UPI or Payments section.', tip: 'Only download Paytm from the official app store.', visual: 'phone' },
      { title: 'Choose your bank', description: 'Tap Add bank account or Activate UPI, select your bank, and let Paytm verify the mobile number by SMS.', tip: 'If more than one account appears, choose the account you use for your shop.', visual: 'bank' },
      { title: 'Make a UPI PIN', description: 'Select your account, tap Create UPI PIN, and complete the debit card and OTP steps shown in the app.', tip: 'Cover the screen when entering your PIN at a busy counter.', visual: 'pin' },
      { title: 'Find your UPI QR', description: 'Go to UPI or Receive Money and open your personal QR. Check the linked UPI ID and use the fixed-amount QR maker above when needed.', tip: 'A payment screenshot is not proof. Check Paytm itself.', visual: 'qr' },
    ],
  },
  {
    id: 'bhim',
    name: 'BHIM',
    badge: 'BHIM UPI',
    description: 'The official BHIM app guide for registration, bank linking, UPI PIN setup, and receiving money.',
    icon: Landmark,
    videoUrl: 'https://www.youtube.com/results?search_query=BHIM+UPI+registration+add+bank+account+tutorial',
    officialUrl: 'https://www.bhimupi.org.in/',
    steps: [
      { title: 'Install and choose a language', description: 'Install BHIM from the official app store, choose a language, and verify the mobile number linked to your bank.', tip: 'Ask a trusted person to help read the screen, but enter your own PIN.', visual: 'phone' },
      { title: 'Select your bank account', description: 'Open Bank Account or My Profile, choose your bank, and let BHIM find the account linked to your mobile number.', tip: 'The bank account and mobile number must match for setup to work.', visual: 'bank' },
      { title: 'Set the UPI PIN', description: 'Choose Set UPI PIN and enter the debit card details and OTP requested by BHIM.', tip: 'A UPI PIN approves money going out. It is not needed to receive money.', visual: 'pin' },
      { title: 'Use My QR', description: 'Open My QR or Receive Money to show your BHIM QR. Check the name and UPI ID before sharing it.', tip: 'Check the incoming payment in BHIM or your bank statement before handing over goods.', visual: 'qr' },
    ],
  },
  {
    id: 'amazon-pay',
    name: 'Amazon Pay',
    badge: 'Amazon Pay UPI',
    description: 'A simple Amazon Pay UPI setup guide for users who want to connect their bank inside the Amazon app.',
    icon: CreditCard,
    videoUrl: 'https://www.youtube.com/results?search_query=Amazon+Pay+UPI+registration+add+bank+account+tutorial',
    officialUrl: 'https://www.amazon.in/gp/help/customer/display.html?nodeId=TjphZTDDIuxzTI5Oej',
    steps: [
      { title: 'Open Amazon Pay', description: 'Open the Amazon app, go to Amazon Pay, and choose the UPI setup option. Verify the mobile number linked to your bank.', tip: 'Keep the same SIM in the phone during setup.', visual: 'phone' },
      { title: 'Connect your bank', description: 'Select your bank from the list and allow the app to send the verification SMS. Choose the account you want to use.', tip: 'If the account is not found, confirm your bank has the same mobile number.', visual: 'bank' },
      { title: 'Create your UPI PIN', description: 'Follow the debit card and OTP instructions to create the UPI PIN for the selected account.', tip: 'Amazon or a customer will never need your UPI PIN to send money to you.', visual: 'pin' },
      { title: 'Check the receive option', description: 'Open Amazon Pay UPI and look for your UPI ID or QR. If your version does not show a receive QR, use the QR from your bank or another UPI app.', tip: 'App menus can change. Use the official help link if a button has moved.', visual: 'qr' },
    ],
  },
];

const checklist = [
  { id: 'phone', title: 'I have a phone I can use every day', detail: 'It has a screen lock and enough battery for the day.' },
  { id: 'number', title: 'My mobile number is linked to my bank account', detail: 'If you are not sure, ask your bank — never guess your PIN.' },
  { id: 'place', title: 'I have a safe place to show a QR', detail: 'Customers can see it, but it cannot be easily moved or replaced.' },
  { id: 'helper', title: 'I know one person I can ask for help', detail: 'A family member, neighbour, or trusted shopkeeper is enough.' },
];

const faqs = [
  ['Do I have to accept digital payments?', 'No. You can learn first and decide what works for your business. A QR is one option, not a rule.'],
  ['What if a customer says they paid but I cannot see it?', 'Wait a moment, check your own payment app or bank message, and ask the customer to try again only after you have checked. Never rely on a screenshot alone.'],
  ['Can I learn without connecting my bank account here?', 'Yes. Vendor Digital Help is only an information guide. We do not connect to your bank or ask for account details.'],
  ['What is a UPI PIN?', 'It is a private number used to approve money being sent from your account. Keep it secret, like your ATM PIN.'],
  ['What should I do if I make a mistake?', 'Pause. Do not keep tapping. Ask a trusted person, your bank, or the official support number for the app you use.'],
];

const queryClient = new QueryClient();

const tutorialVisuals: Record<TutorialVisual, { icon: LucideIcon; label: string }> = {
  phone: { icon: Smartphone, label: 'Mobile verification' },
  bank: { icon: Landmark, label: 'Choose your bank' },
  pin: { icon: LockKeyhole, label: 'Private UPI PIN' },
  qr: { icon: QrCode, label: 'Your payment QR' },
  safe: { icon: ShieldCheck, label: 'Safety check' },
};

function TutorialStepArt({ visual, step, title }: { visual: TutorialVisual; step: number; title: string }) {
  const art = tutorialVisuals[visual];
  const ArtIcon = art.icon;

  return (
    <div className={`tutorial-art tutorial-art-${visual}`} role="img" aria-label={`${title}: ${art.label}`}>
      <div className="tutorial-art-top">
        <span>STEP {String(step).padStart(2, '0')}</span>
        <span>{art.label}</span>
      </div>
      <div className="tutorial-art-screen">
        <div className="tutorial-art-icon"><ArtIcon size={24} /></div>
        <div className="tutorial-art-line wide" />
        <div className="tutorial-art-line" />
        <div className="tutorial-art-button" />
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="brand-mark" data-testid="brand-vendor-digital-help">
      <span className="brand-symbol"><QrCode size={20} strokeWidth={2.4} /></span>
      <span className="brand-name">Vendor Digital Help<span className="brand-sub">learn it at your pace</span></span>
    </div>
  );
}

function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<Topic>('all');
  const [openGuide, setOpenGuide] = useState<Guide | null>(null);
  const [openUpiApp, setOpenUpiApp] = useState<UpiApp | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpSent, setHelpSent] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState('');
  const t = copy[language];
  const completeCount = checklist.filter((item) => checked[item.id]).length;
  const filteredGuides = useMemo(
    () => activeTopic === 'all' ? guides : guides.filter((guide) => guide.topic === activeTopic),
    [activeTopic],
  );

  const jumpTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleCheck = (id: string) => {
    setChecked((current) => ({ ...current, [id]: !current[id] }));
  };

  const generateQr = async () => {
    const cleanedUpiId = upiId.trim();
    const numericAmount = Number(amount);

    const upiIdPattern = /^[A-Za-z0-9][A-Za-z0-9._-]{1,254}@[A-Za-z0-9][A-Za-z0-9.-]{1,63}$/;
    const isExampleUpiId = ['yourname@bank', '9876543210@upi', 'merchant@upi'].includes(cleanedUpiId.toLowerCase());

    if (!upiIdPattern.test(cleanedUpiId) || isExampleUpiId) {
      setQrError('Enter your real UPI ID from your payment app. The example text cannot receive payments.');
      setQrDataUrl(null);
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount < 1 || numericAmount > 20000) {
      setQrError('Enter an amount between ₹1 and ₹20,000.');
      setQrDataUrl(null);
      return;
    }

    try {
      const payeeName = cleanedUpiId.split('@')[0].replace(/[._-]+/g, ' ') || 'Vendor';
      const upiUrl = `upi://pay?pa=${encodeURIComponent(cleanedUpiId)}&pn=${encodeURIComponent(payeeName)}&am=${numericAmount.toFixed(2)}&cu=INR&mode=02&purpose=00`;
      const dataUrl = await QRCode.toDataURL(upiUrl, {
        width: 280,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#162338', light: '#fffdf7' },
      });
      setQrDataUrl(dataUrl);
      setQrError('');
    } catch {
      setQrError('We could not make that QR yet. Please check the details and try again.');
      setQrDataUrl(null);
    }
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `vendor-payment-qr-${amount || 'amount'}.png`;
    link.click();
  };

  return (
    <div className="app-shell">
      <div className="top-strip">
        <div className="section-wrap flex min-h-9 items-center justify-center gap-2 text-center">
          <Sparkles size={13} />
          <span data-testid="text-announcement">{t.announcement}</span>
        </div>
      </div>

      <header className="site-header">
        <div className="section-wrap nav-inner">
          <button className="border-0 bg-transparent p-0" onClick={() => jumpTo('top')} data-testid="button-home">
            <Logo />
          </button>
          <nav className="nav-links" aria-label="Primary navigation">
            <button className="nav-link border-0 bg-transparent p-0" onClick={() => jumpTo('guides')} data-testid="link-guides">{t.nav.guides}</button>
            <button className="nav-link border-0 bg-transparent p-0" onClick={() => jumpTo('upi-apps')} data-testid="link-upi-tutorials">{t.nav.tutorials}</button>
            <button className="nav-link border-0 bg-transparent p-0" onClick={() => jumpTo('readiness')} data-testid="link-checklist">{t.nav.checklist}</button>
            <button className="nav-link border-0 bg-transparent p-0" onClick={() => jumpTo('why')} data-testid="link-about">{t.nav.about}</button>
          </nav>
          <div className="flex items-center gap-2">
            <div className="language-control">
              <button className="language-button" onClick={() => setLanguageOpen((value) => !value)} aria-expanded={languageOpen} data-testid="button-language">
                <Globe2 size={14} />
                <span>{t.language}</span>
                <ChevronDown size={13} />
              </button>
              {languageOpen && (
                <div className="language-menu" role="menu" data-testid="menu-language">
                  {(['en', 'hi', 'mr'] as Language[]).map((item) => (
                    <button
                      className={`language-option ${language === item ? 'active' : ''}`}
                      key={item}
                      onClick={() => { setLanguage(item); setLanguageOpen(false); }}
                      data-testid={`button-language-${item}`}
                    >
                      {copy[item].language}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="menu-button" onClick={() => setMobileOpen((value) => !value)} aria-label="Open navigation" data-testid="button-mobile-menu">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="mobile-nav">
            <div className="section-wrap">
              <button className="border-0 bg-transparent p-0" onClick={() => jumpTo('guides')} data-testid="mobile-link-guides">{t.nav.guides}</button>
              <button className="border-0 bg-transparent p-0" onClick={() => jumpTo('upi-apps')} data-testid="mobile-link-upi-tutorials">{t.nav.tutorials}</button>
              <button className="border-0 bg-transparent p-0" onClick={() => jumpTo('readiness')} data-testid="mobile-link-checklist">{t.nav.checklist}</button>
              <button className="border-0 bg-transparent p-0" onClick={() => jumpTo('why')} data-testid="mobile-link-about">{t.nav.about}</button>
              <button className="border-0 bg-transparent p-0" onClick={() => { setHelpOpen(true); setMobileOpen(false); }} data-testid="mobile-button-ask">{t.nav.ask}</button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="hero">
          <div className="section-wrap hero-grid">
            <div className="hero-copy">
              <div className="hero-kicker eyebrow"><span className="hero-kicker-dot" />{t.heroKicker}</div>
              <h1 className="hero-title" data-testid="text-hero-title">{t.heroTitleA}<br /><em>{t.heroTitleB}</em></h1>
              <p className="hero-text" data-testid="text-hero-description">{t.heroText}</p>
              <div className="hero-actions">
                <button className="button-primary" onClick={() => jumpTo('guides')} data-testid="button-hero-primary">
                  {t.primaryCta} <ArrowRight size={16} />
                </button>
                <button className="button-secondary" onClick={() => jumpTo('how-it-works')} data-testid="button-hero-secondary">
                  {t.secondaryCta}
                </button>
              </div>
              <div className="hero-note"><ShieldCheck size={14} />{t.note}</div>
            </div>
            <div className="phone-stage" aria-label="Illustration of a simple payment app">
              <div className="orbit" />
              <div className="float-chip chip-one"><BadgeCheck size={15} /> Simple steps</div>
              <div className="float-chip chip-two"><HandCoins size={15} /> Payment received</div>
              <div className="phone">
                <div className="phone-notch" />
                <div className="phone-screen">
                  <div className="phone-top"><span>10:42</span><span>•••</span></div>
                  <div className="payment-card"><small>Today’s digital sales</small><strong>₹ 1,280</strong></div>
                  <div className="eyebrow" style={{ fontSize: '.48rem', color: 'hsl(174 82% 27%)' }}>YOUR SHOP QR</div>
                  <div className="phone-qr" aria-hidden="true">
                    {Array.from({ length: 49 }, (_, index) => <i key={index} />)}
                  </div>
                  <div className="phone-caption">Scan to pay • Check your app</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="trust-row">
          <div className="section-wrap trust-items">
            <span className="trust-item"><HeartHandshake size={15} /> Patient, not pushy</span>
            <span className="trust-item"><ShieldCheck size={15} /> Safety before speed</span>
            <span className="trust-item"><MessageCircleMore size={15} /> Words you can use</span>
            <span className="trust-item"><Landmark size={15} /> No financial connection</span>
          </div>
        </div>

        <section className="section" id="guides">
          <div className="section-wrap">
            <div className="section-heading">
              <div className="eyebrow eyebrow-accent">{t.guideEyebrow}</div>
              <h2>{t.guideTitle}</h2>
              <p>{t.guideText}</p>
            </div>
            <div className="topic-tabs" role="tablist" aria-label="Filter guides">
              <button className={`topic-tab ${activeTopic === 'all' ? 'active' : ''}`} onClick={() => setActiveTopic('all')} data-testid="tab-topic-all">
                <Search size={14} /> {t.allTopics}
              </button>
              {(['start', 'pay', 'grow'] as const).map((topic) => (
                <button className={`topic-tab ${activeTopic === topic ? 'active' : ''}`} key={topic} onClick={() => setActiveTopic(topic)} data-testid={`tab-topic-${topic}`}>
                  {topic === 'start' ? <Smartphone size={14} /> : topic === 'pay' ? <QrCode size={14} /> : <Store size={14} />}
                  {t.topics[topic]}
                </button>
              ))}
            </div>
            <div className="guide-grid" data-testid="guide-grid">
              {filteredGuides.map((guide) => {
                const GuideIcon = guide.icon;
                return (
                  <article className="guide-card" key={guide.id} data-testid={`card-guide-${guide.id}`}>
                    <div className="guide-icon"><GuideIcon size={20} /></div>
                    <h3>{guide.title}</h3>
                    <p>{guide.description}</p>
                    <div className="guide-meta">
                      <span><Clock3 size={13} /> {guide.time}</span>
                      <span><BookOpen size={13} /> Guide</span>
                    </div>
                    <button className="guide-open" onClick={() => setOpenGuide(guide)} data-testid={`button-open-guide-${guide.id}`}>
                      Open this guide <ChevronRight size={15} />
                    </button>
                  </article>
                );
              })}
            </div>
            <div className="qr-maker" id="qr-maker" data-testid="qr-maker">
              <div className="qr-maker-copy">
                <div className="eyebrow eyebrow-accent">{t.qrMakerEyebrow}</div>
                <h3>{t.qrMakerTitle}</h3>
                <p>{t.qrMakerText}</p>
                <div className="qr-safety"><ShieldCheck size={15} /> {t.qrSafety}</div>
              </div>
              <form className="qr-form" onSubmit={(event) => { event.preventDefault(); void generateQr(); }}>
                <label className="qr-field">
                  <span>{t.qrUpiLabel}</span>
                  <input
                    value={upiId}
                    onChange={(event) => { setUpiId(event.target.value); setQrError(''); }}
                    placeholder={t.qrPlaceholder}
                    inputMode="email"
                    autoComplete="off"
                    aria-label={t.qrUpiLabel}
                    data-testid="input-upi-id"
                  />
                  <small>{t.qrUpiHint}</small>
                </label>
                <label className="qr-field">
                  <span>{t.qrAmountLabel}</span>
                  <div className="amount-input">
                    <span aria-hidden="true">₹</span>
                    <input
                      value={amount}
                      onChange={(event) => { setAmount(event.target.value.replace(/[^\d.]/g, '')); setQrError(''); }}
                      placeholder="500"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      max="20000"
                      step="0.01"
                      aria-label={t.qrAmountLabel}
                      data-testid="input-qr-amount"
                    />
                  </div>
                  <small>{t.qrMaxNote}</small>
                </label>
                <button className="button-primary qr-submit" type="submit" data-testid="button-generate-qr">
                  {qrDataUrl ? t.qrRegenerate : t.qrGenerate} <ArrowRight size={15} />
                </button>
                {qrError && <p className="qr-error" role="alert" data-testid="text-qr-error">{qrError}</p>}
              </form>
              <div className={`qr-result ${qrDataUrl ? 'has-qr' : ''}`} data-testid="qr-result">
                {qrDataUrl ? (
                  <>
                    <img src={qrDataUrl} alt={`UPI payment QR for ₹${amount}`} data-testid="img-generated-qr" />
                    <div className="qr-result-copy">
                      <strong>₹{Number(amount).toLocaleString('en-IN')}</strong>
                      <span>{upiId.trim()}</span>
                    </div>
                    <button className="button-secondary qr-download" type="button" onClick={downloadQr} data-testid="button-download-qr">
                      <Download size={15} /> {t.qrDownload}
                    </button>
                  </>
                ) : (
                  <>
                    <QrCode size={46} strokeWidth={1.25} />
                    <span>{t.qrEmpty}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="section app-tutorial-section" id="upi-apps">
          <div className="section-wrap">
            <div className="section-heading">
              <div className="eyebrow eyebrow-accent">{t.appsEyebrow}</div>
              <h2>{t.appsTitle}</h2>
              <p>{t.appsText}</p>
            </div>
            <div className="upi-app-grid" data-testid="upi-app-grid">
              {upiApps.map((app) => {
                const AppIcon = app.icon;
                return (
                  <article className="upi-app-card" key={app.id} data-testid={`card-upi-app-${app.id}`}>
                    <div className="upi-app-card-top">
                      <div className={`upi-app-icon upi-app-icon-${app.id}`}><AppIcon size={20} /></div>
                      <span className="upi-app-badge">{app.badge}</span>
                    </div>
                    <h3>{app.name}</h3>
                    <p>{app.description}</p>
                    <div className="upi-app-links">
                      <button className="guide-open" onClick={() => setOpenUpiApp(app)} data-testid={`button-open-upi-tutorial-${app.id}`}>
                        {t.openTutorial} <ChevronRight size={15} />
                      </button>
                      <a href={app.videoUrl} target="_blank" rel="noreferrer" className="tutorial-link" data-testid={`link-upi-video-${app.id}`}>
                        <PlayCircle size={14} /> {t.tutorialVideo}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section-tint" id="how-it-works">
          <div className="section-wrap">
            <div className="section-heading center">
              <div className="eyebrow eyebrow-accent">{t.processEyebrow}</div>
              <h2>{t.processTitle}</h2>
              <p>{t.processText}</p>
            </div>
            <div className="process-grid">
              <div className="process-card">
                <div className="process-number">01 / NOTICE</div>
                <h3>Start with one real question</h3>
                <p>“How do I know the money arrived?” is a better starting point than learning every feature.</p>
              </div>
              <div className="process-card">
                <div className="process-number">02 / PRACTICE</div>
                <h3>Try it with someone you trust</h3>
                <p>Use a small amount or a pretend example. Repeat the steps until they feel familiar.</p>
              </div>
              <div className="process-card">
                <div className="process-number">03 / MAKE IT YOURS</div>
                <h3>Keep only what helps</h3>
                <p>Your business does not need every app. Keep the tools that save time and reduce worry.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="readiness">
          <div className="section-wrap readiness-shell">
            <div className="readiness-intro">
              <div className="eyebrow">{t.readinessEyebrow}</div>
              <h2>{t.readinessTitle}</h2>
              <p>{t.readinessText}</p>
              <div className="readiness-note"><CircleHelp size={16} /> You can leave any answer unchecked and come back later.</div>
            </div>
            <div className="checklist-panel" data-testid="readiness-checklist">
              <div className="checklist-top">
                <h3>{t.checklistTitle}</h3>
                <div className="progress-copy" data-testid="text-checklist-progress">{completeCount}/{checklist.length} {t.done}</div>
              </div>
              <div className="progress-track" aria-label={`${completeCount} of ${checklist.length} complete`}>
                <div className="progress-fill" style={{ width: `${(completeCount / checklist.length) * 100}%` }} />
              </div>
              {checklist.map((item) => (
                <label className="check-row" key={item.id} data-testid={`checklist-row-${item.id}`}>
                  <input type="checkbox" checked={Boolean(checked[item.id])} onChange={() => toggleCheck(item.id)} data-testid={`checkbox-${item.id}`} />
                  <span className="check-box"><Check size={14} strokeWidth={3} /></span>
                  <span className="check-label"><strong>{item.title}</strong><span>{item.detail}</span></span>
                </label>
              ))}
              {completeCount === checklist.length && (
                <div className="success-card" role="status" data-testid="status-checklist-success">
                  <BadgeCheck size={20} />
                  <div><strong>{t.successTitle}</strong><span>{t.successText}</span></div>
                </div>
              )}
              <p className="px-2 py-2 text-center font-mono-ui text-[.62rem] text-muted-foreground">{t.checklistNote}</p>
              <button className="button-primary checklist-cta" onClick={() => jumpTo('guides')} data-testid="button-checklist-guides">
                {completeCount === checklist.length ? 'Start with the QR guide' : 'Browse the guides'} <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <section className="quote-section section-tint" id="why">
          <div className="section-wrap quote-layout">
            <div>
              <div className="eyebrow eyebrow-accent">{t.quoteEyebrow}</div>
              <div className="quote-mark">“</div>
              <blockquote className="quote-text" data-testid="text-quote">{t.quote}</blockquote>
              <div className="quote-byline">
                <div className="avatar">SN</div>
                <div><strong>Savita tai</strong><span>Home baker, Nashik</span></div>
              </div>
            </div>
            <div className="quote-facts">
              <div className="fact"><strong>01</strong><span>clear next step, not a long course</span></div>
              <div className="fact"><strong>03</strong><span>languages for local learning</span></div>
              <div className="fact"><strong>0</strong><span>passwords or bank details collected</span></div>
              <div className="fact"><strong>∞</strong><span>permission to go at your own pace</span></div>
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="section-wrap">
            <div className="section-heading">
              <div className="eyebrow eyebrow-accent">{t.faqEyebrow}</div>
              <h2>{t.faqTitle}</h2>
            </div>
            <div className="faq-grid">
              {faqs.map(([question, answer], index) => (
                <div className="faq-item" key={question}>
                  <button className={`faq-button ${openFaq === index ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index} data-testid={`button-faq-${index}`}>
                    <span>{question}</span><ChevronDown size={17} />
                  </button>
                  {openFaq === index && <div className="faq-answer" data-testid={`text-faq-answer-${index}`}>{answer}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-wrap">
          <div className="footer-grid">
            <div>
              <Logo />
              <p className="footer-copy">{t.footerText}</p>
            </div>
            <div>
              <h4>Explore</h4>
              <div className="footer-links">
                <button onClick={() => jumpTo('guides')} data-testid="footer-link-guides">{t.nav.guides}</button>
                <button onClick={() => jumpTo('upi-apps')} data-testid="footer-link-upi-tutorials">{t.nav.tutorials}</button>
                <button onClick={() => jumpTo('readiness')} data-testid="footer-link-checklist">{t.nav.checklist}</button>
                <button onClick={() => jumpTo('faq')} data-testid="footer-link-faq">Questions & answers</button>
              </div>
            </div>
            <div>
              <h4>Need a person?</h4>
              <div className="footer-links">
                <button onClick={() => { setHelpSent(false); setHelpOpen(true); }} data-testid="footer-button-ask">{t.nav.ask}</button>
                <button onClick={() => setLanguageOpen(true)} data-testid="footer-button-language">Change language</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom"><span>© 2024 Vendor Digital Help</span><span>Learn first. Tap later.</span></div>
        </div>
      </footer>

      {openGuide && (
        <div className="modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setOpenGuide(null); }} data-testid="modal-guide">
          <article className="modal" role="dialog" aria-modal="true" aria-labelledby="guide-modal-title">
            <button className="modal-close" onClick={() => setOpenGuide(null)} aria-label="Close guide" data-testid="button-close-guide"><X size={17} /></button>
            <div className="modal-icon"><openGuide.icon size={22} /></div>
            <h2 id="guide-modal-title">{openGuide.title}</h2>
            <p className="modal-intro">{openGuide.description} Take your time — you can close this and come back whenever you like.</p>
            <ol className="guide-steps">
              {openGuide.steps.map((step, index) => <li key={`${openGuide.id}-${index}`}>{step}</li>)}
            </ol>
            <div className="modal-footnote"><ShieldCheck size={15} /> If anything feels unusual, stop and ask someone you trust. A real support person will not ask for your PIN.</div>
          </article>
        </div>
      )}

      {openUpiApp && (
        <div className="modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setOpenUpiApp(null); }} data-testid="modal-upi-tutorial">
          <article className="modal app-tutorial-modal" role="dialog" aria-modal="true" aria-labelledby="upi-tutorial-title">
            <button className="modal-close" onClick={() => setOpenUpiApp(null)} aria-label="Close app tutorial" data-testid="button-close-upi-tutorial"><X size={17} /></button>
            <div className="tutorial-modal-heading">
              <div className="modal-icon"><openUpiApp.icon size={22} /></div>
              <div>
                <div className="eyebrow eyebrow-accent">{openUpiApp.badge}</div>
                <h2 id="upi-tutorial-title">{openUpiApp.name} setup</h2>
              </div>
            </div>
            <p className="modal-intro">Follow these steps in order. Button names can move after an app update, but the flow stays similar.</p>
            <div className="tutorial-external-links">
              <a href={openUpiApp.videoUrl} target="_blank" rel="noreferrer" className="tutorial-video-link" data-testid="link-tutorial-video">
                <PlayCircle size={16} /> {t.tutorialVideo} <ExternalLink size={13} />
              </a>
              <a href={openUpiApp.officialUrl} target="_blank" rel="noreferrer" className="tutorial-official-link" data-testid="link-official-guide">
                {t.officialGuide} <ExternalLink size={13} />
              </a>
            </div>
            <div className="tutorial-steps" data-testid="tutorial-steps">
              {openUpiApp.steps.map((step, index) => (
                <article className="tutorial-step" key={`${openUpiApp.id}-${step.title}`}>
                  <TutorialStepArt visual={step.visual} step={index + 1} title={step.title} />
                  <div className="tutorial-step-copy">
                    <div className="tutorial-step-number">STEP {String(index + 1).padStart(2, '0')}</div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <div className="tutorial-tip"><ShieldCheck size={14} /> {step.tip}</div>
                  </div>
                </article>
              ))}
            </div>
            <div className="modal-footnote"><ShieldCheck size={15} /> Never share your UPI PIN, OTP, debit card details, or screen with a caller.</div>
          </article>
        </div>
      )}

      {helpOpen && (
        <div className="modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setHelpOpen(false); }} data-testid="modal-help">
          <article className="modal help-modal" role="dialog" aria-modal="true" aria-labelledby="help-modal-title">
            <button className="modal-close" onClick={() => setHelpOpen(false)} aria-label="Close question form" data-testid="button-close-help"><X size={17} /></button>
            {!helpSent ? (
              <>
                <div className="modal-icon"><MessageCircleMore size={22} /></div>
                <h2 id="help-modal-title">{t.askTitle}</h2>
                <p className="modal-intro">{t.askText}</p>
                <textarea placeholder="For example: I cannot tell if my payment arrived..." aria-label="Your question" data-testid="input-question" />
                <button className="button-primary" onClick={() => setHelpSent(true)} data-testid="button-send-question">{t.send} <ArrowRight size={15} /></button>
              </>
            ) : (
              <div className="help-sent" data-testid="status-question-sent">
                <div className="modal-icon"><Check size={22} /></div>
                <h2>{t.sentTitle}</h2>
                <p>{t.sentText}</p>
                <button className="button-secondary" onClick={() => setHelpOpen(false)} data-testid="button-close-sent">Back to the guides</button>
              </div>
            )}
          </article>
        </div>
      )}
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;