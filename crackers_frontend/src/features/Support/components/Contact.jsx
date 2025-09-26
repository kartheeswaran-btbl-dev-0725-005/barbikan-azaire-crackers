import { Card, CardHeader, CardContent } from "../../../shared/components/ui/Card";
import TitleCard from "../../../shared/components/ui/TitleCard";
import Form from "../../../shared/components/Form/Form";
import { FiPhone, FiMail, FiMessageSquare } from "react-icons/fi";

function ContactCard() {
    const formData = {
        name: { label: "Your Name", type: "text", placeholder: "Enter your name", required: true },
        email: { label: "Email Address", type: "email", placeholder: "Enter your email", required: true },
        subject: { label: "Subject", type: "text", placeholder: "How can we help?", required: true },
        message: { label: "Message", type: "textarea", placeholder: "Describe your issue or question...", required: true }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Contact Support Card */}
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <TitleCard
                        heading="Contact Support"
                        icon={<FiMessageSquare size={20} />}
                        tagline="Send us a message and we'll get back to you soon"
                        variant="cardArea"
                        customStyles={{
                            titleClass: "flex items-center gap-2"
                        }}
                    />
                </CardHeader>
                <CardContent className="flex flex-col h-full gap-4">
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            // Handle form submission logic here
                            console.log("Form submitted");
                        }}
                        buttonLabel="Send Message"
                        buttonVariant="themeContrast"
                        formData={formData}
                    />
                </CardContent>
            </Card>

            {/* Get in Touch Card */}
            <Card>
                <CardHeader>
                    <TitleCard
                        heading="Get in Touch"
                        tagline="Other ways to reach our support team"
                        variant="cardArea"
                    />
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {/* Phone Support */}
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
                        <FiPhone size={15} className="mt-1" />
                        <div>
                            <p className="font-medium text-sm">Phone Support</p>
                            <p className="text-xs text-gray-600">+91 1800-XXX-XXXX</p>
                            <p className="text-[10px] text-gray-500">Mon-Fri, 9 AM - 6 PM IST</p>
                        </div>
                    </div>

                    {/* Email Support */}
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
                        <FiMail size={15} className="mt-1" />
                        <div>
                            <p className="font-medium text-sm">Email Support</p>
                            <p className="text-xs text-gray-600">support@azaire.com</p>
                            <p className="text-[10px] text-gray-500">Response within 24 hours</p>
                        </div>
                    </div>

                    {/* System Information */}
                    <div className="bg-gray-200 flex flex-col gap-2 rounded-lg p-3">
                        <p className="font-medium text-sm">System Information</p>
                        <p className="text-xs">Version: 1.0.0</p>
                        <p className="text-xs">Last Updated: July 2024</p>
                        <p className="text-xs">License: Commercial</p>
                    </div>

                    {/* Quick Tips */}
                    <div className="bg-blue-50 flex flex-col gap-2 rounded-lg p-3">
                        <p className="font-medium text-sm mb-1">Quick Tips</p>
                        <ul className="list-disc pl-5 space-y-1 text-xs flex flex-col gap-1">
                            <li>Include screenshots when reporting issues</li>
                            <li>Describe the steps to reproduce the problem</li>
                            <li>Mention your browser and operating system</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ContactCard;
