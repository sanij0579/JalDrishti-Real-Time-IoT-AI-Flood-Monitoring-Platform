import api from "./api";

export const getReviews = () => api.get("/reviews/").then(r => r.data);
export const createReview = (data: any) => api.post("/reviews/", data).then(r => r.data);
export const deleteReview = (id: number) => api.delete(`/reviews/${id}/`);