import { ContactRound } from "lucide-react";
import { Card, CardH2Header } from "../ui/card";

function Contact() {
    return (
        <Card>
            <CardH2Header title={'Contact'}
                Icon={ContactRound}
            />
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
// 				<span className="hidden sm:block text-gray-400">|</span>

// 				{/* Email */}
// 				<div className="flex items-center">
// 					<SendEmail email={email} showText />
// 				</div>

// 				{/* Divider for separation on larger screens */}
// 				<span className="hidden sm:block text-gray-400">|</span>

// 				{/* Dwonload Resume */}
// 				<div className="flex items-center">
// 					<DownloadResume />
// 				</div>
// 			</div>