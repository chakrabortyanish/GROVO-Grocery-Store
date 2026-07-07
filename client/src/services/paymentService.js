const API = import.meta.env.VITE_BACKEND_URL;

export const createOrder = async (body, token) => {
  console.log("Creating order with body:", API);
  const res = await fetch(`${API}/api/orders/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return res.json();
};

export const verifyPayment = async (body, token) => {
  const res = await fetch(`${API}/api/orders/verify-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return res.json();
};