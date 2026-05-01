const paths = {
  bell: <path d="M12 3a6 6 0 0 0-6 6v3.3c0 .5-.2 1-.6 1.4L4 15h16l-1.4-1.3c-.4-.4-.6-.9-.6-1.4V9a6 6 0 0 0-6-6zm0 18a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 21z" />,
  eye: <path d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />,
  mail: <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 2v.3l8 5 8-5V8H4zm16 2.7-7.5 4.7a1 1 0 0 1-1 0L4 10.7V16h16v-5.3z" />,
  phone: <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v14h10V4H7zm4 15h2v1h-2v-1z" />,
  video: <path d="M4 6h11a2 2 0 0 1 2 2v2.5l4-2.5v10l-4-2.5V16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />,
  cube: <path d="M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.3L18.8 8 12 11.7 5.2 8 12 4.3zM5 9.7l6 3.3v7L5 16.5V9.7zm14 0v6.8l-6 3.5v-7l6-3.3z" />,
  globe: <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.9 9h-3.4a15 15 0 0 0-1.6-6.3A8 8 0 0 1 19.9 11zM12 4c1 0 2.4 2.2 2.9 7H9.1C9.6 6.2 11 4 12 4zM4.1 11a8 8 0 0 1 4.9-6.3A15 15 0 0 0 7.5 11H4.1zm0 2h3.4a15 15 0 0 0 1.6 6.3A8 8 0 0 1 4.1 13zm7.9 7c-1 0-2.4-2.2-2.9-7h5.8c-.5 4.8-1.9 7-2.9 7zm2.9-.7a15 15 0 0 0 1.6-6.3h3.4a8 8 0 0 1-5 6.3z" />,
  ruler: <path d="M3 17 17 3l4 4L7 21l-4-4zm2.8 0L7 18.2l1.5-1.5-.7-.7-1.5 1.5-.7-.7 2.5-2.5-.7-.7-2.5 2.5L3.8 15 5 13.8l4.2 4.2L8 19.2 5.8 17z" />,
  circle: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 2a7 7 0 1 1 0 14 7 7 0 0 1 0-14z" />,
  check: <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />,
  home: <path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3L12 3z" />,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.3 0-8 1.7-8 5v3h16v-3c0-3.3-4.7-5-8-5z" />,
  card: <path d="M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 2v2h18V8H3zm0 4v5h18v-5H3zm2 2h5v1H5v-1z" />,
  help: <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm2-7.5c0 1.5-2 2-2 3.5h-2c0-2.5 2-2.5 2-3.5a1.5 1.5 0 0 0-3 0H8a3.5 3.5 0 0 1 7 0z" />,
  logout: <path d="M10 17v-2H5V9h5V7l-5 0a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h5zm2-3h6.2l-2 2 1.4 1.4L21.4 13l-3.8-4.4-1.4 1.4 2 2H12v2z" />,
  grid: <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />,
  sort: <path d="M3 6h18M3 12h12M3 18h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  search: <path d="M10 3a7 7 0 1 0 4.5 12.4l4.3 4.3 1.4-1.4-4.3-4.3A7 7 0 0 0 10 3zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />,
  arrowDown: <path d="M12 4v16m0 0l-5-5m5 5l5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  folder: <path d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2H4z" />,
  folderPlus: <><path d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2H4z" /><path d="M12 11v6M9 14h6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" /></>,
  more: <><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></>,
  edit: <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  trash: <path d="M5 7h14l-1.5 12a1 1 0 0 1-1 .9h-9a1 1 0 0 1-1-.9L5 7zm3-4h8a1 1 0 0 1 1 1v1H7V4a1 1 0 0 1 1-1zM4 7h16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  close: <path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  chevron: <path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  chevronLeft: <path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  share: <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M8 7l4-4 4 4M12 3v12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  play: <path d="M8 5v14l11-7L8 5z" />,
  floorplan: <><path d="M0 9.6H12V24H0V9.6Z" /><path d="M0 0H12V7.2H0V0Z" /><path d="M14.4 0H24V14.4H14.4V0Z" /></>,
  pano: <g transform="translate(0 4) scale(0.667)"><path d="M31.0792 3.5484C31.0792 5.50812 25.1812 7.09679 17.9055 7.09679C10.6299 7.09679 4.73187 5.50812 4.73187 3.5484C4.73187 1.58867 10.6299 0 17.9055 0C25.1812 0 31.0792 1.58867 31.0792 3.5484Z" /><path d="M12.0506 5.67743H23.7605V12.7742H12.0506V5.67743Z" /><path d="M9.12321 9.22577V22C6.8997 21.6706 5.70994 21.0497 4.00011 19.1613V7.09674C5.71594 8.77736 6.79595 9.32846 9.12321 9.22577Z" /><path d="M26.8768 9.22577V22C29.1003 21.6706 30.2901 21.0497 31.9999 19.1613V7.09674C30.2841 8.77736 29.2041 9.32846 26.8768 9.22577Z" /></g>,
  logoMark: <g transform="translate(1.5 2) scale(0.6)"><path d="M10.9639 13.272L17.0632 9.79038V0.108398L2.48242 8.43103L10.9639 13.272Z" /><path d="M33.2322 8.43103L18.6514 0.108398V9.79038L24.7507 13.272L33.2322 8.43103Z" /><path d="M17.0621 28.4536L0.712891 19.121V9.44043L17.0621 18.7717V28.4536Z" /><path d="M35.0006 9.44043L18.6514 18.7717V28.4536L35.0006 19.121V9.44043Z" /></g>,
  plus: <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z" />,
  userCheck: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="4" /><path d="M2 21v-1a7 7 0 0 1 12-5" /><path d="m15 17 2.5 2.5L22 15" /></g>,
  clock: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></g>,
}

export function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`ic ${className}`}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
