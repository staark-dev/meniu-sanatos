export const fetchPlanAlimentar = async () => {
  try {
    const response = await fetch(process.env.PUBLIC_URL + "/plan_alimentar.json");
    if (!response.ok) {
      throw new Error(`Eroare la încărcarea JSON: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Eroare la încărcarea JSON:", error);
    alert(`Eroare la încărcarea JSON: ${error.message}`);
    return null;
  }
};