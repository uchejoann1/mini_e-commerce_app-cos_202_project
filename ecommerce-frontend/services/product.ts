import { BASE_URL } from './config';
export const getProductById = async (id: string) => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    return await response.json();
}

export const getAllProducts = async() => {
    const response = await fetch(`${BASE_URL}/products`);
    return await response.json();
}