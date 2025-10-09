import { useEffect, useState } from "react";
import axios from "axios";

type Review = {
  id: number;
  comment: string;
  image?: string;
  created_at: string;
};

export default function About() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://10.107.0.142:8000/api/reviews/")
      .then(res => setReviews(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading offline data...</p>;

  return (
    <div className="card">
      <h2>About / Offline Data</h2>
      {reviews.map(r => (
        <div key={r.id} className="offline-card">
          <p><strong>Comment:</strong> {r.comment}</p>
          {r.image && <img src={r.image} alt="review" style={{ width: "100%", maxHeight: 200, borderRadius: 8 }} />}
          <p style={{ fontSize: 12, color: "#555" }}>{new Date(r.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}