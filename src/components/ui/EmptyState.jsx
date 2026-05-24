import { Link } from "react-router-dom";

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  onAction
}) {

  return (

    <div className="border border-dashed border-gray-200 rounded-[28px] p-8 sm:p-14 text-center">

      <h3 className="text-2xl font-semibold mb-3">

        {title}

      </h3>

      <p className="text-gray-500 max-w-md mx-auto leading-relaxed">

        {description}

      </p>

      {actionLabel && actionTo && (

        <Link
          to={actionTo}
          className="
            inline-flex
            items-center
            justify-center
            mt-7
            px-5
            py-3
            rounded-[18px]
            bg-black
            text-white
            text-sm
            font-medium
            hover:-translate-y-[1px]
            hover:shadow-lg
          "
        >

          {actionLabel}

        </Link>

      )}

      {actionLabel && onAction && (

        <button
          type="button"
          onClick={onAction}
          className="
            inline-flex
            items-center
            justify-center
            mt-7
            px-5
            py-3
            rounded-[18px]
            bg-black
            text-white
            text-sm
            font-medium
            hover:-translate-y-[1px]
            hover:shadow-lg
          "
        >

          {actionLabel}

        </button>

      )}

    </div>

  );

}
