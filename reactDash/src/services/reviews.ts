import axios from "axios";

export type Review = {
  id: number;
  comment: string;
  image?: string;
  created_at: string;
};

export const getReviews = async (): Promise<Review[]> => {
  const res = await axios.get("http://10.107.0.142:8000/api/reviews/");
  return res.data;
};