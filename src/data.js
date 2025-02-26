export const fetchPlanAlimentar = async () => {
  try {
    alert("Încerc să încarc JSON-ul...");
    const response = await fetch("/plan_alimentar.json");
    if (!response.ok) {
      alert(`Eroare la încărcare: ${response.status} ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    alert("JSON încărcat cu succes!");
    return data;
  } catch (error) {
    alert("Eroare la încărcarea JSON!");
    return null;
  }
};