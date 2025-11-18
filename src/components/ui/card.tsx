import * as React from "react";


export function CardH2Header({ Icon, title }: { Icon: React.ElementType; title: string }) {
	return (
		<h2 className="flex font-semibold">
			<Icon />
			<span className="ml-3">{title}</span>
		</h2>
	)
}

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@abumble/design-system/components/Card";

export {
	Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
};

