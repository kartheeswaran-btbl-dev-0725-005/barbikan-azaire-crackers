import { Card, CardHeader, CardContent } from "../../../shared/components/ui/Card";
import TitleCard from "../../../shared/components/ui/TitleCard";


function AppearanceTableCard() {
    return (
        <Card className="w-full">
            <CardHeader className="flex justify-between items-center">
                <TitleCard
                    heading="Store Appearance"
                    tagline="Customize your store's visual appearance"
                    variant="cardArea"
                />
            </CardHeader>
            <CardContent>
                {/* Appearance settings content goes here */}
                <p className="text-base text-gray-400 mt-1">
                    ✨ Store appearance customization is on its way. Stay tuned!
                </p>
            </CardContent>
        </Card>
    )
}

export default AppearanceTableCard