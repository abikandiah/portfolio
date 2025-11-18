import * as React from "react";


function CardH2Header({ Icon, title }: { Icon: React.ElementType; title: string }) {
	return (
		<h2 className="flex font-semibold">
			<Icon />
			<span className="ml-3">{title}</span>
		</h2>
	)
}

export { CardH2Header };

