export default function SectionHeader({
  eyebrow,
  title,
  subtitle
}) {

  return (

    <div>

      {eyebrow && (

        <p className="text-sm uppercase tracking-[0.25em] text-gray-400 mb-3">

          {eyebrow}

        </p>

      )}

      <h2 className="vela-section-title">

        {title}

      </h2>

      {subtitle && (

        <p className="vela-subtitle">

          {subtitle}

        </p>

      )}

    </div>

  );

}