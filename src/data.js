export const fetchPlanAlimentar = async () => {
  try {
    console.log("Încerc să încarc JSON-ul...");
    const response = await fetch("/plan_alimentar.json");
    if (!response.ok) {
      throw new Error(`Eroare la încărcarea JSON: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("JSON încărcat cu succes:", data);
    return data;
  } catch (error) {
    console.error("Eroare la încărcarea JSON:", error);
    alert(`Eroare la încărcarea JSON: ${error.message}`);
    return null;
  }
};