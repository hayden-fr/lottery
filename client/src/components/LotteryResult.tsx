import { useState, useEffect } from 'react'
import classnames from 'classnames'

interface LotteryResultProps {
  isVisible: boolean
  onClose: () => void
  reset: () => void
  undoLastDraw: () => void
  drawHistory: string[]
}

const LotteryResult: React.FC<LotteryResultProps> = ({
  isVisible,
  onClose,
  reset,
  undoLastDraw,
  drawHistory,
}) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(isVisible)
  }, [isVisible])

  const closeDrawer = () => {
    setDrawerOpen(false)
    onClose()
  }

  return (
    <div
      className={classnames(
        'fixed w-full h-full left-0 top-0 bg-black/50',
        isDrawerOpen ? 'block' : 'hidden',
      )}
      onClick={closeDrawer}
    >
      <div
        className={classnames(
          'fixed bottom-0 right-0 w-1/4 h-full bg-red-800 text-white transition-transform transform',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex justify-end gap-2 p-4">
          <button onClick={reset}>重置</button>
          <button onClick={undoLastDraw} disabled={drawHistory.length === 0}>
            回退
          </button>
          <button onClick={closeDrawer}>关闭</button>
        </div>
        <h2 className="px-4 text-xl font-bold">抽奖结果</h2>
        <ul
          className="p-4 overflow-y-auto"
          style={{ height: 'calc(100% - 6.25rem)' }}
        >
          {drawHistory.map((prize, index) => (
            <li key={index} className="mb-2">
              {prize}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LotteryResult
