import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, Copy, Check, MousePointer2, PartyPopper, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const PRIZES = [
  "国风酒馆", "脱口秀", "SteelSeries 磁轴键盘", "重庆五日游", 
  "卡丁车", "直升机飞行", "马术", "SHOEI哑黑头盔", 
  "新疆十日游", "电影", "中医正骨", "民谣酒馆", 
  "任意指定礼物", "三角翼飞行", "希尔顿欢朋（光谷店）住宿一晚", "车载淡香", 
  "美食一日游", "火箭发射观礼", "滑翔伞", "儿童电动摩托车", "我帮你选"
];

const PREMIUM_GRADIENTS = [
  'radial-gradient(circle at 30% 30%, #fff5f5 0%, #ffdada 100%)', // 极浅粉
  'radial-gradient(circle at 30% 30%, #f0fff4 0%, #c6f6d5 100%)', // 极浅绿
  'radial-gradient(circle at 30% 30%, #fffaf0 0%, #fde6d2 100%)', // 奶油橙
  'radial-gradient(circle at 30% 30%, #ebf8ff 0%, #bee3f8 100%)', // 婴儿蓝
  'radial-gradient(circle at 30% 30%, #faf5ff 0%, #e9d8fd 100%)', // 浅紫
  'radial-gradient(circle at 30% 30%, #fff5f7 0%, #fed7e2 100%)', // 玫瑰粉
  'radial-gradient(circle at 30% 30%, #f0f5ff 0%, #dbeafe 100%)', // 淡雅蓝
  'radial-gradient(circle at 30% 30%, #f5f3ff 0%, #ddd6fe 100%)', // 薰衣草
  'radial-gradient(circle at 30% 30%, #fdf2f2 0%, #fee2e2 100%)', // 柔红
  'radial-gradient(circle at 30% 30%, #fffbeb 0%, #fef3c7 100%)', // 暖黄
  'radial-gradient(circle at 30% 30%, #ecfdf5 0%, #d1fae5 100%)', // 薄荷绿
  'radial-gradient(circle at 30% 30%, #eff6ff 0%, #dbeafe 100%)', // 冰蓝
  'radial-gradient(circle at 30% 30%, #f5f3ff 0%, #ede9fe 100%)', // 梦幻紫
  'radial-gradient(circle at 30% 30%, #fdf2f8 0%, #fce7f3 100%)', // 胭脂粉
  'radial-gradient(circle at 30% 30%, #f0fdf4 0%, #dcfce7 100%)', // 小清新绿
  'radial-gradient(circle at 30% 30%, #fffaf0 0%, #fef3c7 100%)', // 琥珀黄
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSurprisesExpanded, setIsSurprisesExpanded] = useState(false);
  const [ballPositions, setBallPositions] = useState<{ x: number, y: number, rotate: number, color: string }[]>([]);
  
  const nextSequentialIndexRef = useRef(0);

  // Initialize ball positions with more careful spacing to avoid bottom block
  useEffect(() => {
    const cols = 5;
    const paddingX = 14;
    const bottomY = 78; // Lifted up to avoid bottom bar
    const rowStep = 13;
    
    const positions = PRIZES.map((_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      let finalX = paddingX + (col * (100 - 2 * paddingX) / (cols - 1));
      
      if (row % 2 === 1) {
        finalX += 6;
      }

      return {
        x: finalX,
        y: bottomY - (row * rowStep),
        rotate: (i * 30) % 360,
        color: PREMIUM_GRADIENTS[i % PREMIUM_GRADIENTS.length]
      };
    });
    setBallPositions(positions);
  }, []);

  const startDrawing = () => {
    if (isDrawing) return;
    
    setIsDrawing(true);
    setShowModal(false);
    setCopied(false);

    const nextIdx = nextSequentialIndexRef.current;
    
    // Draw animation duration
    setTimeout(() => {
      setCurrentIndex(nextIdx);
      nextSequentialIndexRef.current = (nextIdx + 1) % PRIZES.length;
      setIsDrawing(false);
      setShowModal(true);
    }, 1800);
  };

  const handleCopy = () => {
    if (currentIndex === -1) return;
    const text = PRIZES[currentIndex];
    let success = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
        success = true;
      }
    } catch {
      success = false;
    }
    if (!success) {
      // Fallback: 使用 textarea 复制（兼容 HTTP 环境）
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        success = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch {
        success = false;
      }
    }
    setCopied(true);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] font-sans selection:bg-blue-100 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-cyan-100/20 rounded-full blur-3xl" />
        
        {/* Cute Dragon Background Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`dragon-bg-${i}`}
            initial={{ 
              top: `${15 + i * 15}%`, 
              left: i % 2 === 0 ? '-10%' : '90%',
              opacity: 0,
              scale: 0.5
            }}
            animate={{ 
              opacity: 0.15,
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              scale: [0.5, 0.55, 0.5]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut"
            }}
            className="absolute w-48 h-48 flex items-center justify-center text-8xl"
          >
            {i % 2 === 0 ? "🐉" : "🐲"}
          </motion.div>
        ))}

        {[...Array(6)].map((_, i) => (
          <motion.img
            key={i}
            src="/input_file_0.png"
            alt="Decoration"
            initial={{ 
              top: `${13 + i * 14}%`, 
              left: i % 2 === 0 ? '-8%' : '88%',
              opacity: 0,
              scale: 0.3
            }}
            animate={{ 
              opacity: 0.12,
              y: [0, -20, 0],
              rotate: [0, 8, -8, 0]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              delay: i * 1.8,
              ease: "easeInOut"
            }}
            className="absolute w-40 h-40 object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ))}

        {/* Scattered Dragon Charm Icons */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`charm-${i}`}
            initial={{ 
              top: `${Math.random() * 80 + 10}%`, 
              left: `${Math.random() * 80 + 10}%`,
              opacity: 0,
              scale: 0.5 + Math.random() * 0.5,
              rotate: Math.random() * 360
            }}
            animate={{ 
              opacity: 0.15,
              y: [0, Math.random() * 30 - 15, 0],
              x: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{ 
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-12 h-14 pointer-events-none z-0"
          >
            {/* Simple CSS Dragon Charm Shape */}
            <div className="relative w-full h-full bg-rose-500 rounded-2xl border-4 border-yellow-400 shadow-lg overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full -mt-2"></div>
               <div className="absolute inset-2 border-2 border-white/20 rounded-lg"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-yellow-200 opacity-40">
                 <Sparkles size={16} />
               </div>
            </div>
            {/* Small tail/antlers details using absolute divs */}
            <div className="absolute -top-1 left-1 w-2 h-4 bg-yellow-400 rounded-full rotate-[-45deg]"></div>
            <div className="absolute -top-1 right-1 w-2 h-4 bg-yellow-400 rounded-full rotate-[45deg]"></div>
          </motion.div>
        ))}

        {/* Long Decoration PNG */}
        {[...Array(4)].map((_, i) => (
          <motion.img
            key={`long-${i}`}
            src="/long.png"
            alt="Long Decoration"
            initial={{ 
              top: `${20 + i * 20}%`, 
              left: i % 2 === 0 ? '80%' : '5%',
              opacity: 0,
              scale: 0.25
            }}
            animate={{ 
              opacity: 0.1,
              y: [0, 15, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut"
            }}
            className="absolute w-44 h-44 object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ))}

        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            initial={{ x: Math.random() * 100 + "%", y: "110%" }}
            animate={{ y: "-10%" }}
            transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 10 }}
            className="absolute text-blue-200 opacity-20"
          >
            <Sparkles size={16} />
          </motion.div>
        ))}
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-5 md:py-12 flex flex-col items-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h1 className="text-[2.2rem] md:text-7xl font-black text-blue-600 tracking-tighter mb-4 whitespace-nowrap overflow-hidden">
            GeNan 的生日礼物
          </h1>
          <p className="text-blue-400 font-bold tracking-widest text-lg md:text-xl flex items-center justify-center gap-3">
            <img src="/long.png" alt="" className="w-5 h-5 object-contain animate-pulse" /> 选取你的专属礼物 <img src="/long.png" alt="" className="w-5 h-5 object-contain animate-pulse" />
          </p>
        </motion.div>

        <div className="relative w-full max-w-md mb-5">
          <div className="relative h-[360px] bg-white rounded-[3rem] p-5 shadow-[0_45px_100px_-20px_rgba(59,130,246,0.25)] border-t border-white border-b-[16px] border-blue-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 to-white z-0"></div>
            
            <div className="absolute inset-4 rounded-[3rem] bg-white/5 backdrop-blur-[4px] border border-white/60 shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] z-10 overflow-hidden">
              <div className="absolute inset-0 z-0">
                {ballPositions.map((ball, i) => (
                  <motion.div
                    key={i}
                    animate={isDrawing ? {
                      x: [ 
                        `${ball.x}%`, 
                        `${15 + Math.random() * 70}%`, 
                        `${15 + Math.random() * 70}%`, 
                        `${15 + Math.random() * 70}%`, 
                        `${15 + Math.random() * 70}%`, 
                        `${ball.x}%` 
                      ],
                      y: [ 
                        `${ball.y}%`, 
                        `${15 + Math.random() * 60}%`, 
                        `${15 + Math.random() * 60}%`, 
                        `${15 + Math.random() * 60}%`, 
                        `${15 + Math.random() * 60}%`, 
                        `${ball.y}%` 
                      ],
                      rotate: [ball.rotate, ball.rotate + 1440]
                    } : {
                      y: [`${ball.y}%`, `${ball.y - 1.5}%`, `${ball.y}%`],
                      rotate: [ball.rotate, ball.rotate + 3, ball.rotate]
                    }}
                    transition={isDrawing ? {
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear"
                    } : {
                      duration: 4 + Math.random() * 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      left: `${ball.x}%`,
                      top: `${ball.y}%`,
                      background: ball.color
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-[64px] h-[64px] rounded-full border-t-2 border-white/80 shadow-[0_12px_25px_-5px_rgba(0,0,0,0.1),inset_-3px_-5px_10px_rgba(0,0,0,0.05)] flex items-center justify-center p-2 text-[10px] text-blue-900/50 font-black leading-tight text-center transform-gpu"
                  >
                    <div className="line-clamp-2 select-none">
                      {PRIZES[i]}
                    </div>
                    {/* Glassy highlights */}
                    <div className="absolute top-1 left-2.5 w-5 h-3.5 bg-white/60 rounded-full blur-[1px]"></div>
                    <div className="absolute bottom-2 right-2.5 w-2 h-2 bg-white/30 rounded-full blur-[2px]"></div>
                  </motion.div>
                ))}
              </div>

              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/20 pointer-events-none z-20">
                <div className="absolute top-0 right-[20%] w-20 h-full bg-white/5 skew-x-[15deg]"></div>
                <div className="absolute top-0 right-[15%] w-1 h-full bg-white/10 skew-x-[15deg]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xs mb-6">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 0 }}
            disabled={isDrawing}
            onClick={startDrawing}
            className={`
              group w-full py-5 px-10 rounded-[2.5rem] text-2xl font-black transition-all flex items-center justify-center gap-3
              ${isDrawing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_15px_30px_-5px_rgba(59,130,246,0.4)] border-b-8 border-blue-700 active:border-b-0 active:translate-y-2'
              }
            `}
          >
            {isDrawing ? (
              <RefreshCw className="animate-spin" size={28} />
            ) : (
              <MousePointer2 className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={28} />
            )}
            <span>{isDrawing ? "选取中..." : "选礼物"}</span>
          </motion.button>
        </div>

        <div className="w-full max-w-2xl bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/50 mb-32 shadow-xl shadow-blue-50/50">
          <button
            onClick={() => setIsSurprisesExpanded(!isSurprisesExpanded)}
            className="w-full py-6 px-10 flex items-center justify-between text-blue-500 font-extrabold tracking-[0.1em] text-lg hover:bg-white/40 rounded-[3rem] transition-all"
          >
            <span className="flex items-center gap-3">
              所有的惊喜礼物 {isSurprisesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          </button>
          
          <AnimatePresence>
            {isSurprisesExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 grid grid-cols-2 gap-4 pb-12">
                  {PRIZES.map((prize, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className={`
                        px-4 py-4 rounded-2xl flex items-center justify-center text-center h-16 transition-all duration-300 border
                        ${currentIndex === idx
                          ? 'bg-blue-500 border-blue-400 text-white shadow-lg scale-[1.03] z-10 font-bold'
                          : 'bg-white/70 border-blue-50 text-blue-900/50 text-sm'
                        }
                      `}
                    >
                      <span className="leading-tight break-words px-2">{prize}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-blue-900/40 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 100 }}
              className="relative w-full max-w-sm bg-white rounded-[4rem] p-12 shadow-3xl text-center"
            >
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400 rounded-full border-[10px] border-white shadow-2xl flex items-center justify-center text-white">
                <PartyPopper size={64} className="animate-tada" />
              </div>
              
              <div className="mt-12 mb-10">
                <p className="text-blue-400 font-black uppercase tracking-widest text-xs mb-4">🎁 惊喜降临 🎁</p>
                <div className="py-12 px-6 bg-blue-50 rounded-[3rem] border-2 border-blue-100 shadow-inner">
                  <p className="text-4xl md:text-5xl font-black text-blue-600 leading-tight">
                    {PRIZES[currentIndex]}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopy}
                  className="w-full py-7 rounded-[2.5rem] bg-blue-500 text-white text-2xl font-black shadow-2xl shadow-blue-100 border-b-8 border-blue-700 transition-all active:border-b-0 active:translate-y-2 hover:bg-blue-600"
                >
                  {copied ? "已复制！" : "收下礼物"}
                </motion.button>

                <AnimatePresence>
                  {copied && (
                    <motion.div
                      key="copy-tip"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-4 bg-blue-100 rounded-2xl border border-blue-200 text-center shadow-md">
                        <p className="text-base text-blue-700 font-black leading-relaxed">
                          已选好礼物并复制名称，发送给我，或者再选选都可以 ✨
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setShowModal(false)}
                  className="py-4 text-blue-400 font-extrabold text-xl hover:text-blue-600 transition-all"
                >
                  再选一个试试
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <style>{`
        @keyframes tada {
          0% { transform: scale(1); }
          10%, 20% { transform: scale(0.9) rotate(-3deg); }
          30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
          40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .animate-tada {
          animation: tada 1s infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

