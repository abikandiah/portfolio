import { TextLink } from "./ui";


function Footer() {
    return (
        <footer className="mt-auto px-3 xl:px-0">
            <div className="py-16 px-3">


                <div className="flex flex-col md:items-end items-center gap-1">
                    <TextLink className="text-sm"
                        to="/disclaimer"
                        target="_blank"
                        activeProps={{ className: "pointer-events-none"}}
                    >
                        Disclaimer
                    </TextLink>

                    <span className="text-sm text-gray-500">
                        ©
                        2025
                        Abilaesh Kandiah. All rights reserved.
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default Footer;

