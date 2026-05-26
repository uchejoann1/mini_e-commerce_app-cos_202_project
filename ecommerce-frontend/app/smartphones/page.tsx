import React from "react";
import { Layout } from "../components/Layout";

type Product = {
  id: string | number;
  name: string;
  brand?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  rating?: number;
  review_count?: number;
  is_deal?: boolean;
};
