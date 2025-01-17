import { useState, useEffect, useRef } from 'react'
import LotteryResult from './components/LotteryResult'
import './App.css'

const App = () => {
  const [prizes, setPrizes] = useState<string[]>([])
  const [drawHistory, setDrawHistory] = useState<string[]>([])
  const [isLotteryResultVisible, setLotteryResultVisible] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentPrize, setCurrentPrize] = useState<string | null>(null)
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState<number | null>(
    null,
  )
  const spinInterval = useRef<number | null>(null)

  const refreshLotteryPrize = () => {
    fetch('/lottery.json')
      .then((response) => response.json())
      .then((data: LotteryItem[]) => {
        // 根据 count 展开奖品数量
        const expandedPrizes = data.flatMap((prize) =>
          Array(prize.count).fill(prize.name),
        )
        setPrizes(expandedPrizes)
      })
      .catch((error) => console.error('Error loading lottery data:', error))
  }

  useEffect(() => {
    refreshLotteryPrize()
  }, [])

  const startSpin = () => {
    if (prizes.length === 0) {
      alert('奖池已空！')
      return
    }
    setIsSpinning(true)
    spinInterval.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * prizes.length)
      setCurrentPrize(prizes[randomIndex])
      setCurrentPrizeIndex(randomIndex) // 记录当前奖品的序号
    }, 100)
  }

  const stopSpin = () => {
    if (!isSpinning) return
    setIsSpinning(false)
    if (spinInterval.current !== null) {
      clearInterval(spinInterval.current!) // 清除定时器
      spinInterval.current = null
    }
    if (currentPrize && currentPrizeIndex !== null) {
      setDrawHistory([...drawHistory, currentPrize])
      // 更新 prizes 数组
      setPrizes((prevPrizes) => {
        const newPrizes = [...prevPrizes]
        newPrizes.splice(currentPrizeIndex, 1) // 通过序号移除奖品
        return newPrizes
      })
    }
    setCurrentPrizeIndex(null) // 重置奖品序号
  }

  const reset = () => {
    refreshLotteryPrize()
    setDrawHistory([])
    setCurrentPrize(null)
  }

  const undoLastDraw = () => {
    if (drawHistory.length > 0) {
      const lastPrize = drawHistory[drawHistory.length - 1]
      setPrizes([...prizes, lastPrize])
      setDrawHistory(drawHistory.slice(0, -1))
    } else {
      alert('没有可回退的抽奖记录！')
    }
  }

  const toggleLotteryResult = () => {
    setLotteryResultVisible(!isLotteryResultVisible)
  }

  return (
    <div className="App bg-red-800 w-svw h-svh overflow-hidden flex flex-col items-center relative">
      <h1 className="pt-36 flex justify-center mb-16 translate-x-32">
        <div className="relative">
          <img
            src="/images/logo-2025.png"
            className="absolute w-80 bottom-0 -left-full"
          />
          <span className="text-white text-7xl font-bold">年会抽奖</span>
        </div>
      </h1>
      <div className="text-white text-2xl font-bold text-center my-8">
        {currentPrize || '抽奖未开始'}
      </div>
      <button onClick={isSpinning ? stopSpin : startSpin}>
        {isSpinning ? '停止' : '抽奖'}
      </button>
      <div className="absolute right-2 bottom-2">
        <button onClick={toggleLotteryResult}>显示抽奖结果</button>
      </div>
      <div className="my-4 text-center text-white">
        剩余奖品数：{prizes.length}
      </div>
      <LotteryResult
        isVisible={isLotteryResultVisible}
        onClose={toggleLotteryResult}
        reset={reset}
        undoLastDraw={undoLastDraw}
        drawHistory={drawHistory}
      />
    </div>
  )
}

export default App
