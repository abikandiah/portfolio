import { University } from "lucide-react";
import { Card, CardH2Header } from "../ui/card";

function Education() {
    return (
        <Card>
            <CardH2Header title={'Education'}
                Icon={University}
            />

            <ol className="space-y-4">
                <EducationRow school='Toronto Metropolitan University' degree='B.Eng, Computer Engineering' duration='2014 - 2018'
                    logoSrc='/src/assets/tmu.svg' />
            </ol>
        </Card>
    )
}

interface EducationRowProps {
    school: string
    degree: string
    duration: string
    logoSrc: string
}

function EducationRow({ school, degree, duration, logoSrc }: EducationRowProps) {
    return (
        <li className="flex gap-4">
            <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full 
                shadow-md ring-1 shadow-stone-800/5 ring-stone-900/5"
            >
                <img className="h-7 w-7" src={logoSrc} alt={`${school} Logo`}
                    loading="lazy" decoding="async" data-nimg="1"
                />
            </div>

            <dl className="flex flex-auto flex-wrap gap-x-2">
                <dt className='sr-only'>School</dt>
                <dd className="w-full flex-none text-sm font-medium leading-6 text-gray-900">
                    {school}
                </dd>
                <dt className='sr-only'>Degree</dt>
                <dd className="text-xs leading-5 text-gray-600">
                    {degree}
                </dd>
                <dt className='sr-only'>Duration</dt>
                <dd className="ml-auto text-xs leading-5 text-gray-500">
                    {duration}
                </dd>
            </dl>
        </li>
    )
}

export default Education;

