import { useState } from "react";
import { Card, CardHeader, CardContent } from "../../../shared/components/ui/Card";
import TitleCard from "../../../shared/components/ui/TitleCard";
import { FiHelpCircle } from "react-icons/fi";
import Accordion from "../../../shared/components/ui/Accordion";
import { faqData } from "../../../shared/constants/mockData/sample_data";

function FaqCard() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <Card>
            <CardHeader className="flex items-center justify-between gap-4">
                <TitleCard
                    heading={
                        <div className="flex items-center gap-2">
                            <FiHelpCircle size={20} />
                            <span>Frequently Asked Questions</span>
                        </div>
                    }
                    tagline="Find quick answers to common questions"
                    variant="cardArea"
                    customStyle="gap-2"
                />
            </CardHeader>
            <CardContent className="mb-5">
                {faqData.map((item, index) => (
                    <Accordion
                        key={item.id}
                        title={item.question}
                        isOpen={openIndex === index}
                        onClick={() =>
                            setOpenIndex(openIndex === index ? null : index)
                        }
                    >
                        {item.answer}
                    </Accordion>
                ))}
            </CardContent>
        </Card>
    )
}

export default FaqCard