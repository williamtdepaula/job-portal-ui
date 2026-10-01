import { useState } from 'react'

const isSafeSrc = (src) =>
  typeof src === 'string' && ((src.startsWith('/') && !src.startsWith('//')) || src.startsWith('https://'))

export const CompanyLogo = ({ src, name, imgClassName, fallbackClassName }) => {
  const [failed, setFailed] = useState(false)

  if (failed || !isSafeSrc(src)) {
    return (
      <div className={fallbackClassName}>
        {typeof name === 'string' ? name.charAt(0) : '?'}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      className={imgClassName}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}
