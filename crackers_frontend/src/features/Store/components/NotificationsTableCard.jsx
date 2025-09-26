import { Card, CardHeader, CardContent } from "../../../shared/components/ui/Card";
import TitleCard from "../../../shared/components/ui/TitleCard";

function NotificationsTableCard() {
    return (
        <Card className="w-full">
            <CardHeader className="flex justify-between items-center">
                <TitleCard
                    heading="Notifications Settings"
                    tagline="Configure notification preferences"
                    variant="cardArea"
                />
            </CardHeader>
            <CardContent>
                {/* Notifications settings content goes here */}
                <p className="text-base text-gray-400 mt-1">
                    🔔 Notification preferences will be available soon. Stay in control of your alerts.
                </p>
            </CardContent>
        </Card>
    )
}

export default NotificationsTableCard