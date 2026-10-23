const VARIANTS = {
  dark: 'bg-amber-950 text-white hover:bg-amber-900',
  outline: 'border-2 border-amber-950 text-amber-950 hover:bg-amber-950/10',
}

const SIZES = {
  sm: 'h-10 px-5 text-base',
  md: 'h-12 px-7 text-lg',
  lg: 'h-14 px-8 text-lg',
}

// Botón con forma de píldora. Con `href` se renderiza como enlace
export default function Button({ href, variant = 'dark', size = 'md', className = '', children, ...props }) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-950',
    VARIANTS[variant],
    SIZES[size],
    className,
  ].join(' ')

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}