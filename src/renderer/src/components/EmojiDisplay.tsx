import { Emoji } from '@shared/models'

export const EmojiDisplay = ({ emoji, file = true }: { emoji: Emoji; file: boolean }) => {
  return (
    <div>
      {emoji?.src ? (
        <img src={emoji?.src} alt="emoji" className={`${file ? 'w-5 h-5' : 'w-28 h-28'}`} />
      ) : (
        <span className={`${file ? 'text-xl' : ''}`}>{emoji?.native || '📖'}</span>
      )}
    </div>
  )
}
