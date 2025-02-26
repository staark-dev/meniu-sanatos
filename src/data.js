export const fetchPlanAlimentar = async () => {
  try {
    const response = await fetch("/plan_alimentar.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Eroare la încărcarea planului alimentar:", error);
    return null;
  }
};