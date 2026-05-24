import Card from "./Card";

export default function LoadingCard({
  title = "Loading",
  description = "Fetching the latest workspace data..."
}) {

  return (

    <Card>

      <div className="animate-pulse">

        <div className="h-3 w-24 rounded-full bg-stone-200 mb-5" />

        <div className="h-8 w-48 rounded-full bg-stone-200 mb-4" />

        <div className="space-y-3">

          <div className="h-4 w-full max-w-md rounded-full bg-stone-100" />

          <div className="h-4 w-3/4 max-w-sm rounded-full bg-stone-100" />

        </div>

      </div>

      <div className="sr-only">

        <p>{title}</p>

        <p>{description}</p>

      </div>

    </Card>

  );

}
