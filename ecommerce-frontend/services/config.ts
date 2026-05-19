export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getAllProducts = async() => {
    const response = await fetch(`${BASE_URL}/products`);
    return await response.json();
}