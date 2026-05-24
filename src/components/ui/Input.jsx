export default function Input({
  className = "",
  ...props
}) {

  return (

    <input
      className={`
        vela-input
        ${className}
      `}
      {...props}
    />

  );

}