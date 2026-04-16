import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, ArrowLeft, ArrowRight, Leaf, XCircle, CheckCircle2 } from "lucide-react";

const GAME_SECONDS = 30;

const TEXT = {
  en: {
    title: "RTE Packaging Recycling Game",
    subtitle: "Can you sort everyday packaging correctly in 30 seconds?",
    description: "Packaging Outrun! Does your food packaging really have nowhere to go? In this fast-paced challenge, become a 'recycling wizard' and spot hidden recyclable materials among piles of ready-to-eat packaging. Peel off labels, tear away liners, and sort with precision. Test your reflexes and help every package begin its second life.",
    start: "Start",
    restart: "Play Again",
    left: "General Waste",
    right: "Recyclable",
    time: "Time Left",
    score: "Score",
    resultTitle: "Time's Up!",
    wrongSet: "Wrong Answers Review",
    noWrong: "Great job! You got everything correct.",
    yourAnswer: "Your answer",
    correctAnswer: "Correct answer",
    correct: "Correct!",
    wrong: "Wrong!",
  },
  zhCN: {
    title: "RTE 包装回收判断小游戏",
    subtitle: "30秒内，你能判断对多少个？",
    description: "包装大作战：逃离垃圾桶！你的食物包装真的无处可去了吗？在这场快节奏的挑战中，你将化身“循环魔法师”，在堆积如山的即食产品包装中，一眼识别出隐藏的环保物料。剥掉标签、撕开衬垫，精准投递！快来挑战你的反应极限，让每一件包装都开启它的“第二人生”。",
    start: "开始游戏",
    restart: "再玩一次",
    left: "一般垃圾",
    right: "可回收",
    time: "剩余时间",
    score: "当前得分",
    resultTitle: "时间到！",
    wrongSet: "错题集合",
    noWrong: "太棒了，你全部答对了。",
    yourAnswer: "你的答案",
    correctAnswer: "正确答案",
    correct: "答对了！",
    wrong: "答错了！",
  },
  zhHK: {
    title: "RTE 包裝回收判斷遊戲",
    subtitle: "30秒內，你能答對多少？",
    description: "包裝大作戰：逃離垃圾桶！你的食物包裝真的無處可去了嗎？在這場快節奏的挑戰中，你將化身「循環魔法師」，在堆積如山的即食產品包裝中，一眼識別出隱藏的環保物料。剝掉標籤、撕開襯墊，精準投遞！快來挑戰你的反應極限，讓每一件包裝都開啟它的「第二人生」。",
    start: "開始遊戲",
    restart: "再玩一次",
    left: "一般垃圾",
    right: "可回收",
    time: "剩餘時間",
    score: "當前得分",
    resultTitle: "時間到！",
    wrongSet: "錯題集合",
    noWrong: "太好了，你全部答對了。",
    yourAnswer: "你的答案",
    correctAnswer: "正確答案",
    correct: "答對了！",
    wrong: "答錯了！",
  },
};

const items = [
  {
    id: 1,
    icon: "🧴",
    answer: "recyclable",
    name: {
      en: "PET Drink Bottle",
      zhCN: "PET饮料瓶",
      zhHK: "PET飲料瓶",
    },
    shortLabel: {
      en: "Recyclable",
      zhCN: "可回收",
      zhHK: "可回收",
    },
    explanation: {
      en: "Made of a single PET material.",
      zhCN: "单一PET材质，回收体系成熟",
      zhHK: "單一PET材質，回收體系成熟",
    },
  },
  {
    id: 2,
    icon: "🥫",
    answer: "recyclable",
    name: {
      en: "Aluminium Can",
      zhCN: "铝罐（饮料）",
      zhHK: "鋁罐（飲料）",
    },
    shortLabel: {
      en: "Recyclable",
      zhCN: "可回收",
      zhHK: "可回收",
    },
    explanation: {
      en: "Metal has high recycling value.",
      zhCN: "金属回收价值高",
      zhHK: "金屬回收價值高",
    },
  },
  {
    id: 3,
    icon: "🥤",
    answer: "recyclable",
    name: {
      en: "PP Plastic Cup Lid",
      zhCN: "PP塑料杯盖",
      zhHK: "PP塑料杯蓋",
    },
    shortLabel: {
      en: "Recyclable",
      zhCN: "可回收",
      zhHK: "可回收",
    },
    explanation: {
      en: "Single plastic material.",
      zhCN: "单一塑料材质",
      zhHK: "單一塑料材質",
    },
  },
  {
    id: 4,
    icon: "🥡",
    answer: "recyclable",
    name: {
      en: "Transparent PET Food Container Lid",
      zhCN: "透明PET餐盒盖",
      zhHK: "透明PET餐盒蓋",
    },
    shortLabel: {
      en: "Recyclable",
      zhCN: "可回收",
      zhHK: "可回收",
    },
    explanation: {
      en: "Common single-material packaging.",
      zhCN: "单一材质且常见",
      zhHK: "單一材質且常見",
    },
  },
  {
    id: 5,
    icon: "📦",
    answer: "recyclable",
    name: {
      en: "Clean Paper Box (No Oil)",
      zhCN: "干净纸盒（无油）",
      zhHK: "乾淨紙盒（無油）",
    },
    shortLabel: {
      en: "Recyclable",
      zhCN: "可回收",
      zhHK: "可回收",
    },
    explanation: {
      en: "Uncontaminated paper can be recycled.",
      zhCN: "未污染纸类可回收",
      zhHK: "未污染紙類可回收",
    },
  },
  {
    id: 6,
    icon: "🍱",
    answer: "general",
    name: {
      en: "Greasy Paper Food Box",
      zhCN: "沾有油的纸餐盒",
      zhHK: "沾有油的紙餐盒",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Food contamination affects recycling.",
      zhCN: "食物污染影响回收",
      zhHK: "食物污染影響回收",
    },
  },
  {
    id: 7,
    icon: "🥡",
    answer: "general",
    name: {
      en: "Leftover Takeaway Box (Unwashed)",
      zhCN: "吃剩的外卖盒（未清洗）",
      zhHK: "吃剩的外賣盒（未清洗）",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Contains organic residue.",
      zhCN: "有机残留",
      zhHK: "有機殘留",
    },
  },
  {
    id: 8,
    icon: "🛍️",
    answer: "general",
    name: {
      en: "Paper Bag with Sauce Stains",
      zhCN: "沾酱汁的纸袋",
      zhHK: "沾醬汁的紙袋",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Heavily contaminated.",
      zhCN: "污染严重",
      zhHK: "污染嚴重",
    },
  },
  {
    id: 9,
    icon: "🥗",
    answer: "general",
    name: {
      en: "Unwashed Salad Bowl",
      zhCN: "未清洗的沙拉碗",
      zhHK: "未清洗的沙拉碗",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Residue affects recycling.",
      zhCN: "残留影响回收",
      zhHK: "殘留影響回收",
    },
  },
  {
    id: 10,
    icon: "🥪",
    answer: "general",
    name: {
      en: "Sandwich Wrapper Film",
      zhCN: "三明治包装膜（塑料+可能涂层）",
      zhHK: "三文治包裝膜（塑料+可能塗層）",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Plastic film is difficult to recycle.",
      zhCN: "薄膜难回收",
      zhHK: "薄膜難回收",
    },
  },
  {
    id: 11,
    icon: "🍙",
    answer: "general",
    name: {
      en: "Rice Ball Bag (Plastic + Paper Label)",
      zhCN: "饭团袋子（塑料+纸质标签）",
      zhHK: "飯糰袋（塑料+紙質標籤）",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Multiple materials combined.",
      zhCN: "多材料组合",
      zhHK: "多材料組合",
    },
  },
  {
    id: 12,
    icon: "🥗",
    answer: "general",
    name: {
      en: "Salad Bowl (PET + Sticker + Sealing Film)",
      zhCN: "沙拉碗（PET+贴纸+封膜）",
      zhHK: "沙律碗（PET+貼紙+封膜）",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Multiple materials combined.",
      zhCN: "多材料组合",
      zhHK: "多材料組合",
    },
  },
  {
    id: 13,
    icon: "🍱",
    answer: "general",
    name: {
      en: "Bento Box (Base and Lid in Different Materials)",
      zhCN: "便当盒（底+盖不同材质）",
      zhHK: "便當盒（底+蓋不同材質）",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Mixed materials.",
      zhCN: "混合材料",
      zhHK: "混合材料",
    },
  },
  {
    id: 14,
    icon: "🍘",
    answer: "general",
    name: {
      en: "Composite Snack Bag",
      zhCN: "零食复合包装袋",
      zhHK: "零食複合包裝袋",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Multi-layer structure (plastic + aluminium).",
      zhCN: "多层结构（塑料+铝）",
      zhHK: "多層結構（塑料+鋁）",
    },
  },
  {
    id: 15,
    icon: "🍅",
    answer: "general",
    name: {
      en: "Ketchup Sachet",
      zhCN: "番茄酱小包装袋",
      zhHK: "番茄醬小包裝袋",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Soft composite packaging.",
      zhCN: "软性复合材料",
      zhHK: "軟性複合材料",
    },
  },
  {
    id: 16,
    icon: "🍗",
    answer: "general",
    name: {
      en: "Ready-to-Eat Chicken Breast Pouch",
      zhCN: "即食鸡胸肉袋",
      zhHK: "即食雞胸肉袋",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Multi-layer composite material.",
      zhCN: "多层复合材料",
      zhHK: "多層複合材料",
    },
  },
  {
    id: 17,
    icon: "🏷️",
    answer: "general",
    name: {
      en: "Packaging Sticker Label",
      zhCN: "包装贴纸标签",
      zhHK: "包裝貼紙標籤",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Small size and adhesive content.",
      zhCN: "体积小+含胶",
      zhHK: "體積小+含膠",
    },
  },
  {
    id: 18,
    icon: "🫙",
    answer: "general",
    name: {
      en: "Plastic Sealing Film",
      zhCN: "塑料封膜（餐盒封口）",
      zhHK: "塑料封膜（餐盒封口）",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Plastic film is difficult to recycle.",
      zhCN: "薄膜难回收",
      zhHK: "薄膜難回收",
    },
  },
  {
    id: 19,
    icon: "🧃",
    answer: "general",
    name: {
      en: "Straw Wrapper",
      zhCN: "吸管包装袋",
      zhHK: "吸管包裝袋",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Lightweight thin plastic.",
      zhCN: "轻薄塑料",
      zhHK: "輕薄塑料",
    },
  },
  {
    id: 20,
    icon: "🍴",
    answer: "general",
    name: {
      en: "Disposable Cutlery Wrapper",
      zhCN: "一次性餐具包装膜",
      zhHK: "一次性餐具包裝膜",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Low recycling value.",
      zhCN: "低回收价值",
      zhHK: "低回收價值",
    },
  },
  {
    id: 21,
    icon: "🧋",
    answer: "general",
    name: {
      en: "Bubble Tea Cup (Unwashed)",
      zhCN: "奶茶杯（未清洗）",
      zhHK: "奶茶杯（未清洗）",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Contamination issue.",
      zhCN: "污染问题",
      zhHK: "污染問題",
    },
  },
  {
    id: 22,
    icon: "🥡",
    answer: "general",
    name: {
      en: "Oily Plastic Food Container",
      zhCN: "塑料餐盒（有油）",
      zhHK: "塑料餐盒（有油）",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Could only be recycled after cleaning.",
      zhCN: "需清洁后才可能回收",
      zhHK: "需清潔後才可能回收",
    },
  },
  {
    id: 23,
    icon: "📦",
    answer: "general",
    name: {
      en: "Transparent Plastic Box with Sticker",
      zhCN: "透明塑料盒（有贴纸）",
      zhHK: "透明塑料盒（有貼紙）",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Sticker affects recycling.",
      zhCN: "贴纸影响回收",
      zhHK: "貼紙影響回收",
    },
  },
  {
    id: 24,
    icon: "📄",
    answer: "general",
    name: {
      en: "Paper + Plastic Composite Packaging",
      zhCN: "纸+塑料复合包装",
      zhHK: "紙+塑料複合包裝",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Cannot be separated.",
      zhCN: "无法分离",
      zhHK: "無法分離",
    },
  },
  {
    id: 25,
    icon: "🍜",
    answer: "general",
    name: {
      en: "Instant Noodle Bowl",
      zhCN: "泡面碗",
      zhHK: "泡麵碗",
    },
    shortLabel: {
      en: "General Waste",
      zhCN: "一般垃圾",
      zhHK: "一般垃圾",
    },
    explanation: {
      en: "Food contamination affects recycling.",
      zhCN: "食物污染影响回收",
      zhHK: "食物污染影響回收",
    },
  },
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function RTEPackagingRecyclingGame() {
  const [lang, setLang] = useState("zhCN");
  const t = TEXT[lang];

  const [seed, setSeed] = useState(0);
  const activeDeck = useMemo(() => shuffle(items), [seed]);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  const currentItem = activeDeck[index];
  const progress = (timeLeft / GAME_SECONDS) * 100;

  useEffect(() => {
    if (!started || ended) return;
    if (timeLeft <= 0) {
      setEnded(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, started, ended]);

  const startGame = () => {
    setStarted(true);
    setEnded(false);
    setTimeLeft(GAME_SECONDS);
    setIndex(0);
    setScore(0);
    setFeedback(null);
    setWrongAnswers([]);
    setSeed((prev) => prev + 1);
  };

  const handleChoice = (choice) => {
    if (!started || ended || !currentItem) return;

    const isCorrect = currentItem.answer === choice;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedback({
        type: "correct",
        item: currentItem,
      });
    } else {
      const wrongRecord = {
        id: currentItem.id,
        name: currentItem.name,
        yourAnswer: choice,
        correctAnswer: currentItem.answer,
        explanation: currentItem.explanation,
      };

      setWrongAnswers((prev) => {
        const exists = prev.some((item) => item.id === wrongRecord.id);
        return exists ? prev : [...prev, wrongRecord];
      });

      setFeedback({
        type: "wrong",
        item: currentItem,
        yourAnswer: choice,
      });
    }

    setTimeout(() => {
      setFeedback(null);
      setIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= activeDeck.length) {
          return 0;
        }
        return nextIndex;
      });
    }, 900);
  };

  const getChoiceLabel = (value) => {
    if (value === "recyclable") return TEXT[lang].right;
    return TEXT[lang].left;
  };

  const getPlayerType = () => {
    if (score <= 5) return lang === "en" ? "🌱 Beginner (0–5)" : lang === "zhCN" ? "🌱 入门选手（0–5分）" : "🌱 入門選手（0–5分）";
    if (score <= 10) return lang === "en" ? "♻️ Aware User (6–10)" : lang === "zhCN" ? "♻️ 进阶玩家（6–10分）" : "♻️ 進階玩家（6–10分）";
    return lang === "en" ? "🌍 Recycling Pro (10+)" : lang === "zhCN" ? "🌍 回收达人（10分以上）" : "🌍 回收達人（10分以上）";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-4 gap-2">
          <Button size="sm" onClick={() => setLang("en")}>EN</Button>
          <Button size="sm" onClick={() => setLang("zhCN")}>简体</Button>
          <Button size="sm" onClick={() => setLang("zhHK")}>繁體</Button>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
          <Leaf className="text-green-600" /> {t.title}
        </h1>
        <p className="mt-2 text-lg text-slate-700">{t.subtitle}</p>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl">{t.description}</p>
      </div>

        <div className="mt-4 flex justify-between items-center text-xl">
          <div>{t.time}: {timeLeft}s</div>
          <div>{t.score}: {score}</div>
        </div>

        <Progress value={progress} className="mt-2" />

        {!started || ended ? (
          <div className="mt-10 text-center">
            {!started && (
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  🌱 Learn • Play • Improve
                </div>
              </div>
            )}

            {ended && (
              <>
                <div className="mb-6 text-center">
                <div className="inline-flex items-center rounded-full bg-white/80 px-6 py-3 text-lg font-semibold text-green-800 shadow">
                  {getPlayerType()}
                </div>
              </div>

              <Card className="rounded-3xl shadow-md border-0 bg-white/90 text-left max-w-3xl mx-auto mb-8">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4">{t.wrongSet}</h3>
                  {wrongAnswers.length === 0 ? (
                    <p className="text-base text-slate-700">{t.noWrong}</p>
                  ) : (
                    <div className="space-y-4">
                      {wrongAnswers.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                          <div className="font-semibold text-lg">{item.name?.[lang] || item.name?.en}</div>
                          <div className="mt-2 text-sm text-slate-700">
                            {t.yourAnswer}: <span className="font-medium">{getChoiceLabel(item.yourAnswer)}</span>
                          </div>
                          <div className="mt-1 text-sm text-slate-700">
                            {t.correctAnswer}: <span className="font-medium">{getChoiceLabel(item.correctAnswer)}</span>
                          </div>
                          <div className="mt-2 text-sm text-slate-600">
                            {item.explanation?.[lang] || item.explanation?.en}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              </>
            )}

            <Button onClick={startGame} className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-3xl text-lg shadow-lg">
              <RotateCcw className="mr-2" />
              {ended ? t.restart : t.start}
            </Button>
          </div>
        ) : (
          <div className="mt-10 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem?.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-7xl">{currentItem?.icon}</div>
                <h2 className="text-2xl md:text-4xl font-bold mt-4">
                  {currentItem?.name?.[lang] || currentItem?.name?.en}
                </h2>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-2xl mx-auto mt-6"
                >
                  <Card className={`rounded-3xl border-0 shadow-md ${feedback.type === "wrong" ? "bg-rose-50" : "bg-emerald-50"}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 text-left">
                        {feedback.type === "wrong" ? (
                          <XCircle className="h-6 w-6 text-rose-600 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="h-6 w-6 text-emerald-600 mt-0.5" />
                        )}
                        <div>
                          <div className={`font-semibold text-lg ${feedback.type === "wrong" ? "text-rose-700" : "text-emerald-700"}`}>
                            {feedback.type === "wrong" ? t.wrong : t.correct}
                          </div>
                          {feedback.type === "wrong" && (
                            <>
                              <div className="mt-2 text-sm text-slate-700">
                                {t.correctAnswer}: <span className="font-medium">{currentItem?.shortLabel?.[lang] || currentItem?.shortLabel?.en}</span>
                              </div>
                              <div className="mt-2 text-sm text-slate-600">
                                {currentItem?.explanation?.[lang] || currentItem?.explanation?.en}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <Button
                onClick={() => handleChoice("general")}
                className="bg-gray-200 hover:bg-gray-300 text-slate-800 h-24 text-lg rounded-2xl"
              >
                <ArrowLeft className="mr-2" /> {t.left}
              </Button>
              <Button
                onClick={() => handleChoice("recyclable")}
                className="bg-green-600 hover:bg-green-700 text-white h-24 text-lg rounded-2xl"
              >
                {t.right} <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
