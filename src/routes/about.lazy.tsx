import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
	component: About,
});

function About() {
	return <div className="mx-auto p-2 text-center">Hello from About!</div>;
}
