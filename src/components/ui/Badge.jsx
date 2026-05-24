export default function Badge({
  children,
  variant = "dark",
  className = ""
}) {

  const variants = {

    dark: `
      bg-black
      text-white
    `,

    light: `
      bg-[#f5f5f4]
      text-black
    `

  };

  return (

    <div
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        px-5
        py-3
        rounded-full
        text-sm
        font-medium
        whitespace-nowrap
        transition-all
        duration-300
        ${variants[variant]}
        ${className}
      `}
    >

      {children}

    </div>

  );

}
