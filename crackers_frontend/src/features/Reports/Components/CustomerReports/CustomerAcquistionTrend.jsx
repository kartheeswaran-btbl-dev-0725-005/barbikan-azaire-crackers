import {
  Card,
  CardHeader,
  CardContent,
} from "../../../../shared/components/ui/Card";
import TitleCard from "../../../../shared/components/ui/TitleCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jun", value: 1 },
  { month: "Jul", value: 1 },
  { month: "Aug", value: 1 },
];

const CustomerAcquisitionTrend = () => {
  return (
    <div className="div">
      <Card>
        <CardHeader>
          <TitleCard
            heading="Customer Acquisition Trend"
            tagline="New customers by month"
            variant="gridCardArea"
            customStyles={{
              containerClass: "pl-1 mt-1 mb-4",
              taglineClass: "text-sm text-muted",
            }}
          />
        </CardHeader>
        <CardContent className="pl-1">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip />
              <Line
                type="linear"
                dataKey="value"
                stroke="#7C3AED"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerAcquisitionTrend;
