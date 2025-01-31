import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

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