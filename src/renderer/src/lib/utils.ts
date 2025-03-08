import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { PointerEvent as ReactPointerEvent } from 'react'
import { Open } from '@renderer/routes/__root'

dayjs.extend(relativeTime)

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

export function getTimeFromNow(date: string | Date | number): string {
  return dayjs(date).fromNow()
}

export function defaultDateTimeFormat(date: string | Date | number): string {
  return dayjs(date).format('dddd MMM D YYYY, h:mm a')
}

export function getDateFromTime(date: string | Date | number): string {
  return dayjs(date).format('MMM D YYYY')
}

export function getMonthFromTime(date: string | Date | number): string {
  return dayjs(date).format('MMMM')
}

export function getYearFromTime(date: string | Date | number): string {
  return dayjs(date).format('YYYY')
}

export function getMonthAndYearFromTime(date: string | Date | number): string {
  return dayjs(date).format('MMMM YYYY')
}

export const clamp = (number, boundOne, boundTwo) => {
  if (!boundTwo) {
    return Math.max(number, boundOne) === boundOne ? number : boundOne
  } else if (Math.min(number, boundOne) === number) {
    return boundOne
  } else if (Math.max(number, boundTwo) === number) {
    return boundTwo
  }
  return number
}

export function greetingTime(): string {
  const currentHour = dayjs().hour()
  if (currentHour >= 5 && currentHour < 12) {
    return 'Good morning'
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good afternoon'
  } else if (currentHour >= 18 && currentHour < 22) {
    return 'Good evening'
  } else {
    return 'Good night'
  }
}

export function onPointerDown({
  e,
  originalWidth,
  originalClientX,
  setDragging,
  setWidth,
  setState,
  width
}: {
  e: ReactPointerEvent
  originalWidth: React.MutableRefObject<number>
  originalClientX: React.MutableRefObject<number>
  setDragging: (dragging: boolean) => void
  setWidth: (width: number) => void
  setState: SetAtom<[SetStateActionWithReset<Open>]>
  width: number
}) {
  // this prevents dragging from selecting
  e.preventDefault()

  const { ownerDocument } = e.currentTarget
  originalWidth.current = width
  originalClientX.current = e.clientX
  setDragging(true)

  function onPointerMove(e: PointerEvent) {
    if (e.clientX < 50) setState(Open.Closed)
    else setState(Open.Open)

    setWidth(
      // clamp the width between 200 and 500
      Math.floor(clamp(originalWidth.current + e.clientX - originalClientX.current, 300, 500))
    )
  }

  function onPointerUp() {
    ownerDocument.removeEventListener('pointermove', onPointerMove)
    setDragging(false)
  }

  ownerDocument.addEventListener('pointermove', onPointerMove)
  ownerDocument.addEventListener('pointerup', onPointerUp, {
    once: true
  })
}
