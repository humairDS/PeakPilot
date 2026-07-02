function MealCard({ meal }) {
  return (
    <div className="card mb-4">
      <h3 className="text-xl font-bold mb-2">{meal.meal}</h3>

      <div className="space-y-2">
        {meal.foods?.map((food, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border"
            style={{ borderColor: "rgba(0,0,0,0.08)" }}
          >
            {food}
          </div>
        ))}
      </div>

      <p className="mt-3 font-semibold">
        Calories: {meal.calories ?? 0}
      </p>
    </div>
  );
}

export default MealCard;