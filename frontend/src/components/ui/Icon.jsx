const iconPaths = {
  alert: <path d="M12 3 3 21h18L12 3Zm0 7v4m0 4h.01" />,
  arrowLeft: <path d="M19 12H5m6-6-6 6 6 6" />,
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  box: <path d="m21 8-9-5-9 5 9 5 9-5Zm0 0v8l-9 5-9-5V8m9 5v8" />,
  calendar: <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />,
  chart: <path d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-9" />,
  checkCircle: <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  clock: <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-5v5l3 2" />,
  cube: <path d="m12 2 8 4.5v9L12 20l-8-4.5v-9L12 2Zm0 9 8-4.5M12 11 4 6.5M12 11v9" />,
  document: <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M9 13h6m-6 4h6" />,
  dots: <path d="M12 6h.01M12 12h.01M12 18h.01" />,
  download: <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />,
  edit: <path d="m4 20 4.5-1L19 8.5 15.5 5 5 15.5 4 20Z" />,
  eye: <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  eyeOff: <path d="m3 3 18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.8M6.2 6.8C3.5 8.6 2 12 2 12s3.5 6 10 6c1.6 0 3-.3 4.2-.9M9.9 5.2A11.1 11.1 0 0 1 12 5c6.5 0 10 7 10 7s-.8 1.6-2.4 3.2" />,
  file: <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5" />,
  filter: <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" />,
  home: <path d="m3 11 9-8 9 8v10h-6v-6H9v6H3V11Z" />,
  lock: <path d="M7 10V7a5 5 0 0 1 10 0v3m-11 0h12v11H6V10Zm6 5v2" />,
  mail: <path d="M4 5h16v14H4V5Zm0 2 8 6 8-6" />,
  move: <path d="M14 3h7v7m0-7-8 8M10 21H3v-7m0 7 8-8" />,
  plus: <path d="M12 5v14M5 12h14" />,
  save: <path d="M5 3h12l2 2v16H5V3Zm3 0v6h8V3M8 21v-7h8v7" />,
  search: <path d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />,
  settings: <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Zm0-13v3m0 13v3m9.5-9.5h-3m-13 0h-3m16.7-6.7-2.1 2.1m-9.2 9.2-2.1 2.1m0-13.4 2.1 2.1m9.2 9.2 2.1 2.1" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-4" />,
  trash: <path d="M4 7h16M9 7V4h6v3m-9 0 1 14h10l1-14M10 11v6m4-6v6" />,
  trend: <path d="M4 17 10 11l4 4 6-8m0 0h-5m5 0v5" />,
  users: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m10-10a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm10 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />,
  xCircle: <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-6-3-6 6m0-6 6 6" />,
};

export function Icon({ name }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {iconPaths[name] || iconPaths.file}
    </svg>
  );
}
