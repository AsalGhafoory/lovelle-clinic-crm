export default function Textarea({
  className = "",
  ...props
}) {

  return (

    <textarea
      className={`
        vela-input
        min-h-[140px]
        resize-none
        ${className}
      `}
      {...props}
    />

  );

}