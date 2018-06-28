export async function getData() {
  const res = await fetch("api/data", {
    accept: "application/json"
  });

  return res.json();
}
