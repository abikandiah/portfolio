import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const dataUploadProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Data Upload',
    duration: '2020',
    description: `A data set upload tool for uploading data to admin-defined repositories. Implements the tus resumable file upload protocol with the help of two open source projects; Uppy for the frontend and another for the back-end.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX,
    techType.React, techType.Dropwizard, techType.RestAPI, techType.OpenSource, techType.TusProtocol],

    sections: [
        { title: 'Overview', body: Overview },
        { title: 'Architecture', body: Architecture }
    ]
};

function Overview() {
    return (
        <>
            <p>
                Before processing data, it first needs to be brought in to the processing platform. We created this tool to help bring data in. Users would connect to the platform via the web app and then upload data to data sets. They then submit those data sets with a workflow for processing.
            </p>
            <p>
                The data upload tool follows the tus resumable file upload protocol and allows pausing and resuming multiple uploads. It was implemented with two open source projects. We started with the open source implementations and then customized them as needed. We used Uppy for the React frontend and a Java implementation for the back-end.
            </p>
            <p>
                The upload speed reached over 500 Mb/s and can be used to upload TBs of data. It has been used to upload data across separate AWS regions.
            </p>
        </>
    )
}

function Architecture() {
    return (
        <>
            <p>
                The upload tool was implemented with two models and a series of REST endpoints. The models would specify the repository location, filters and quotas.
            </p>

            <h3 className="sub-heading">Data Repository</h3>
            <p>
                All data sets lived inside data repositories. Admins would define a repository and its location, file filters and size quotas. Repositories could only be created in locations accessible by the main processing platform.
            </p>

            <h3 className="sub-heading">Data Sets</h3>
            <p>
                Data gets uploaded into data sets. Data sets are folders within a data repository. When a data set gets sent to processing, the folder behind it is used as the source data.
            </p>

            <h3 className="sub-heading">Core Upload</h3>
            <p>
                The uploading logic was written in Java and uses Java ByteBuffers, Threads and Synchronization tools to parallelize reading, writing and hashing of the uploaded bytes.
            </p>
        </>
    )
}
