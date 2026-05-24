export default function Card({
  children,
  className = ""
}) {

  return (

    <div
      className={`
        vela-card
        ${className}
      `}
    >

      {children}

    </div>

  );

}