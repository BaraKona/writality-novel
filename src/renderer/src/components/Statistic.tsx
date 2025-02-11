import { FC } from 'react'

interface StatisticProps {
  text: string
  content: string
  align?: 'left' | 'right'
  className?: string
}

export const Statistic: FC<StatisticProps> = ({ text, content, align, className }) => {
  const alignment = align ? 'text-' + align : 'text-left'
  return (
    <div
      className={
        (className || '') + ' ' + alignment + ' ' + 'text-medium text-xs text-muted-foreground'
      }
    >
      {(text || '') + ': ' + (content || '')}
    </div>
  )
}
