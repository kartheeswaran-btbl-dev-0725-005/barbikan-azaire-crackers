import {
  Card,
  CardHeader,
  CardContent,
} from "../../../../shared/components/ui/Card";
import TitleCard from "../../../../shared/components/ui/TitleCard";

const ProgressBar = ({ label, value, total, percentage, units }) => {
  const progress =
    typeof percentage === "number"
      ? percentage
      : total
        ? (value / total) * 100
        : 0;

  const displayValue = () => {
    if (typeof percentage === "number") {
      if (units !== undefined && units !== null) {
        return `(${units} units) (${percentage}%)`;
      }
      return `(${percentage}%)`;
    } else if (typeof value === "number" && typeof total === "number") {
      return `${value}/${total}`;
    } else {
      return "0";
    }
  };

  return (
    <div className="mb-4 w-full">
      <div className="flex justify-between items-center mb-1 w-full">
        <span className="text-sm text-gray-800">{label}</span>
        <span className="text-sm text-gray-800">{displayValue()}</span>
      </div>

      <div className="w-full h-[6px] bg-[#dddde1] rounded">
        <div
          className="h-[6px] bg-[#050011] rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const CustomerMetricsCard = ({ title, subtitle, metrics, showUnits = true }) => {
  return (
    <Card className="h-[340px]">
      <CardHeader>
        <TitleCard
          heading={title}
          tagline={subtitle}
          variant="gridCardArea"
          customStyles={{
            containerClass: "pl-1 mt-1 mb-4",
            taglineClass: "text-sm text-muted",
          }}
        />
      </CardHeader>
      <CardContent>
        {metrics.map((metric, index) => (
          <ProgressBar
            key={index}
            label={metric.label}
            value={metric.value}
            total={metric.total}
            units={metric.units}
            percentage={metric.percentage}
            showUnits={showUnits}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default CustomerMetricsCard;
