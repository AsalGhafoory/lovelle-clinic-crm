export default function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
  children
}) {

  return (

    <div
      className={`
        flex
        flex-col
        lg:flex-row
        lg:items-end
        lg:justify-between
        gap-5
        sm:gap-6

        ${align === "center"
          ? "items-center text-center"
          : ""
        }
      `}
    >

      <div className="min-w-0 max-w-4xl">

        {eyebrow && (

          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.28em]
              text-gray-400
              mb-3
            "
          >

            {eyebrow}

          </p>

        )}

        <h1
          className="
            text-[34px]
            sm:text-[44px]
            lg:text-[52px]
            font-semibold
            tracking-[-0.04em]
            leading-[0.98]
          "
        >

          {title}

        </h1>

        {description && (

          <p
            className="
              vela-subtitle
              max-w-2xl
              text-[15px]
              sm:text-base
              mt-4
            "
          >

            {description}

          </p>

        )}

      </div>

      {children && (

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
            lg:justify-end
            shrink-0
          "
        >

          {children}

        </div>

      )}

    </div>

  );

}
