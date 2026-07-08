const API = import.meta.env.VITE_BACKEND_URL;

export const downloadInvoice = async (orderId, token) => {
  const response = await fetch(`${API}/api/orders/invoice/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to download invoice");
  }

  return response.blob();
};