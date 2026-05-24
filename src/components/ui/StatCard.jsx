import Card from "./Card";

export default function StatCard({
  title,
  value,
  icon: Icon
}) {

  return (

    <Card>

      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-500">
            {title}
          </p>

          <h2 className="text-5xl font-semibold mt-5">
            {value}
          </h2>

        </div>

        <div className="
          w-14
          h-14
          rounded-2xl
          bg-[#f5f5f4]
          flex
          items-center
          justify-center
        ">

          {Icon && <Icon size={24} />}

        </div>

      </div>

    </Card>

  );

}