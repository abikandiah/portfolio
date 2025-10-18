import { BriefcaseBusiness, Download } from "lucide-react"
import { Card, CardH2Header } from "../ui/card"


function WorkExperience() {
    return (
        <Card>
            <CardH2Header title={'Experience'}
                Icon={BriefcaseBusiness}
            />

            <ol className="space-y-4">
                <WorkExperienceRow companyName='Free Man' role='Individual Contributor' duration='2025 - Present'
                    logoSrc='/src/assets/bee.svg' />

                <WorkExperienceRow companyName='Nuix' role='Senior Software Engineer' duration='2023 - 2025'
                    logoSrc='/src/assets/nuix.png' />

                <WorkExperienceRow companyName='Rampiva' role='Software Developer' duration='2018 - 2023'
                    logoSrc='/src/assets/rampiva.png' />
            </ol>

            <DownloadResume />
        </Card>
    )
}

interface WorkExperienceRowProps {
    companyName: string
    role: string
    duration: string
    logoSrc: string
}

function WorkExperienceRow({ companyName, role, duration, logoSrc }: WorkExperienceRowProps) {
    return (
        <li className="flex gap-4">
            <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full 
                shadow-md ring-1 shadow-stone-800/5 ring-stone-900/5"
            >
                <img className="h-7 w-7" src={logoSrc} alt={`${companyName} Logo`}
                    loading="lazy" decoding="async" data-nimg="1"
                />
            </div>

            <dl className="flex flex-auto flex-wrap gap-x-2">
                <dt className='sr-only'>Company</dt>
                <dd className="w-full flex-none text-sm font-medium leading-6 text-gray-900">
                    {companyName}
                </dd>
                <dt className='sr-only'>Role</dt>
                <dd className="text-xs leading-5 text-gray-500">
                    {role}
                </dd>
                <dt className='sr-only'>Duration</dt>
                <dd className="ml-auto text-xs leading-5 text-gray-500">
                    {duration}
                </dd>
            </dl>
        </li>
    )
}

function DownloadResume() {
	return (
		<a href={"/src/assets/Abilaesh Kandiah - Resume.pdf"} download
			className="flex items-center mx-auto"
			title="Download CV"
		>
			<span className="mr-2 font-medium">Download CV</span>
			<Download />
		</a>
	)
}

export default WorkExperience;

