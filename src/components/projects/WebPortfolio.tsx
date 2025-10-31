import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { Banner } from "../ui/banner";
import { InnerUnorderedList, UnorderedList } from "../ui/list";

export const webPortfolioProject: ProjectProps = {
    type: projectType.Personal,
    name: 'Web Portfolio',
    duration: '2025',
    description: `A website to showcase my experience as a developer, built with Typescript, React, Tailwind CSS, Shadcn-UI, and Vite. Hosted on Cloudflare as a static HTML Page.`,
    tech: [techType.TypeScript, techType.React, techType.TailwindCSS, techType.TanstackRouter],

    sections: [
        { title: 'Overview', body: Overview },
        { title: 'Goals', body: Goals }
    ]
};

function Overview() {
    return (
        <>
            <p>
                This was not only a goal to showcase myself but also to learn and upskill myself. I've done a lot of React development in my time but time goes on and things change. I needed to catch up to the latest frontend technologies and trends, as well as familiarize myself with JavaScript's good brother, TypeScript. I've written a lot of JavaScript but not so much TypeScript, so this project was a major step towards that direction.
            </p>
            <p>
                I did some research into the latest advancements and decided to stick with a React client-side rendered website. Although, I've stepped into a lot of talk against SPAs and how they're not meant for every single website, that they overcomplicate everything and not all websites need that complexity.
            </p>
            <p>
                I do understand that point and agree. A lot of templating engines and even plain HTML, CSS And JS would suffice for a lot of cases. Arguably even for this website, it did not need to be created as a React SPA.
            </p>
            <p>
                But I did it anyway. I wanted to focus on learning and building web applications, not only on simply building a portfolio website.
            </p>
        </>
    )
}

function Goals() {
    return (
        <>
            <p>
                I have a lot of goals when it comes to upskilling and advancing my technical skills:
            </p>
            <UnorderedList>
                <li>
                    Modernize my frontend development tech stack and skills by focusing on:
                    <InnerUnorderedList>
                        <li>TypeScript and the latest version of React;</li>
                        <li>Modern CSS and component libraries (including frameworks and methodologies), such as Tailwind CSS And shadcn-ui;</li>
                        <li>Themed, responsive, and accessibile design.</li>
                    </InnerUnorderedList>
                </li>

                <li>
                    Modernize my back-end development tech and skills by focusing on:
                    <InnerUnorderedList>
                        <li>Back-end server stack such as Dropwizard, Express and Django;</li>
                        <li>Databases such as SQLite, PostgreSQL and general NoSQL and Graph;</li>
                        <li>General VM usage and containerization with Docker and Kubernetes;</li>
                        <li>General networking and hosting on local and cloud providers;</li>
                        <li>General application development.</li>
                    </InnerUnorderedList>
                </li>
                <li>Learn more about distributed and data-intensive applications.</li>
                <li>Learn all things AI and machine learning.</li>
                <li>Learn Linux to the max.</li>
                <li>Get comfortable with building full-stack applications from the ground-up.</li>
            </UnorderedList>

            <h3 className="sub-heading">From the Ground Up</h3>
            <p>
                One of my major goals is to become comfortable with building entire full-stack applications from the ground up within minutes. Right now, I'd have to heavily rely on Google and AI prompts. I'd still be able to do it, but I'm not experienced enough to be able to instantly know how to connect everything. I'm nearly there, I'm simply missing the last piece of the experience in building applications from 0 to 1, where all the component setup takes place.
            </p>
            <p>z
                Such as setting up the back-end, authentication and authorization, API resources and endpoint patterns, the database and data models, the unit tests and end-to-end tests, the frontend and having it all bundled as an asset served by the back-end, and etc. I've experience starting a frontend from the bottom-up, but not so much with the rest. Everything was already in place when I began working on back-end tech; I'd just extend and add features to an existing back-end solution. Now's the time to experiment with personal projects and get comfortable.
            </p>

            <h3 className="sub-heading">Personal Projects</h3>
            <p>
                My goal with these personal projects is to learn and learn as much as I can. This website was the first in my journey and it satisfied a lot to do with modernizing my frontend tech stack. It is themed, responsive and accessible, and all built with a modern tech stack including TypeScript, React, Tanstack Router, Tailwind CSS, Shadcn-UI and Vite. It is also hosted on Cloudflare as a Page.
            </p>
            <p>
                The rest of my projects will be more heavily focused on building full-stack solutions from the ground-up. Solutions involving Java and Node back-ends, SQL and NoSQL databases, password and OIDC authentication, containerization with Docker and Kubernetes, and working with cloud providers such as AWS and Cloudflare.
            </p>
            <p>
                I want to reach a continous point where I'm knowledgeable and comfortable with building and deploying software solutions; with general expertise in most stacks and focused expertise in a few.
            </p>

            <Banner type="info"
                message="This was all written as I was wrapping up my work on this portfolio website."
            />
        </>
    )
}

