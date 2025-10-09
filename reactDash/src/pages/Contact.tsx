import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BASE_URL = "http://10.107.0.142:8000/api";

type HistoricalRainfall = {
  year: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  june: number;
  july: number;
  aug: number;
  sept: number;
  oct: number;
  nov: number;
  dec: number;
  total: number;
};

export default function Contacts() {
  const [historicalRainfall, setHistoricalRainfall] = useState<HistoricalRainfall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalRainfall = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/historical-rainfall/`);
        setHistoricalRainfall(res.data);
      } catch (err) {
        console.error("Error fetching historical rainfall:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistoricalRainfall();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Loading Data...</div>
      </div>
    );
  }

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div style={{ padding: 20, backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", color: "#2563eb", marginBottom: 20 }}>
        Offline Historical Rainfall Data
      </h2>

      {historicalRainfall.map((yearData) => {
        const monthlyValues = [
          yearData.jan, yearData.feb, yearData.mar, yearData.apr,
          yearData.may, yearData.june, yearData.july, yearData.aug,
          yearData.sept, yearData.oct, yearData.nov, yearData.dec
        ];

        const lineChartData = {
          labels: months,
          datasets: [
            {
              label: `Rainfall ${yearData.year} (mm)`,
              data: monthlyValues,
              borderColor: "#2563eb",
              backgroundColor: "rgba(37, 99, 235, 0.2)",
              tension: 0.3,
            }
          ]
        };

        const barChartData = {
          labels: months,
          datasets: [
            {
              label: `Rainfall ${yearData.year} (mm)`,
              data: monthlyValues,
              backgroundColor: "rgba(37, 99, 235, 0.7)"
            }
          ]
        };

        const chartOptions = {
          responsive: true,
          plugins: {
            legend: {
              position: "top" as const
            },
            title: {
              display: true,
              text: `Year ${yearData.year} Rainfall`,
            }
          },
          scales: {
            y: { beginAtZero: true }
          }
        };

        return (
          <div
            key={yearData.year}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              marginBottom: 40,
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginBottom: 10 }}>{yearData.year}</h3>

            {/* Grid / Table View */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 6, columnGap: 12, marginBottom: 20 }}>
              {months.map((m, idx) => (
                <div key={m}><strong>{m}:</strong> {monthlyValues[idx]} mm</div>
              ))}
              <div><strong>Total:</strong> {yearData.total} mm</div>
            </div>

            {/* Line Chart */}
            <div style={{ marginBottom: 20 }}>
              <Line data={lineChartData} options={chartOptions} />
            </div>

            {/* Bar Chart */}
            <div>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        );
      })}
    </div>
  );
}