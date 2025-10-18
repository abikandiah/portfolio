import { personalEmail, personalLocation, personalMobile } from "@/constants";
import { ContactRound, Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";

function Contact() {
    return (
        <Card>
            <CardHeader>
                <h2 className="flex font-semibold">
                    <ContactRound />
                    <span className="ml-3">Contact</span>
                </h2>

                <CardDescription>
                    Feel free to reach out and say hello!
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ol className="space-y-2">
                    <li className="flex gap-4">
                        <MapPin />
                        {personalLocation}
                    </li>

                    <li className="flex gap-4">
                        <Mail />
                        {personalEmail}
                    </li>

                    <li className="flex gap-4">
                        <Phone />
                        {personalMobile}
                    </li>
                </ol>
            </CardContent>
        </Card>
    )
}

export default Contact;

// ]			{/* 3. Contact & Location Details */}
// 			<div className="mt-4 flex flex-wrap justify-center space-x-4 sm:space-x-4 text-base text-gray-600">

// 				{/* Location */}
// 				<div className="flex items-center">
// 					<MapPin />
// 					<span className="font-medium ml-2">Toronto, Canada (Open to Remote)</span>
// 				</div>

// 				{/* Divider for separation on larger screens */}
// 				<span className="hidden sm:block text-gray-500">|</span>

// 				{/* Email */}
// 				<div className="flex items-center">
// 					<SendEmail email={email} showText />
// 				</div>

// 				{/* Divider for separation on larger screens */}
// 				<span className="hidden sm:block text-gray-500">|</span>

// 				{/* Dwonload Resume */}
// 				<div className="flex items-center">
// 					<DownloadResume />
// 				</div>
// 			</div>