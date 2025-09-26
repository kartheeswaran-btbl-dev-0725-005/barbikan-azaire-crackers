import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "../../../shared/components/ui/Card";
import TitleCard from "../../../shared/components/ui/TitleCard";
import { FiBook } from "react-icons/fi";
import { guides } from "../../../shared/constants/mockData/sample_data";
import Button from "../../../shared/components/ui/Button";

function UserGuides() {
    return (
        <Card>
            <CardHeader className="flex items-center justify-between gap-4">
                <TitleCard
                    heading={
                        <div className="flex items-center gap-2">
                            <FiBook size={20} />
                            <span>User Guides</span>
                        </div>
                    }
                    tagline="Comprehensive guides to help you master Azaire POS"
                    variant="cardArea"
                    customStyle="gap-2"
                />
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    {guides.map((guide, index) => (
                        <Card key={index} className="flex flex-col items-start justify-between">
                            <CardHeader className="flex flex-col items-start justify-between">
                                <CardTitle>{guide.title}</CardTitle>
                                <CardDescription>{guide.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-5 w-full">
                                <ul className="list-disc space-y-2 pl-5">
                                    {guide.topics.map((topic, topicIndex) => (
                                        <li key={topicIndex} className="text-xs">
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                                <Button variant="themeInverted" className="mt-4 w-full">
                                    Read Guide
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default UserGuides;
