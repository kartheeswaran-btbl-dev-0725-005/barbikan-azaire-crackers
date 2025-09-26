import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "../../../shared/components/ui/Card";

function getLabelStyles(type) {
    switch (type) {
        case "warning":
            return "bg-orange-700";
        case "success":
            return "bg-green-700";
        case "info":
        default:
            return "bg-blue-700";
    }
}

function RecentNotifications({ notifications }) {
    return (
        <Card>
            <CardHeader className="flex-col">
                <CardTitle className="text-sm">Recent Notifications</CardTitle>
                <CardDescription>Latest system alerts and updates</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {notifications.slice(0, 3).map((notification) => (
                        <div
                            key={notification.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                            <div className="flex-1 space-y-1">
                                <p className="text-xs font-medium">{notification.title}</p>
                                <p className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                                    {notification.message}
                                </p>
                            </div>
                            <div
                                className={`inline-flex items-center justify-center w-15 px-2 py-0.5 rounded-md text-[10px] text-white font-semibold ${getLabelStyles(notification.type)}`}
                            >
                                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default RecentNotifications;
