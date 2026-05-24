export default function Button({
  children,
  className = "",
  ...props
}) {

  return (

    <button
      className={`
        vela-button
        disabled:opacity-50
        disabled:pointer-events-none
        ${className}
      `}
      {...props}
    >

      {children}

    </button>

  );

}
