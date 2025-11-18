import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { MessageBanner } from "@abumble/design-system/components/Banner";
import { OrderedList, UnorderedList } from "@abumble/design-system/components/List";

export const dataUploadProject: ProjectProps = {
	type: projectType.Work,
	name: 'Data Upload',
	duration: '2020',
	description: `A web-based tool for uploading data to data repositories for further processing with workflows.`,
	tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX,
	techType.React, techType.Dropwizard, techType.RestAPI, techType.OpenSource, techType.TusProtocol],

	sections: [
		{ title: 'Overview', body: Overview },
		{ title: 'Deep Dive', body: DeepDive }
	]
};

function Overview() {
	return (
		<>
			<p>
				This feature allows users to securely upload data for processing by the workflow automation platform. The data is uploaded to pre-defined data repositories accessible by the platform, speeding up data collection by removing the need for users to manually place the data there themselves. This is helpful when users are located across a network and don't have easy access to the automation platform servers.
			</p>
			<p>
				This is done with a duo: the <span className="font-semibold">Dataset</span> and the <span className="font-semibold">Data Repository</span>.
			</p>
			<UnorderedList>
				<li>The Dataset is the container for uploaded data and is the unit passed to workflows for processing.</li>
				<li>The Data Repository stores and governs datasets. It is located on a server accessible by the automation platform and may include filters such as max file sizes and allowed file extensions.</li>
			</UnorderedList>
			<MessageBanner type="info"
				message="Authorization policies can be set to restrict the users who can perform data uploads. Policies can be set on an individual data repository (as is true for all data models)." />

			<p>
				The upload mechanism is a feature built directly into the web application management console. It implements the tus resumable file upload protocol for reliable transfers, enabling uploads to be paused, resumed, or recovered after a network interruption. It was built by customizing and integrating two open-source projects—one for the frontend uploader and one for the backend receiving and writing process.
			</p>
			<p>
				The uploader is capable of reaching speeds over 500 Mb/s, supports transfers of terabytes of data, and works reliably across different geographical regions (e.g., tested with AWS regions).
			</p>
		</>
	)
}

function DeepDive() {
	return (
		<>
			<p>
				Initially, the two open-source projects were sufficient enough for the upload to work out-of-the-box, however, we needed to customize them to support datasets and data repositories. The backend writer was modified to only write to datasets, and to validate authorization, filters and file paths. The frontend uploader was updated with custom styles, preferred progress displays, and pre-validation checks requiring calls to the backend API.
			</p>

			<h3 className="sub-heading">Data Repositories</h3>
			<p>
				Data repositories are the parent containers for all uploaded data. They are defined and managed via the web app management console and must exist in a location accessible by the automation platform. These repositories serve as a single point of control: settings applied to a repository—such as maximum total size, max file sizes, allowed file extensions, and data cleanup behaviors—are applied to all data within.
			</p>

			<h3 className="sub-heading">Datasets</h3>
			<p>
				Datasets are child containers housed within data repositories. Before users can upload data, a dataset must first be created under an existing data repository. Functionally, a dataset is implemented as a folder inside the parent data repository's directory.
			</p>
			<p>
				When uploading to a dataset, the uploads must pass all the validation settings set on the parent data repository. When all uploads are finished, the dataset can be finalized and prepared for use in a data processing workflow. It can be used as many times and in as many workflows as needed. Once the data is no longer needed, the dataset can be archived or deleted. Archiving a dataset removes the files but maintains file metadata for information purposes.
			</p>
			<p>
				Custom metadata can also be added to uploaded files, enabling further file-specific information to be passed to processing workflows. This metadata is set through the dataset management user interface within the web application's management console.
			</p>

			<h3 className="sub-heading">Frontend Upload</h3>
			<p>
				The Uppy open-source project served as the foundation for the web upload component, providing native support for drag-and-drop functionality and implementing the frontend requirements of the tus protocol. We updated it further with custom styles and specific file validation checks.
			</p>

			<h3 className="sub-heading">Backend Writing</h3>
			<p>
				The upload writer on the backend is based on a Java open-source implementation of the tus protocol. This was heavily customized, much more than the frontend Uppy implementation, to integrate with datasets, data repositories, authorization, and file validation checks. To boost performance and integrity, we brought in several key optimizations:
			</p>
			<UnorderedList>
				<li>Improved disk writing speed by using Java ByteBuffers with larger than default sizes and by splitting reading and writing operations into separate threads.</li>
				<li>Added data integrity validation by computing MD5 file checksums in a separate thread.</li>
			</UnorderedList>

			<h3 className="sub-heading">Resumable Uploads (tus Protocol)</h3>
			<p>
				The tus protocol enables resumable uploads by tracking the progress of an upload in both the user's browser storage and the backend. To resume an interrupted upload:
			</p>
			<OrderedList className="list-number">
				<li>The frontend first checks the user's browser storage for an upload-in-progress using a unique file identifier.</li>
				<li>If found, the frontend calls the backend to verify the upload and receive the position of the last byte written.</li>
				<li>The backend responds with the last written byte position.</li>
				<li>The frontend then resumes the file transfer from the subsequent position.</li>
			</OrderedList>
			<MessageBanner type="info"
				message="Authorization checks are integral to this process, ensuring only the original user can continue the upload." />

			<h3 className="sub-heading">In-Place Data Repository</h3>
			<p>
				A futher addition to this feature is the in-place data repository. This addition enables support for all data repository and dataset functionality—including management and processing behaviors—for data that already exists on the platform servers, removing the need for uploading files.
			</p>
			<p>
				In-place data repositories are created by selecting an existing directory that is accessible by the automation platform. This is done with the help of a frontend file selector component, which available folders using backend APIs. In-place datasets are then created by selecting a child folder within the in-place data repository.
			</p>
			<MessageBanner type="info"
				message="Unlike regular data repositories, which permit file uploads and deletions, in-place datasets and repositories are strictly read-only and do not modify any files in the source directory." />
		</>
	)
}
